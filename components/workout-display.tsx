"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Target, Clock } from "lucide-react";

interface Exercise {
  name: string;
  reps: string;
  sets: number;
}

interface WorkoutPlan {
  title: string;
  focus: string;
  exercises: Exercise[];
}

interface WorkoutDisplayProps {
  workout: WorkoutPlan;
}

export function WorkoutDisplay({ workout }: WorkoutDisplayProps) {
  return (
    <Card className="fade-in border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Dumbbell className="h-5 w-5" />
          {workout.title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>{workout.focus}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/20 transition-colors card-hover"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-foreground mb-1">
                  {exercise.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {exercise.sets} sets
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {exercise.reps} reps
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}