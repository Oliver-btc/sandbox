"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from 'next/navigation';
import { Footer } from "@/components/Footer"; 

interface QuizData {
  logoUrl: string;
  siteName: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const handleBooking = (calendlyUrl: string) => {
  window.open(calendlyUrl, '_blank');
};

export function AIQuiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const sessionId = searchParams?.get('session');

        if (sessionId) {
          // Try to get data from Blob storage
          const blobUrl = `${process.env.NEXT_PUBLIC_BLOB_BASE_URL}/sessions/${sessionId}.json`;
          const response = await fetch(blobUrl);
          
          if (response.ok) {
            const data = await response.json();
            if (data.quiz) {
              setQuizData(data.quiz);
              return;
            }
          }
        }

        // Fallback to localStorage if no session or Blob fetch failed
        const storedResults = localStorage.getItem('analysisResults');
        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          if (parsedResults.quiz) {
            setQuizData(parsedResults.quiz);
          } else {
            setError('Quiz data not found');
          }
        } else {
          router.push('/');
        }
      } catch (err) {
        setError('Failed to load quiz');
        console.error('Error loading quiz:', err);
      }
    };

    loadQuizData();
  }, [router, searchParams]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    // Clean up stored data
    localStorage.removeItem('analysisResults');
    // Redirect after 3 seconds
    setTimeout(() => {
      router.push('/history-claim');
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16 space-x-4">
            <h1 className="text-2xl font-bold text-white">Survey by</h1>
            {quizData?.logoUrl && quizData?.siteName && (
              <div className="flex items-center">
                <img
                  src={quizData.logoUrl}
                  alt={quizData.siteName}
                  className="h-12 w-auto object-contain rounded-2xl"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 text-white pt-20">
        <div className="max-w-2xl mx-auto">
          {error ? (
            <div className="text-center text-red-500 mt-4">
              {error}
            </div>
          ) : !quizData ? (
            <div className="text-center mt-4">
              Loading quiz...
            </div>
          ) : (
            <Card className="bg-black/20 border-2 border-[#F7931A]">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  {/* Logo */}
                  {quizData.logoUrl && quizData.siteName && (
                    <div className="flex items-center justify-center">
                      <img
                        src={quizData.logoUrl}
                        alt={quizData.siteName}
                        className="w-26 h-26 rounded"
                      />
                    </div>
                  )}

                  {/* Question */}
                  <h3 className="text-2xl font-semibold text-center text-white mb-8">
                    {quizData.question}
                  </h3>

                  {/* Answer Options */}
                  <div className="w-full space-y-3">
                    {quizData.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full min-h-[60px] py-3 px-6 text-center text-md font-medium whitespace-normal break-words ${
                          selectedAnswer === index
                            ? 'bg-[#F7931A] hover:bg-[#e68b15] text-white'
                            : 'bg-gradient-to-b from-[#F7931A] to-black hover:bg-[#deb887] text-white'
                        }`}
                        disabled={showResult}
                      >
                        <span className="block w-full">
                          {option}
                        </span>
                      </Button>
                    ))}
                  </div>

                  {/* Thank You Message Overlay */}
                  {showResult && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
                      <div className="bg-gradient-to-b from-[#F7931A] to-black p-8 rounded-xl shadow-2xl border-2 border-[#F7931A] max-w-md mx-4">
                        <div className="text-center space-y-6">
                          <div className="text-4xl mb-4">🎉 🌟 🎊</div>
                          <div className="text-2xl font-bold text-white">
                            Awesome! Thank you for your feedback!
                          </div>
                          <div className="text-lg text-gray-300">
                            You will be redirected to your Bitcoin Dashboard in a moment... ✨
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer onBooking={handleBooking} />
    </div>
  );
}