"use client"; // Ensure this component is a Client Component

import { SVGProps, useEffect } from "react";
import { useRouter } from "next/navigation";

export function CheckInbox() {
  const router = useRouter();

  useEffect(() => {
    console.log("useEffect triggered");
    const timer = setTimeout(() => {
      console.log("Redirecting to /email-confirmation");
      router.push("/email-confirmation");
    }, 3000);

    return () => {
      clearTimeout(timer);
      console.log("Timer cleared");
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-b from-[#F7931A] to-black px-4 pt-4 sm:pt-6 sm:px-6 lg:px-8 text-white min-h-screen">
      <div className="mx-auto max-w-md text-center">
        <img
          src="/images/Bullish Beef_White.png"
          alt="Bullish Beef Logo"
          className="h-20 w-20 mx-auto"
          style={{ objectFit: 'contain' }}
        />
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Congratulations!</h1>
        
        <div className="mt-4">
          <img
            src="/images/Bitcoin Logo.png"
            alt="Bitcoin Logo"
            className="h-20 w-20 mx-auto"
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        <p className="mt-4 text-2xl font-bold text-white">You won 0.005 BTC</p>
        <p className="mt-2 text-lg font-medium text-white">(approximately $150 USD)</p>
        <div className="mt-4 flex flex-col items-center justify-center gap-2 text-lg font-medium text-white">
          <MailIcon className="h-12 w-12" />
          <p>
            <span className="text-2xl font-bold">Check your Inbox</span>
            <br />
            including spam for the next steps to claim your Bitcoin!
          </p>
        </div>
      </div>

      {/* Powered by section */}
      <div className="flex flex-col items-center mt-6">
        <p className="text-gray-400 text-sm">Powered by</p>
        <img
          src="/images/BeyondTC.png"
          alt="Beyond The Checkout"
          width="100"
          height="50"
          style={{ aspectRatio: "2.34 / 1", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

function MailIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
