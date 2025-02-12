import BitcoinEducation from "@/components/draft";
import { Suspense } from 'react'

export default function BitcoinEducationPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <BitcoinEducation />
    </Suspense>
  )
}
