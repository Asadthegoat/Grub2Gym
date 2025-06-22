"use client";

import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X } from "lucide-react";

interface CameraScannerProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  isIdentifying: boolean;
}

export function CameraScanner({ onCapture, onClose, isIdentifying }: CameraScannerProps) {
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Scan Your Meal</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isIdentifying}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="absolute top-0 left-0 w-full h-full object-cover"
            videoConstraints={{ facingMode: "environment" }}
          />
          {isIdentifying && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-4 font-medium">Identifying food...</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center gap-3">
          <Button 
            onClick={handleCapture} 
            disabled={isIdentifying}
            size="lg"
            className="px-8"
          >
            <Camera className="h-4 w-4 mr-2" />
            Capture
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isIdentifying}
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}