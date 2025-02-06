import { BusinessDashboard } from "@/components/business-dashboard";
import { Suspense } from 'react'

export default function BusinessDashboardPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <BusinessDashboard />
    </Suspense>
  )
}