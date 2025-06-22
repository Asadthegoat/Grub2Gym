"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { NutritionalGoals } from "./goals-manager";

interface NutritionInfo {
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  sugars: number;
}

interface GoalProgressProps {
  nutrition: NutritionInfo;
  goals: NutritionalGoals;
}

export function GoalProgress({ nutrition, goals }: GoalProgressProps) {
  const progressItems = [
    {
      name: "Calories",
      current: nutrition.calories,
      goal: goals.calories,
      unit: "kcal",
      color: "bg-orange-500",
    },
    {
      name: "Protein",
      current: nutrition.protein,
      goal: goals.protein,
      unit: "g",
      color: "bg-red-500",
    },
    {
      name: "Carbs",
      current: nutrition.carbs,
      goal: goals.carbs,
      unit: "g",
      color: "bg-blue-500",
    },
    {
      name: "Fat",
      current: nutrition.fat,
      goal: goals.fat,
      unit: "g",
      color: "bg-yellow-500",
    },
    {
      name: "Sugar",
      current: nutrition.sugars,
      goal: goals.sugar,
      unit: "g",
      color: "bg-purple-500",
    },
  ];

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressStatus = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return "complete";
    if (percentage >= 80) return "close";
    return "progress";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "close":
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "text-green-600 bg-green-50 border-green-200";
      case "close":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <Card className="fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {progressItems.map((item) => {
          const percentage = getProgressPercentage(item.current, item.goal);
          const status = getProgressStatus(item.current, item.goal);
          const remaining = Math.max(item.goal - item.current, 0);

          return (
            <div key={item.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="font-medium">{item.name}</span>
                  {getStatusIcon(status)}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {item.current.toFixed(1)} / {item.goal} {item.unit}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}% complete
                  </div>
                </div>
              </div>
              
              <Progress value={percentage} className="h-2" />
              
              {remaining > 0 && (
                <div className={`text-xs p-2 rounded border ${getStatusColor(status)}`}>
                  {remaining.toFixed(1)} {item.unit} remaining to reach your goal
                </div>
              )}
              
              {status === "complete" && (
                <div className="text-xs p-2 rounded border text-green-600 bg-green-50 border-green-200">
                  🎉 Goal achieved! Great job!
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}