import { CombinedBitcoinRewardPage } from "@/components/memory-game";
import { Suspense } from 'react'

export default function MemoryGamePage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <CombinedBitcoinRewardPage />
    </Suspense>
  )
}
