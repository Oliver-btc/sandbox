import React, { useState, FormEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, ArrowDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductPreviewForm = () => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setStatus('idle');
    
    if (!url.trim()) {
      setError("Oops! Please add a product URL to continue.");
      setStatus('error');
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('loading');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would handle the URL submission and preview generation
      console.log('Processing URL:', url);
      setStatus('success');
      
    } catch (err) {
      setError('Something went wrong while generating your preview. Please try again.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = () => {
    setUrl('https://demo.beyondthecheckout.com/sample-product');
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
                Try our demo here
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductPreviewForm;