import React from 'react';
import { Info, Star } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface StarRatingProps {
  score: number;
  maxScore: number;
  starCount: number;
}

const StarRating: React.FC<StarRatingProps> = ({ score, maxScore, starCount }) => {
  const percentage = (score / maxScore) * 100;
  
  const getStarFill = (starIndex: number): number => {
    if (percentage <= 20) {
      return starIndex === 0 ? percentage * 5 : 0;
    } else if (percentage <= 50) {
      return starIndex === 0 ? 100 : (starIndex === 1 ? (percentage - 20) * (100 / 30) : 0);
    } else if (percentage <= 80) {
      return starIndex <= 1 ? 100 : (starIndex === 2 ? (percentage - 50) * (100 / 30) : 0);
    } else if (percentage <= 95) {
      return starIndex <= 2 ? 100 : (starIndex === 3 ? (percentage - 80) * (100 / 15) : 0);
    } else {
      return starIndex <= 3 ? 100 : (starIndex === 4 ? (percentage - 95) * 20 : 0);
    }
  };

  const getHypeLevel = () => {
    if (percentage <= 20) {
      return "Low Excitement";
    } else if (percentage <= 50) {
      return "Moderate Excitement";
    } else if (percentage <= 80) {
      return "High Excitement";
    } else if (percentage <= 95) {
      return "Extreme Hype";
    } else {
      return "Ultra-Hype";
    }
  };

  const getTooltipContent = () => {
    if (percentage <= 20) {
      return "Rewards up to 5x the product price. Minor discounts or modest prizes.";
    } else if (percentage <= 50) {
      return "Rewards between 5x and 20x the product price. Attractive but not mind-blowing.";
    } else if (percentage <= 80) {
      return "Rewards between 20x and 50x the product price. Major incentives that draw significant attention.";
    } else if (percentage <= 95) {
      return "Rewards between 50x and 300x the product price. Potentially life-changing amounts generating large buzz.";
    } else {
      return "Rewards over 300x the product price. Extreme excitement, mimicking lottery-like behavior.";
    }
  };

  return (
    <Tooltip.Provider delayDuration={0}>
      <div className="flex flex-col items-end">
      <div className="text-md font-semibold mb-1">Hype Score: {score.toFixed(2)}</div>
       {/* <div className="text-md font-bold" >Hype Score</div> */}
       <div className="flex">
          {[...Array(starCount)].map((_, index) => (
            <div key={index} className="relative w-6 h-6">
              <Star
                size={22}
                className="absolute top-0 left-0 text-gray-300"
              />
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${getStarFill(index)}%` }}>
                <Star
                  size={22}
                  className="text-orange-500"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center mb-1">
          <div className="text-xs text-gray-500 mr-1">{getHypeLevel()}</div>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="focus:outline-none" aria-label="Hype Score Info">
                <Info size={16} className="text-gray-500 hover:text-gray-700" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-800 text-white p-2 rounded shadow-lg max-w-[200px] text-xs z-50"
                sideOffset={5}
              >
                {getHypeLevel ()}
                {getTooltipContent()}
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default StarRating;