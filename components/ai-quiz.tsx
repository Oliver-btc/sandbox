"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from '@/components/ui/use-toast';

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: number;
  logoUrl: string;
  siteName: string;
}

export function AIQuiz() {
  const searchParams = useSearchParams();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setIsLoading(true);
        const sessionId = searchParams?.get('session');

        if (sessionId) {
          console.log('Fetching quiz data for session:', sessionId);
          const blobUrl = `${process.env.NEXT_PUBLIC_BLOB_BASE_URL}/sessions/${sessionId}.json`;
          
          const response = await fetch(blobUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.quiz) {
              console.log('Successfully fetched quiz data');
              setQuizData(data.quiz);
            } else {
              throw new Error('No quiz data found in session');
            }
          } else {
            throw new Error('Failed to fetch session data');
          }
        } else {
          // Fallback to localStorage if no session ID
          const storedResults = localStorage.getItem('analysisResults');
          if (storedResults) {
            const parsedResults = JSON.parse(storedResults);
            if (parsedResults.quiz) {
              setQuizData(parsedResults.quiz);
            } else {
              throw new Error('No quiz data found in localStorage');
            }
          } else {
            throw new Error('No quiz data available');
          }
        }
      } catch (error) {
        console.error('Error loading quiz data:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [searchParams]);

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
      setIsAnswered(true);

      if (index === quizData?.correctAnswer) {
        toast({
          title: "Correct! 🎉",
          description: "Well done! You got it right!",
          variant: "default",
        });
      } else {
        toast({
          title: "Not quite right",
          description: "Try again! The correct answer has been highlighted.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#F7931A] to-black">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#F7931A] to-black">
        <div className="text-white text-xl">Failed to load quiz data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7931A] to-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-black/20 border-2 border-[#F7931A]">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Logo and Site Name */}
              <div className="flex items-center space-x-2">
                <img
                  src={quizData.logoUrl}
                  alt={`${quizData.siteName} logo`}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white font-medium">{quizData.siteName}</span>
              </div>

              {/* Question */}
              <h2 className="text-xl md:text-2xl text-white text-center font-semibold">
                {quizData.question}
              </h2>

              {/* Answer Options */}
              <div className="w-full space-y-4">
                {quizData.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left transition-colors ${
                      isAnswered
                        ? index === quizData.correctAnswer
                          ? 'bg-green-500 hover:bg-green-600'
                          : index === selectedAnswer
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    disabled={isAnswered}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}