import { QRLandingPage } from "@/components/draft2";
import { Suspense } from 'react'

export default function QRLandingPagePage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <QRLandingPage />
    </Suspense>
  )
}
