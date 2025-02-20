import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, ArrowDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomVideoModal from './CustomVideoModal';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import LoadingPopup from './LoadingPopup';  // ADD THIS LINE

const ProductPreviewForm = () => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [useAiImages, setUseAiImages] = useState(false);
  const router = useRouter();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setStatus('loading');
    
    if (!url.trim()) {
      setError("Please add a product URL to continue.");
      setStatus('error');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate URL
      try {
        new URL(url);
      } catch {
        throw new Error('Please enter a valid URL');
      }

      const apiUrl = new URL('/api/analyze', window.location.origin);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          usePlaceholders: !useAiImages
        }),
      });

      if (!response.ok) {
        let errorMessage = 'An error occurred while processing your request.';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Server error: ${response.status}`;
        } catch {
          if (response.status === 429) {
            errorMessage = 'Too many requests. Please try again in a minute.';
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.generalPitch || !data.specificPitch || !data.customerFeedback || !data.quiz) {
        throw new Error('Invalid response format from server');
      }

      // Store the analysis results and redirect to the AI QR page
      localStorage.setItem('analysisResults', JSON.stringify(data));
      router.push('/ai-qr');
      
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request. Please try again.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = () => {
    setIsVideoModalOpen(true);
  };

  const StatusMessage = () => {
    if (error) {
      return (
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-3 rounded-full shadow-lg flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      );
    }
    
    if (status === 'success') {
      return (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-full shadow-lg flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>✨ Your preview is ready! Check it out below.</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="text-center mt-16 max-w-4xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
        See <span className="text-orange-500">Your Product in Action</span> – Instantly & For Free!
      </h3>
      
      <p className="text-xl text-white/90 mb-8">
        Enter your product URL below to instantly see how Beyond The Checkout can elevate your product experience—no signup required!
      </p>
      
      <div className="animate-bounce mb-4">
        <ArrowDown className="w-6 h-6 text-orange-500 mx-auto" />
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full space-y-2">
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="Paste your product URL here (e.g., https://yourstore.com/product)"
              className="w-full px-8 py-6 rounded-full bg-neutral-800/80 border-2 border-orange-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-all duration-300 text-lg shadow-lg hover:border-orange-500/40"
            />

            <div className="flex items-center justify-center space-x-4 py-2">
              <Label 
                htmlFor="image-source" 
                className={`cursor-pointer transition-all duration-200 ${
                  !useAiImages ? 'text-white font-bold' : 'text-white/70'
                }`}
              >
                Use Placeholder Images
              </Label>
              <Switch
                id="image-source"
                checked={useAiImages}
                onCheckedChange={setUseAiImages}
                className="data-[state=checked]:bg-orange-500"
              />
              <Label 
                htmlFor="image-source" 
                className={`cursor-pointer transition-all duration-200 ${
                  useAiImages ? 'text-white font-bold' : 'text-white/70'
                }`}
              >
                Use AI-Generated Images
              </Label>
            </div>

            {/* Status message container */}
            <div className="transition-all duration-300 ease-in-out">
              <StatusMessage />
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full px-12 py-6 text-lg rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
          >
            {status === 'loading' ? (
              <>
                <span className="animate-pulse">Generating your preview...</span>
              </>
            ) : (
              <>
                Instant Product Preview
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Lightbulb className="w-4 h-4 text-orange-500" />
            <span className="text-sm">
              Don't have a product URL?{' '}
              <button
                type="button"
                onClick={handleDemoClick}
                className="text-orange-500 hover:text-orange-400 underline focus:outline-none"
              >
                See our demo here
              </button>
            </span>
          </div>

          <LoadingPopup isOpen={status === 'loading'} />  {/* ADD THIS LINE */}
        </div>
      </form>

      <CustomVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://www.youtube.com/embed/YZG0jpV_j1A?enablejsapi=1&amp"
        title="How It Works - Demo"
      />
    </div>
  );
};

export default ProductPreviewForm;