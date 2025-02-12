"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const symbols = ["₿", "🏷️", "⚡", "📦", "5️⃣"] as const
type Symbol = typeof symbols[number]

type Reward = {
  title: string
  description: string
  value: string
}

const symbolMeanings: Record<Symbol, string> = {
  "₿": "Bitcoin Reward",
  "🏷️": "Discount",
  "⚡": "Express Shipping",
  "📦": "Mystery Box",
  "5️⃣": "5x Rewards"
}

const winningCombinations: Record<string, string> = {
  "₿₿₿": "Bitcoin Jackpot: Win 0.001 BTC",
  "🏷️🏷️🏷️": "Discount Win: Get a random discount between 10% and 29%",
  "⚡⚡⚡": "Lightning Speed: Win free express shipping",
  "📦📦📦": "Mystery Box: Win a surprise reward",
  "5️⃣5️⃣5️⃣": "5x Rewards: Your next win will be multiplied by 5",
  "Any combo with 5️⃣": "Partial 5x: One of your next 5 spins will be multiplied by 5"
}

const symbolProbabilities: Record<Symbol, number> = {
  "₿": 0.05,  // 5% chance for Bitcoin
  "🏷️": 0.20, // 20% chance for Discount
  "⚡": 0.25, // 25% chance for Express Shipping
  "📦": 0.30, // 30% chance for Mystery Box
  "5️⃣": 0.20  // 20% chance for 5x Rewards
}

const getRandomSymbol = (): Symbol => {
  const random = Math.random()
  let cumulativeProbability = 0
  for (const [symbol, probability] of Object.entries(symbolProbabilities)) {
    cumulativeProbability += probability
    if (random < cumulativeProbability) {
      return symbol as Symbol
    }
  }
  return symbols[symbols.length - 1]
}

const SpinningReel: React.FC<{ isSpinning: boolean, finalSymbol: Symbol, duration: number }> = ({ isSpinning, finalSymbol, duration }) => {
  const [currentSymbol, setCurrentSymbol] = useState<Symbol>(finalSymbol)
  const controls = useAnimation()
  const symbolChangeInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isSpinning) {
      controls.start({
        rotateX: [0, 360 * (duration / 1000) * 2],
        transition: { duration: duration / 1000, ease: "linear" }
      })

      symbolChangeInterval.current = setInterval(() => {
        setCurrentSymbol(getRandomSymbol())
      }, 100) // Change symbol every 100ms while spinning
    } else {
      controls.stop()
      setCurrentSymbol(finalSymbol)

      if (symbolChangeInterval.current) {
        clearInterval(symbolChangeInterval.current)
      }
    }

    return () => {
      if (symbolChangeInterval.current) {
        clearInterval(symbolChangeInterval.current)
      }
    }
  }, [isSpinning, finalSymbol, duration, controls])

  return (
    <motion.div
      className="w-24 h-24 bg-yellow-400 rounded-lg flex items-center justify-center text-4xl shadow-inner"
      animate={controls}
    >
      {currentSymbol}
    </motion.div>
  )
}

export function SlotMachine() {
  const [reels, setReels] = useState<Symbol[]>(["₿", "🏷️", "⚡"])
  const [spinning, setSpinning] = useState<boolean[]>([false, false, false])
  const [reward, setReward] = useState<Reward | null>(null)
  const { toast } = useToast()

  const spinReels = () => {
    const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
    setReels(newReels)
    setSpinning([true, true, true])
    setReward(null)
    
    // Stop reels sequentially
    setTimeout(() => setSpinning([false, true, true]), 1000)
    setTimeout(() => setSpinning([false, false, true]), 2000)
    setTimeout(() => {
      setSpinning([false, false, false])
      checkWin(newReels)
    }, 3000)
  }

  const checkWin = (result: Symbol[]) => {
    if (new Set(result).size === 1) {
      // All symbols are the same
      switch(result[0]) {
        case "₿":
          setReward({
            title: "Bitcoin Jackpot!",
            description: "You won 0.001 BTC!",
            value: "0.001 BTC"
          })
          break
        case "🏷️":
          const discount = Math.floor(Math.random() * 20) + 10
          setReward({
            title: "Discount Win!",
            description: `You won a ${discount}% discount!`,
            value: `${discount}% Discount`
          })
          break
        case "⚡":
          setReward({
            title: "Lightning Speed!",
            description: "You won free express shipping!",
            value: "Free Express Shipping"
          })
          break
        case "📦":
          setReward({
            title: "Mystery Box!",
            description: "You won a mystery prize!",
            value: "Mystery Prize"
          })
          break
        case "5️⃣":
          setReward({
            title: "5x Rewards!",
            description: "Your next win will be multiplied by 5!",
            value: "5x Multiplier"
          })
          break
      }
    } else if (result.includes("5️⃣")) {
      // 5x reward for any win with a 5️⃣
      setReward({
        title: "Partial 5x Win!",
        description: "One of your next 5 spins will be multiplied by 5!",
        value: "Partial 5x Multiplier"
      })
    } else {
      toast({ title: "Try again!", description: "Better luck next time!", variant: "destructive" })
    }

    if (reward) {
      toast({ title: reward.title, description: reward.description, variant: "default" })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Bitcoin Rewards Spinner</h1>
        <div className="flex justify-center space-x-4 mb-8">
          {reels.map((symbol, index) => (
            <SpinningReel 
              key={index} 
              isSpinning={spinning[index]} 
              finalSymbol={symbol} 
              duration={1000 * (index + 1)} 
            />
          ))}
        </div>
        <Button 
          onClick={spinReels} 
          disabled={spinning.some(s => s)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mb-6"
        >
          {spinning.some(s => s) ? "Spinning..." : "SPIN"}
        </Button>
        {reward && (
          <div className="mt-6 text-center mb-6">
            <h2 className="text-2xl font-bold text-green-600">{reward.title}</h2>
            <p className="text-xl text-purple-800">{reward.value}</p>
          </div>
        )}
        <Tabs defaultValue="symbols" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="symbols">Symbols</TabsTrigger>
            <TabsTrigger value="combinations">Winning Combinations</TabsTrigger>
          </TabsList>
          <TabsContent value="symbols" className="text-black">
            <h3 className="text-lg font-semibold mb-2">Symbol Meanings:</h3>
            <ul className="text-sm">
              {Object.entries(symbolMeanings).map(([symbol, meaning]) => (
                <li key={symbol} className="mb-1">
                  <span className="mr-2 text-lg">{symbol}</span> {meaning} ({(symbolProbabilities[symbol as Symbol] * 100).toFixed(1)}%)
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="combinations" className="text-black">
            <h3 className="text-lg font-semibold mb-2">Winning Combinations:</h3>
            <ul className="text-sm">
              {Object.entries(winningCombinations).map(([combo, description]) => (
                <li key={combo} className="mb-1">
                  <span className="font-semibold">{combo}:</span> {description}
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}