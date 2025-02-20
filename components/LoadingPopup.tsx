import React, { useEffect, useState } from 'react';
import { Loader2, QrCode, Scan, LineChart, CheckCircle2, Sparkles } from 'lucide-react';

interface LoadingPopupProps {
  isOpen: boolean;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ isOpen }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Scan, text: "Analyzing your product URL..." },
    { icon: QrCode, text: "Creating your custom QR code..." },
    { icon: LineChart, text: "Generating analytics preview..." },
    { icon: Sparkles, text: "Finalizing your personalized preview..." }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCompletedSteps([]);
      setCurrentStep(0);
      return;
    }

    // Progress through steps
    const stepInterval = 4000; // 4 seconds per step
    
    const progressTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          setCompletedSteps(completed => [...completed, prev]);
          return prev + 1;
        }
        return prev;
      });
    }, stepInterval);

    return () => clearInterval(progressTimer);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/95 border border-orange-500/20 rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              🚀 Hang tight! We're preparing your personalized preview...
            </h2>
            <p className="text-gray-400">
              This will take just a few seconds (up to 20 seconds). Thanks for your patience!
            </p>
          </div>

          {/* Progress Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const status = getStepStatus(index);
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    status === 'completed' ? 'text-green-400' :
                    status === 'current' ? 'text-orange-500' : 'text-gray-500'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <StepIcon className={`w-5 h-5 ${
                      status === 'current' ? 'animate-pulse' : ''
                    }`} />
                  )}
                  
                  <span className="flex-1">{step.text}</span>
                  
                  {/* Status indicator */}
                  <span className="text-sm">
                    {status === 'completed' && '✓'}
                    {status === 'current' && (
                      <span className="inline-flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-300 ease-out"
              style={{ 
                width: `${((completedSteps.length + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;