import { MessageSquare } from 'lucide-react';

interface FooterProps {
  onBooking: (url: string) => void;
}

export function Footer({ onBooking }: FooterProps) {
  return (
    <footer className="mt-6 pb-4">
      <div className="flex flex-col items-center justify-center gap-4 mb-2">
        <img
          src="/images/BeyondTC.png"
          alt="Beyond The Checkout"
          width="90"
          height="50"
          style={{ aspectRatio: "2.34 / 1", objectFit: "cover" }}
        />

        <button
          onClick={() => onBooking('https://calendly.com/oliver-checkout/30min?back=1')}
          className="text-white hover:text-[#e68b15] flex items-center gap-2 text-sm transition-all duration-300 font-medium drop-shadow-md hover:drop-shadow-lg hover:underline"
        >
          <MessageSquare className="h-4 w-4 mb-0.5" />
          <span>
            Ready to add rewards to your product?{" "}
            <span className="underline">Let's chat!</span>
          </span>
        </button>
      </div>
    </footer>
  );
}