import { BitcoinMemoryGame } from "@/components/bitcoin-memory-game";
import { Suspense } from 'react'

export default function BitcoinMemoryGamePage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <BitcoinMemoryGame />
    </Suspense>
  )
}