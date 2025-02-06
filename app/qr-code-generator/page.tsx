import { QRCodeGeneratorPage } from "@/components/qr-code-generator";
import { Suspense } from 'react'

export default function QRCodeGeneratorPagePage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <QRCodeGeneratorPage />
    </Suspense>
  )
}