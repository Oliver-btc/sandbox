import React from 'react';
import { Info, Star } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface TrustLoyaltyRatingProps {
  baseRewards: Array<{ amount: number; count: number }>;
  productPrice: number;
  totalQRCodes: number;
  maxScore: number;
  starCount: number;
}

const TrustLoyaltyRating: React.FC<TrustLoyaltyRatingProps> = ({
  baseRewards,
  productPrice,
  totalQRCodes,
  maxScore,
  starCount
}) => {
  // Calculate the average reward percentage for base rewards
  const calculateAverageRewardPercentage = (): number => {
    const totalBaseRewardValue = baseRewards.reduce((sum, reward) => sum + reward.amount * reward.count, 0);
    const totalBaseRewardCount = baseRewards.reduce((sum, reward) => sum + reward.count, 0);
    const averageBaseReward = totalBaseRewardValue / totalBaseRewardCount;
    return (averageBaseReward / productPrice) * 100;
  };

  const averageRewardPercentage = calculateAverageRewardPercentage();

  // Calculate Trust Score based on average reward percentage
  const calculateTrustScore = (): number => {
    if (averageRewardPercentage <= 2) return (averageRewardPercentage / 2) * 20;
    if (averageRewardPercentage <= 4) return 20 + ((averageRewardPercentage - 2) / 2) * 20;
    if (averageRewardPercentage <= 7) return 40 + ((averageRewardPercentage - 4) / 3) * 20;
    if (averageRewardPercentage <= 10) return 60 + ((averageRewardPercentage - 7) / 3) * 20;
    return Math.min(80 + ((averageRewardPercentage - 10) / 2) * 20, 100); // Cap at 100
  };

  const score = calculateTrustScore();

  // Calculate the percentage for the star fill
  const percentage = (score / maxScore) * 100;

  // Determine star fill percentage for each star
  const getStarFill = (starIndex: number): number => {
    const starPercentage = (percentage / 100) * starCount;
    const fullStars = Math.floor(starPercentage);
    const partialFill = starPercentage - fullStars;

    if (starIndex < fullStars) return 100; // Full star
    if (starIndex === fullStars) return partialFill * 100; // Partially filled star
    return 0; // Empty star
  };

  // Trust levels based on score
  const getTrustLoyaltyLevel = () => {
    if (score <= 20) return "Basic Trust";
    if (score <= 40) return "Growing Loyalty";
    if (score <= 60) return "Solid Relationship";
    if (score <= 80) return "Strong Loyalty";
    return "Ultimate Trust";
  };

  // Tooltip explanations for different trust levels
  const getTooltipContent = () => {
    const level = getTrustLoyaltyLevel();
    return `${level}: Average base reward is ${averageRewardPercentage.toFixed(2)}% of the product price. 
    Trust Score: ${score.toFixed(2)}. ${
      level === "Basic Trust" ? "Minimal rewards (0-2%) encouraging initial trust and repeat purchases." :
      level === "Growing Loyalty" ? "Modest rewards (2-4%) building customer loyalty over time." :
      level === "Solid Relationship" ? "Balanced rewards (4-7%) fostering a reliable customer relationship." :
      level === "Strong Loyalty" ? "Generous rewards (7-10%) cultivating strong customer loyalty." :
      "Exceptional rewards (>10%) cementing unwavering customer trust and loyalty."
    }`;
  };

  return (
    <Tooltip.Provider delayDuration={0}>
      <div className="flex flex-col items-end">
        {/* Display the Trust Score */}
        <div className="text-md font-semibold mb-1">Trust Score: {score.toFixed(2)}</div>
        
        {/* Star rating display */}
        <div className="flex">
          {[...Array(starCount)].map((_, index) => (
            <div key={index} className="relative w-6 h-6">
              <Star size={22} className="absolute top-0 left-0 text-gray-300" />
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${getStarFill(index)}%` }}>
                <Star size={22} className="text-orange-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust level with tooltip */}
        <div className="flex items-center mb-1">
          <div className="text-xs text-gray-500 mr-1">{getTrustLoyaltyLevel()}</div>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="focus:outline-none" aria-label="Trust & Loyalty Score Info">
                <Info size={16} className="text-gray-500 hover:text-gray-700" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-800 text-white p-2 rounded shadow-lg max-w-[250px] text-xs z-50" sideOffset={5}>
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

export default TrustLoyaltyRating;