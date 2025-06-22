"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Settings, Save, X, Plus } from "lucide-react";

export interface NutritionalGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface GoalsManagerProps {
  goals: NutritionalGoals;
  onGoalsUpdate: (goals: NutritionalGoals) => void;
}

const DEFAULT_GOALS: NutritionalGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  fiber: 25,
  sugar: 50,
};

export function GoalsManager({ goals, onGoalsUpdate }: GoalsManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState<NutritionalGoals>(goals);

  useEffect(() => {
    setTempGoals(goals);
  }, [goals]);

  const handleSave = () => {
    onGoalsUpdate(tempGoals);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempGoals(goals);
    setIsEditing(false);
  };

  const handleInputChange = (key: keyof NutritionalGoals, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTempGoals(prev => ({ ...prev, [key]: numValue }));
  };

  const goalFields = [
    { key: 'calories' as keyof NutritionalGoals, label: 'Calories', unit: 'kcal', color: 'bg-orange-500' },
    { key: 'protein' as keyof NutritionalGoals, label: 'Protein', unit: 'g', color: 'bg-red-500' },
    { key: 'carbs' as keyof NutritionalGoals, label: 'Carbs', unit: 'g', color: 'bg-blue-500' },
    { key: 'fat' as keyof NutritionalGoals, label: 'Fat', unit: 'g', color: 'bg-yellow-500' },
    { key: 'fiber' as keyof NutritionalGoals, label: 'Fiber', unit: 'g', color: 'bg-green-500' },
    { key: 'sugar' as keyof NutritionalGoals, label: 'Sugar', unit: 'g', color: 'bg-purple-500' },
  ];

  if (!isEditing) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Daily Goals
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Edit Goals
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {goalFields.map((field) => (
              <div key={field.key} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                <div className={`w-3 h-3 rounded-full ${field.color}`}></div>
                <div>
                  <p className="text-sm font-medium">{field.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {goals[field.key]} {field.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Edit Daily Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${field.color}`}></div>
                {field.label} ({field.unit})
              </label>
              <Input
                type="number"
                value={tempGoals[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                min="0"
                step={field.key === 'calories' ? '10' : '0.1'}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Goals
          </Button>
          <Button variant="outline" onClick={handleCancel} className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}