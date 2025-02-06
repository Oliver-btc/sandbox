import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export function CustomerInteraction() {
  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-b from-[#F7931A] to-black px-4 pt-4 sm:pt-6 sm:px-6 lg:px-8 text-white min-h-screen">
      <div className="mx-auto max-w-md text-center">
        <img
          src="/images/Bullish Beef_White.png"
          alt="Bitcoin Logo"
          className="h-20 w-20 mx-auto"
          style={{ objectFit: 'contain' }}
        />
        <h1 className="mt-2 text-3xl font-bold text-white">Product Feedback</h1>
      </div>
      <div className="mt-2">
        <div className="flex flex-col items-center bg-black p-2 rounded-lg">
          <img
            src="/images/Bullish Beef.png"
            alt="Bullish Beef"
            width="300"
            height="100"
            className="mb-4 rounded-lg"
            style={{ aspectRatio: "2/3", objectFit: "cover" }}
          />
          <p className="text-white text-lg font-bold">What do you think?</p>
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="outline">😏 It&apos;s OK</Button>
            <Button variant="outline">😁 I Like it!</Button>
            <Button variant="outline">🤩 I LOVE it!</Button>
          </div>
          <div className="mt-4 w-full">
            <Textarea placeholder="Leave a comment..." className="w-full rounded-lg bg-[#1a1a1a] text-white p-4" />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Link href="/withdraw" prefetch={false}>
          <Button className="mt-4 px-6 py-3 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15]">
            Withdraw Bitcoin
          </Button>
        </Link>
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
