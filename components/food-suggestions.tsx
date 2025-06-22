"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, Sparkles } from "lucide-react";
import { NutritionalGoals } from "./goals-manager";

interface NutritionInfo {
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  sugars: number;
}

interface FoodSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  reason: string;
}

interface FoodSuggestionsProps {
  nutrition: NutritionInfo;
  goals: NutritionalGoals;
  onAddFood: (food: string) => void;
}

export function FoodSuggestions({ nutrition, goals, onAddFood }: FoodSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);

  const calculateDeficits = useCallback(() => {
    return {
      calories: Math.max(goals.calories - nutrition.calories, 0),
      protein: Math.max(goals.protein - nutrition.protein, 0),
      carbs: Math.max(goals.carbs - nutrition.carbs, 0),
      fat: Math.max(goals.fat - nutrition.fat, 0),
    };
  }, [goals.calories, goals.protein, goals.carbs, goals.fat, nutrition.calories, nutrition.protein, nutrition.carbs, nutrition.fat]);

  const generateSuggestions = useCallback(() => {
    const deficits = calculateDeficits();
    const suggestions: FoodSuggestion[] = [];

    // High protein suggestions
    if (deficits.protein > 20) {
      suggestions.push(
        {
          name: "Grilled chicken breast (100g)",
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          reason: "High protein, low fat"
        },
        {
          name: "Greek yogurt (1 cup)",
          calories: 130,
          protein: 23,
          carbs: 9,
          fat: 0,
          reason: "Protein-rich with probiotics"
        },
        {
          name: "Protein shake with whey",
          calories: 120,
          protein: 25,
          carbs: 3,
          fat: 1,
          reason: "Quick protein boost"
        }
      );
    } else if (deficits.protein > 10) {
      suggestions.push(
        {
          name: "Hard-boiled eggs (2 large)",
          calories: 140,
          protein: 12,
          carbs: 1,
          fat: 10,
          reason: "Complete protein source"
        },
        {
          name: "Cottage cheese (1/2 cup)",
          calories: 110,
          protein: 14,
          carbs: 5,
          fat: 5,
          reason: "High protein, moderate calories"
        }
      );
    }

    // High carb suggestions
    if (deficits.carbs > 50) {
      suggestions.push(
        {
          name: "Brown rice (1 cup cooked)",
          calories: 220,
          protein: 5,
          carbs: 45,
          fat: 2,
          reason: "Complex carbs for energy"
        },
        {
          name: "Banana with oats",
          calories: 200,
          protein: 6,
          carbs: 40,
          fat: 3,
          reason: "Natural sugars and fiber"
        }
      );
    } else if (deficits.carbs > 20) {
      suggestions.push(
        {
          name: "Apple with peanut butter",
          calories: 190,
          protein: 8,
          carbs: 25,
          fat: 8,
          reason: "Balanced macro snack"
        }
      );
    }

    // Healthy fat suggestions
    if (deficits.fat > 15) {
      suggestions.push(
        {
          name: "Avocado (1/2 medium)",
          calories: 160,
          protein: 2,
          carbs: 9,
          fat: 15,
          reason: "Healthy monounsaturated fats"
        },
        {
          name: "Mixed nuts (1 oz)",
          calories: 170,
          protein: 6,
          carbs: 6,
          fat: 15,
          reason: "Healthy fats and protein"
        }
      );
    }

    // Balanced suggestions for overall calorie deficit
    if (deficits.calories > 300) {
      suggestions.push(
        {
          name: "Quinoa bowl with vegetables",
          calories: 300,
          protein: 12,
          carbs: 50,
          fat: 8,
          reason: "Complete meal with balanced macros"
        },
        {
          name: "Salmon fillet (150g)",
          calories: 280,
          protein: 42,
          carbs: 0,
          fat: 12,
          reason: "High protein with omega-3s"
        }
      );
    }

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }, [calculateDeficits]);

  const deficits = useMemo(() => calculateDeficits(), [calculateDeficits]);
  const hasSignificantDeficits = useMemo(() => 
    Object.values(deficits).some(deficit => deficit > 5), 
    [deficits]
  );

  useEffect(() => {
    const hasDeficits = Object.values(deficits).some(deficit => deficit > 5);
    
    if (hasDeficits) {
      setSuggestions(generateSuggestions());
    } else {
      setSuggestions([]);
    }
  }, [deficits, generateSuggestions]);

  if (!hasSignificantDeficits) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-green-600 text-2xl">🎉</div>
            <p className="font-medium text-green-800">You&apos;re doing great!</p>
            <p className="text-sm text-green-600">
              You&apos;re close to or have met most of your nutritional goals for this meal.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fade-in border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Lightbulb className="h-5 w-5" />
          Food Suggestions
        </CardTitle>
        <div className="text-sm text-blue-600">
          Based on your remaining goals, here are some foods that could help:
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deficit Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.entries(deficits).map(([key, value]) => {
            if (value <= 5) return null;
            return (
              <Badge key={key} variant="outline" className="justify-center py-1">
                {value.toFixed(0)} {key === 'calories' ? 'kcal' : 'g'} {key}
              </Badge>
            );
          })}
        </div>

        {/* Food Suggestions */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 rounded-lg bg-white border border-blue-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex-grow space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddFood(suggestion.name)}
                    className="ml-2 gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-blue-600 italic">{suggestion.reason}</p>
                <div className="flex gap-2 text-xs text-gray-600">
                  <span>{suggestion.calories} cal</span>
                  <span>•</span>
                  <span>{suggestion.protein}g protein</span>
                  <span>•</span>
                  <span>{suggestion.carbs}g carbs</span>
                  <span>•</span>
                  <span>{suggestion.fat}g fat</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-blue-600 bg-blue-100 p-3 rounded-lg">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="h-3 w-3" />
            <span className="font-medium">Pro tip:</span>
          </div>
          These suggestions are based on your current meal and remaining daily goals. 
          Consider your other meals throughout the day when making food choices.
        </div>
      </CardContent>
    </Card>
  );
}