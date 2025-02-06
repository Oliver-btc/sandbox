import {AILandingPage} from "@/components/ai-landing";
import { Suspense } from 'react'

export default function BitcoinEducationPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <AILandingPage />
    </Suspense>
  )
}
