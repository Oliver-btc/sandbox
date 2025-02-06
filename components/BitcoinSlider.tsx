import React, { useEffect } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Bitcoin, DollarSign } from 'lucide-react';

interface BitcoinSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  className?: string;
  showBitcoin: boolean;
}

const BitcoinIcon = () => (
  <div className="bg-[#F7931A] w-full h-full rounded-full flex items-center justify-center">
    <Bitcoin className="h-4 w-4 text-white" />
  </div>
);

const DollarIcon = () => (
  <div className="bg-green-500 w-full h-full rounded-full flex items-center justify-center">
    <DollarSign className="h-4 w-4 text-white" />
  </div>
);

const BitcoinSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  BitcoinSliderProps
>(({ className, showBitcoin, ...props }, ref) => {
  useEffect(() => {
    console.log('BitcoinSlider showBitcoin:', showBitcoin);
  }, [showBitcoin]);

  const rangeColor = showBitcoin ? '#F7931A' : '#10B981'; // #10B981 is the Tailwind green-500 color

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={`relative flex w-full touch-none select-none items-center ${className}`}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200 slider-track">
        <SliderPrimitive.Range 
          className="absolute h-full slider-range"
          style={{ backgroundColor: rangeColor }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        {showBitcoin ? <BitcoinIcon key="bitcoin" /> : <DollarIcon key="dollar" />}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});

BitcoinSlider.displayName = "BitcoinSlider";

export { BitcoinSlider };