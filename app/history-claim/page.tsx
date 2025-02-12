import { HistoryClaim } from "@/components/history-claim";
import { Suspense } from 'react'

export default function HistoryClaimPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <HistoryClaim />
    </Suspense>
  )
}