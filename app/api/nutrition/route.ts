import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- DATA STRUCTURES ---

type NutritionInfo = {
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  sugars: number;
};

// --- HELPER FUNCTIONS ---

function extractJson(text: string): any {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
  if (!jsonMatch) {
    // If no JSON block is found, assume the whole response is the JSON object.
    // This makes it robust to cases where the AI doesn't use the markdown.
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse text as JSON:", text);
      throw new Error("Could not find a valid JSON object in the AI response.");
    }
  }
  const jsonString = jsonMatch[1] || jsonMatch[2];
  return JSON.parse(jsonString);
}

function createWorkoutPrompt(nutrition: NutritionInfo): string {
    return `
    Based on the following nutritional information for a meal, create a structured workout plan.
    Nutritional Info:
    - Calories: ${nutrition.calories.toFixed(0)}
    - Fat: ${nutrition.fat.toFixed(1)}g
    - Protein: ${nutrition.protein.toFixed(1)}g
    - Carbohydrates: ${nutrition.carbs.toFixed(1)}g
    - Sugars: ${nutrition.sugars.toFixed(1)}g

    Your response must be a perfectly formatted JSON object with the following structure.
    Do not include any text, markdown, or explanation outside of the JSON object itself.
    
    The value for "sets" MUST be a number.
    The value for "reps" MUST be a string (e.g., "10-12", "AMRAP", "30 seconds").

    Example Format:
    {
      "title": "Workout Title",
      "focus": "Brief (1-sentence) summary of the workout's main goal.",
      "exercises": [
        { "name": "Squats", "sets": 3, "reps": "12-15" },
        { "name": "Push-ups", "sets": 3, "reps": "AMRAP" },
        { "name": "Plank", "sets": 4, "reps": "60 seconds" }
      ]
    }
    `;
}

function createStandardizeMealPrompt(meal: string): string {
  return `A user has described their meal. Your task is to extract the individual food items and quantities, and return them as a simple, comma-separated list. Focus on clarity and simplicity for a nutrition database. Do not add any conversational text or explanation. User Input: "${meal}"`;
}

// --- MAIN API ROUTE ---

export async function POST(request: Request) {
  try {
    const { NUTRITIONIX_APP_ID, NUTRITIONIX_APP_KEY, GEMINI_API_KEY } = process.env;

    if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_APP_KEY || !GEMINI_API_KEY) {
      throw new Error("API credentials are not configured on the server.");
    }

    const body = await request.json();
    const meal = body.meal;

    if (!meal) {
      return NextResponse.json({ error: "Meal description is required." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Step 1: Standardize the user's meal query with Gemini
    const standardizePrompt = createStandardizeMealPrompt(meal);
    const standardizeResult = await model.generateContent(standardizePrompt);
    const standardizedMeal = standardizeResult.response.text().trim();
    
    // DEBUG LOG: See what the standardized query looks like
    console.log(`Original Meal: "${meal}" -> Standardized Meal: "${standardizedMeal}"`);

    // Step 2: Get nutritional info for the standardized query
    const nutritionixResponse = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_APP_KEY,
      },
      body: JSON.stringify({ query: standardizedMeal }),
    });

    if (!nutritionixResponse.ok) {
        const errorText = await nutritionixResponse.text();
        throw new Error(`Nutritionix API responded with status: ${nutritionixResponse.status}. Body: ${errorText}`);
    }
    const nutritionixData = await nutritionixResponse.json();

    if (!nutritionixData.foods || nutritionixData.foods.length === 0) {
      return NextResponse.json({ error: `Could not find any nutritional data for "${standardizedMeal}". Please try a different description.` }, { status: 404 });
    }

    // Aggregate nutritional info from all foods found
    const totalNutrition: NutritionInfo = nutritionixData.foods.reduce((acc: NutritionInfo, food: any) => {
        acc.calories += food.nf_calories || 0;
        acc.fat += food.nf_total_fat || 0;
        acc.protein += food.nf_protein || 0;
        acc.carbs += food.nf_total_carbohydrate || 0;
        acc.sugars += food.nf_sugars || 0;
        return acc;
    }, { calories: 0, fat: 0, protein: 0, carbs: 0, sugars: 0 });

    // Step 3: Generate the workout plan from the aggregated nutritional data
    const workoutPrompt = createWorkoutPrompt(totalNutrition);
    const workoutResult = await model.generateContent(workoutPrompt);
    const workoutText = workoutResult.response.text();
    const workout = extractJson(workoutText);

    // Return both the aggregated nutrition and the generated workout
    return NextResponse.json({ nutrition: totalNutrition, workout });

  } catch (error: any) {
    console.error("An error occurred in /api/nutrition:", error.message);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}