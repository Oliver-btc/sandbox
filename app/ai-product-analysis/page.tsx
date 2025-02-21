"use client";

import { Suspense } from 'react';
import { AIProductAnalysis } from "@/components/ai-product-analysis";

export default function AIProductAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIProductAnalysis />
    </Suspense>
  );
}