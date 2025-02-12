"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export function CombinedBitcoinRewardPage() {
  const router = useRouter();
  const [reward, setReward] = useState(10000);
  const [usdEquivalent, setUsdEquivalent] = useState("0.00");
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'initial' | 'selecting' | 'memorizing' | 'flipping' | 'shuffling' | 'guessing' | 'result'>('initial');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [cards, setCards] = useState<Array<{ id: number; isFlipped: boolean; isBitcoin: boolean }>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [shuffleCount, setShuffleCount] = useState(0);
  const maxShuffles = 5; // Number of shuffle animations

  const difficultySettings = {
    easy: { multiplier: 2, cards: 4, bitcoinCards: 2, name: 'Beginner' },
    medium: { multiplier: 3, cards: 6, bitcoinCards: 3, name: 'Intermediate' },
    hard: { multiplier: 4, cards: 8, bitcoinCards: 4, name: 'Expert' },
  };

  useEffect(() => {
    // Fetch Bitcoin price and calculate USD equivalent
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch("https://api.coindesk.com/v1/bpi/currentprice/USD.json");
        const data = await response.json();
        const price = Math.round(data.bpi.USD.rate_float);
        setBitcoinPrice(price);
        
        const satsToUsd = (reward / 100000000) * price;
        setUsdEquivalent(satsToUsd.toFixed(2));
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
      }
    };

    fetchBitcoinPrice();
    const intervalId = setInterval(fetchBitcoinPrice, 60000);

    return () => clearInterval(intervalId);
  }, [reward]);

  useEffect(() => {
    // Initialize cards for default 'easy' difficulty
    if (gameState === 'selecting') {
      initializeCards('easy');
    }
  }, [gameState]);

  const handleClaimReward = () => {
    // Navigate to the withdrawal page
    router.push('/withdrawl');
  };

  const handleStartChallenge = () => {
    setGameState('selecting');
  };

  const handlePlayMultiply = () => {
    setGameState('selecting');
  };

  const initializeCards = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    const { cards, bitcoinCards } = difficultySettings[selectedDifficulty];
    const newCards = Array(cards).fill(null).map((_, index) => ({
      id: index,
      isFlipped: false,
      isBitcoin: index < bitcoinCards
    }));
    setCards(newCards.sort(() => Math.random() - 0.5));
  };

  const selectDifficulty = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    initializeCards(selectedDifficulty);
  };

  const startMemorizing = () => {
    setGameState('memorizing');
    setCards(cards.map(card => ({ ...card, isFlipped: true })));
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startFlipping();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFlipping = () => {
    setGameState('flipping');
    setCards(cards.map(card => ({ ...card, isFlipped: false })));
    setTimeout(() => {
      startShuffling();
    }, 1000); // Wait for 1 second after flipping before shuffling
  };

  const startShuffling = () => {
    setGameState('shuffling');
    setShuffleCount(0);
    shuffleCards();
  };

  const shuffleCards = () => {
    const shuffleInterval = setInterval(() => {
      setShuffleCount((prevCount) => {
        if (prevCount >= maxShuffles - 1) {
          clearInterval(shuffleInterval);
          setGameState('guessing');
          return maxShuffles - 1;
        }
        setCards(prevCards => {
          const newCards = [...prevCards];
          for (let i = newCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
          }
          return newCards;
        });
        return prevCount + 1;
      });
    }, 2000); // Increased to 2000ms for slower shuffling
  };

  const handleCardClick = (id: number) => {
    if (gameState !== 'guessing') return;
    
    setSelectedCards(prev => {
      if (prev.includes(id)) {
        return prev.filter(cardId => cardId !== id);
      } else if (prev.length < difficultySettings[difficulty].bitcoinCards) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const checkResult = () => {
    setCards(cards.map(card => ({ ...card, isFlipped: true })));
    const correctSelections = selectedCards.filter(id => cards.find(card => card.id === id)?.isBitcoin).length;
    if (correctSelections === difficultySettings[difficulty].bitcoinCards) {
      // User won the game
      const multiplier = difficultySettings[difficulty].multiplier;
      setReward(prevReward => prevReward * multiplier);
    }
    setGameState('result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7931A] to-[#8B4513] p-4 text-white">
      {/* Integrated Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center">
              <img
                src="/images/Bullish Beef_White.png"
                alt="Bullish Beef Logo"
                className="h-8 w-8"
                style={{ objectFit: 'contain' }}
              />
              <h1 className="text-2xl font-bold text-white ml-3">Free Bitcoin!</h1>
            </div>
          </div>
        </div>
      </header>
  
      <main className="max-w-md mx-auto mt-20">
        <h2 className="text-5xl font-bold text-center mb-6">Congratulations!</h2>
  
        <div className="text-center mb-6">
          <img src="/images/Bitcoin Logo.png" alt="Bitcoin Logo" className="h-24 w-24 mx-auto mb-4" />
          <p className="text-3xl font-bold mb-2">You won {reward.toLocaleString()} Sats</p>
          <p className="text-xl mb-2">approximately ${usdEquivalent} USD</p>
          <p className="text-sm">
            <img src="/images/Bitcoin Logo.png" alt="Bitcoin" className="inline h-4 w-4 mr-1" />
            Current BTC Price: ${bitcoinPrice?.toLocaleString() ?? 'Loading...'}
          </p>
        </div>
  
        {gameState === 'initial' && (
          <>
            <Button
              onClick={handleClaimReward}
              className="w-full bg-[#F7931A] hover:bg-[#E87D0D] text-white text-xl py-3 rounded-lg mb-4"
            >
              Claim Your Sats
            </Button>
            <p className="text-center text-xl mb-2">Or</p>
            <Button
              onClick={handleStartChallenge}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xl py-3 rounded-lg"
            >
              Take the Bitcoin Challenge
            </Button>
          </>
        )}
  
        {(gameState === 'selecting' || gameState === 'memorizing' || gameState === 'flipping' || gameState === 'shuffling' || gameState === 'guessing' || gameState === 'result') && (
          <div className="text-center">
            {gameState === 'selecting' && (
              <>
                <p className="text-xl mb-4">Choose your challenge level:</p>
              </>
            )}
            {gameState === 'memorizing' && <p className="text-2xl mb-4">Memorize in: {countdown}</p>}
            {gameState === 'flipping' && <p className="text-2xl mb-4">Flipping cards...</p>}
            {gameState === 'shuffling' && <p className="text-2xl mb-4">Shuffling...</p>}
            {gameState === 'guessing' && <p className="text-2xl mb-4">Select the Bitcoin cards!</p>}
      
            <div className="grid grid-cols-3 gap-2 mb-6">
              {['easy', 'medium', 'hard'].map((diff) => (
                <Button
                  key={diff}
                  onClick={() => selectDifficulty(diff as 'easy' | 'medium' | 'hard')}
                  disabled={gameState !== 'selecting'}
                  className={`flex flex-col items-center justify-center p-2 h-16 rounded-lg text-center ${
                    difficulty === diff ? 'ring-4 ring-white scale-105' : ''
                  } ${
                    diff === 'easy' ? 'bg-green-500 hover:bg-green-600' :
                    diff === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                    'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  <span className="text-sm font-bold mb-1 leading-tight">
                    {difficultySettings[diff as keyof typeof difficultySettings].name}
                  </span>
                  <span className="text-xs leading-tight">
                    {difficultySettings[diff as keyof typeof difficultySettings].multiplier}x your sats
                  </span>
                </Button>
              ))}
            </div>

            {gameState === 'selecting' && (
              <p className="text-sm mb-4">
                Find {difficultySettings[difficulty].bitcoinCards} Bitcoin cards out of {difficultySettings[difficulty].cards}
              </p>
            )}

            <div className={`grid gap-4 mb-6 ${
              cards.length === 4 ? 'grid-cols-2' :
              cards.length === 6 ? 'grid-cols-3' : 'grid-cols-4'
            }`}>
              <AnimatePresence>
  {cards.map((card) => (
    <motion.div
      key={card.id}
      layout
      initial={false}
      animate={gameState === 'shuffling' ? {
        x: Math.random() * 30 - 15,
        y: Math.random() * 30 - 15,
        rotate: Math.random() * 60 - 30,
        scale: 1.05,
      } : { 
        x: 0, 
        y: 0, 
        rotate: 0,
        scale: 1
      }}
      transition={{
        type: "tween",
        ease: "easeInOut",
        duration: 2
      }}
      onClick={() => handleCardClick(card.id)}
      className={`cursor-pointer ${selectedCards.includes(card.id) ? 'ring-4 ring-[#F7931A] rounded-lg' : ''} ${gameState === 'guessing' ? 'hover:scale-105' : ''}`}
    >
      <Card className={`w-full h-32 flex items-center justify-center bg-transparent rounded-lg overflow-hidden ${gameState === 'guessing' ? 'transition-transform duration-200 transform hover:scale-105' : ''}`}>
        <motion.div
          initial={false}
          animate={{ 
            rotateY: card.isFlipped || gameState === 'memorizing' || gameState === 'result' ? 0 : 180,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
          }}>
            {card.isBitcoin ? (
              <img src="/images/Bitcoin Logo.png" alt="Bitcoin" className="h-16 w-16" />
            ) : (
              <span className="text-4xl">💩</span>
            )}
          </div>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            borderRadius: '0.5rem',
          }}>
            <img 
              src="/images/BeyondTC.png" 
              alt="BeyondTC Logo" 
              className="h-24 w-24 object-contain"
            />
          </div>
        </motion.div>
      </Card>
    </motion.div>
  ))}
</AnimatePresence>
</div>

{gameState === 'selecting' && (
  <Button
    onClick={startMemorizing}
    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xl py-2 px-4 rounded-lg mt-4"
  >
    Start the Challenge
  </Button>
)}

{gameState === 'guessing' && (
  <p className="text-xl mb-4">
    Find {difficultySettings[difficulty].bitcoinCards} Bitcoin cards!
  </p>
)}
    
{gameState === 'guessing' && (
  <Button
    onClick={checkResult}
    disabled={selectedCards.length !== difficultySettings[difficulty].bitcoinCards}
    className="bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-gray-400 text-white text-xl py-2 px-4 rounded-lg"
  >
    Reveal Results
  </Button>
)}

{gameState === 'result' && (
          <div className="mt-4">
            <h3 className="text-3xl font-bold mb-4">
              {reward > 10000 ? 'Excellent Work!' : 'Nice Try!'}
            </h3>
            <p className="text-2xl mb-6">Your earnings: {reward.toLocaleString()} Sats</p>
            <Button
              onClick={handleClaimReward}
              className="w-full bg-[#F7931A] hover:bg-[#E87D0D] text-white text-xl py-3 rounded-lg"
            >
              Claim Your Sats
            </Button>
          </div>
        )}
</div>
)}
</main>

{/* Footer */}
<footer className="mt-6 pb-4 text-center">
<p className="text-gray-400 text-sm">Powered by</p>
<img
  src="/images/BeyondTC.png"
  alt="Beyond The Checkout"
  width="100"
  height="50"
  className="mx-auto"
  style={{ aspectRatio: "2.34 / 1", objectFit: "cover" }}
/>
</footer>
</div>
);
}