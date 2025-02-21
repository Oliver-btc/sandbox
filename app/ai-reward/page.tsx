"use client";

import { Suspense } from 'react';
import { BitcoinRewardPage } from "@/components/ai-bitcoin-reward-page";

export default function AIRewardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BitcoinRewardPage />
    </Suspense>
  );
}