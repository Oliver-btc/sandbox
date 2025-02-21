"use client";

import { Suspense } from 'react';
import { AIQuiz } from "@/components/ai-quiz";

export default function AIQuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIQuiz />
    </Suspense>
  );
}