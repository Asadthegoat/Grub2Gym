"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CameraScanner } from "@/components/camera-scanner";
import { NutritionDisplay } from "@/components/nutrition-display";
import { WorkoutDisplay } from "@/components/workout-display";
import { GoalsManager } from "@/components/goals-manager";
import { GoalProgress } from "@/components/goal-progress";
import { FoodSuggestions } from "@/components/food-suggestions";
import { useGoals } from "@/hooks/use-goals";
import { Camera, Utensils, Sparkles, AlertCircle } from "lucide-react";

// --- DATA STRUCTURES ---

type NutritionInfo = {
  calories: number;
  fat: number;
  saturated_fat: number;
  cholesterol: number;
  protein: number;
  carbs: number;
  sugars: number;
  iron: number;
  vitamin_c: number;
  vitamin_d: number;
};

type Exercise = {
  name: string;
  reps: string;
  sets: number;
};

type WorkoutPlan = {
  title: string;
  focus: string;
  exercises: Exercise[];
};

// --- HELPER FUNCTION ---

function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// --- MAIN COMPONENT ---

export default function Home() {
  // Goals management
  const { goals, updateGoals, isLoaded } = useGoals();
  
  // State for meal input and results
  const [meal, setMeal] = useState("");
  const [nutrition, setNutrition] = useState<NutritionInfo | null>(null);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for camera functionality
  const [isScanning, setIsScanning] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meal.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setNutrition(null);
    setWorkout(null);

    try {
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meal }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch nutrition data. Please try again.");
      }

      const data = await response.json();
      setNutrition(data.nutrition);
      setWorkout(data.workout);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanClick = () => {
    setError(null);
    setIsScanning(true);
  };
  
  const handleCapture = useCallback(async (imageSrc: string) => {
    setIsIdentifying(true);
    setError(null);
    
    try {
      const imageBlob = dataURLtoBlob(imageSrc);

      const response = await fetch('/api/scan', {
        method: 'POST',
        body: imageBlob,
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed with status: ${response.status}`);
      }

      const identifiedMeal = await response.text();
      setMeal(identifiedMeal);
      setIsScanning(false);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsIdentifying(false);
    }
  }, []);

  const handleCloseScanner = () => {
    setIsScanning(false);
    setIsIdentifying(false);
  };

  const handleAddFood = (food: string) => {
    const currentMeal = meal.trim();
    const newMeal = currentMeal ? `${currentMeal}, ${food}` : food;
    setMeal(newMeal);
  };

  // Don't render until goals are loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {isScanning ? (
          <CameraScanner
            onCapture={handleCapture}
            onClose={handleCloseScanner}
            isIdentifying={isIdentifying}
          />
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                AI-Powered Fitness Assistant
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Your<span className="text-primary">.</span>Fitness<span className="text-primary">.</span>Buddy
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Analyze your meals, track your goals, and get personalized workout recommendations powered by AI
              </p>
            </div>

            {/* Goals Manager */}
            <GoalsManager goals={goals} onGoalsUpdate={updateGoals} />

            {/* Input Section */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  What did you eat?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Button 
                    onClick={handleScanClick}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Scan with Camera
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-border"></div>
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 border-t border-border"></div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Input
                    type="text"
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                    placeholder="e.g., '2 eggs and a slice of toast'"
                    className="flex-1 text-base"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !meal.trim()}
                    size="lg"
                    className="px-8"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      "Get Plan"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <p className="font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Your buddy is thinking...</p>
                      <p className="text-sm text-muted-foreground">
                        Analyzing nutrition and creating your workout plan
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Results */}
            {nutrition && workout && (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <NutritionDisplay nutrition={nutrition} />
                  <GoalProgress nutrition={nutrition} goals={goals} />
                </div>
                <FoodSuggestions 
                  nutrition={nutrition} 
                  goals={goals} 
                  onAddFood={handleAddFood}
                />
                <WorkoutDisplay workout={workout} />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground">
          Built by me
        </footer>
      </div>
    </div>
  );
}