"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Heart, Beef } from "lucide-react";

interface NutritionInfo {
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  sugars: number;
  // Optional fields that may not be available
  saturated_fat?: number;
  cholesterol?: number;
  iron?: number;
  vitamin_c?: number;
  vitamin_d?: number;
}

interface NutritionDisplayProps {
  nutrition: NutritionInfo;
}

export function NutritionDisplay({ nutrition }: NutritionDisplayProps) {
  const macros = [
    {
      name: "Calories",
      value: nutrition.calories.toFixed(0),
      unit: "kcal",
      icon: Zap,
      color: "bg-orange-500",
    },
    {
      name: "Protein",
      value: nutrition.protein.toFixed(1),
      unit: "g",
      icon: Beef,
      color: "bg-red-500",
    },
    {
      name: "Carbs",
      value: nutrition.carbs.toFixed(1),
      unit: "g",
      icon: Activity,
      color: "bg-blue-500",
    },
    {
      name: "Fat",
      value: nutrition.fat.toFixed(1),
      unit: "g",
      icon: Heart,
      color: "bg-yellow-500",
    },
  ];

  // Only include micronutrients that are available
  const micronutrients = [
    { name: "Sugars", value: nutrition.sugars.toFixed(1), unit: "g" },
    ...(nutrition.saturated_fat !== undefined ? [{ name: "Saturated Fat", value: nutrition.saturated_fat.toFixed(1), unit: "g" }] : []),
    ...(nutrition.cholesterol !== undefined ? [{ name: "Cholesterol", value: nutrition.cholesterol.toFixed(0), unit: "mg" }] : []),
    ...(nutrition.iron !== undefined ? [{ name: "Iron", value: nutrition.iron.toFixed(1), unit: "mg" }] : []),
    ...(nutrition.vitamin_c !== undefined ? [{ name: "Vitamin C", value: nutrition.vitamin_c.toFixed(1), unit: "mg" }] : []),
    ...(nutrition.vitamin_d !== undefined ? [{ name: "Vitamin D", value: nutrition.vitamin_d.toFixed(1), unit: "mcg" }] : []),
  ];

  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Nutritional Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Macronutrients */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {macros.map((macro) => {
            const Icon = macro.icon;
            return (
              <div
                key={macro.name}
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`p-2 rounded-full ${macro.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {macro.name}
                  </p>
                  <p className="text-lg font-bold">
                    {macro.value}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {macro.unit}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Micronutrients - only show if we have additional data */}
        {micronutrients.length > 1 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Additional Nutrients
            </h4>
            <div className="flex flex-wrap gap-2">
              {micronutrients.map((nutrient) => (
                <Badge key={nutrient.name} variant="secondary" className="text-xs">
                  {nutrient.name}: {nutrient.value}{nutrient.unit}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}