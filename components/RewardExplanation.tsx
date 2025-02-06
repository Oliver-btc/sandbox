import React from 'react';
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Info } from 'lucide-react'

interface RewardExplanationProps {
  title: string;
  content: string;
}

export const RewardExplanation: React.FC<RewardExplanationProps> = ({ title, content }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open {title} explanation</span>
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-sm text-muted-foreground">{content}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};