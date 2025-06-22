"use client";

import { useState, useEffect } from "react";
import { NutritionalGoals } from "@/components/goals-manager";

const DEFAULT_GOALS: NutritionalGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
  fiber: 25,
  sugar: 50,
};

const STORAGE_KEY = "nutritional-goals";

export function useGoals() {
  const [goals, setGoals] = useState<NutritionalGoals>(DEFAULT_GOALS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load goals from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedGoals = JSON.parse(stored);
        setGoals(parsedGoals);
      }
    } catch (error) {
      console.error("Failed to load goals from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateGoals = (newGoals: NutritionalGoals) => {
    setGoals(newGoals);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals));
    } catch (error) {
      console.error("Failed to save goals to localStorage:", error);
    }
  };

  return {
    goals,
    updateGoals,
    isLoaded,
  };
}