"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onBack: () => void;
  logoUrl?: string;
  siteName?: string;
}

export function Quiz({ 
  question, 
  options, 
  correctAnswer, 
  onBack,
  logoUrl,
  siteName 
}: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);

  const handleAnswerSelection = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
      setIsAnswered(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-black/20 border-2 border-[#F7931A]">
        <CardContent className="p-6">
          {/* Logo section - removed background container */}
          {logoUrl && (
            <div className="flex justify-center mb-8">
              <img
                src={logoUrl}
                alt="Company logo"
                className="w-40 h-40 object-contain"
              />
            </div>
          )}

          <h2 className="text-xl font-bold text-white mb-6 text-center">
            {question}
          </h2>
          <div className="space-y-4">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelection(index)}
                className={`w-full min-h-[60px] px-4 py-3 flex items-center justify-center text-center whitespace-normal break-words text-black ${
                  selectedAnswer === index
                    ? index === correctAnswer
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                    : 'bg-[#F7931A] hover:bg-[#e68b15]'
                } ${
                  isAnswered && index === correctAnswer
                    ? 'border-2 border-green-500'
                    : ''
                }`}
                disabled={isAnswered}
              >
                <span className="inline-block w-full text-center text-black">
                  {option}
                </span>
              </Button>
            ))}
          </div>
          {isAnswered && (
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-white mb-4">
                {selectedAnswer === correctAnswer 
                  ? "Correct! Well done! 🎉" 
                  : "Not quite right. Try again! 🤔"}
              </p>
              <Button
                onClick={onBack}
                className="bg-[#F7931A] hover:bg-[#e68b15] text-black"
              >
                Back to Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}