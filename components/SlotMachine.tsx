"use client"

import React, { useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSlotMachine } from "./useSlotMachine"
import { SYMBOLS, SYMBOL_MEANINGS, WINNING_COMBINATIONS, SYMBOL_PROBABILITIES, Symbol } from "./config"
import { SpinningReel } from "./SpinningReel"

export function SlotMachine() {
  const { toast } = useToast()
  const { reels, spinning, reward, spinReels } = useSlotMachine(toast)

  const handleSpin = useCallback(() => {
    spinReels()
  }, [spinReels])

  const reelComponents = useMemo(() => 
    reels.map((symbol, index) => (
      <SpinningReel 
        key={index} 
        isSpinning={spinning[index]} 
        finalSymbol={symbol} 
        duration={1000 * (index + 1)} 
      />
    )),
    [reels, spinning]
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">Bitcoin Rewards Spinner</h1>
        <div className="flex justify-center space-x-4 mb-8" role="img" aria-label="Slot Machine Reels">
          {reelComponents}
        </div>
        <Button 
          onClick={handleSpin} 
          disabled={spinning.some(s => s)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 mb-6"
          aria-label={spinning.some(s => s) ? "Spinning" : "Spin the reels"}
        >
          {spinning.some(s => s) ? "Spinning..." : "SPIN"}
        </Button>
        <div className="mt-6 text-center mb-6" role="alert" aria-live="polite">
          {reward ? (
            <>
              <h2 className="text-2xl font-bold text-green-600">{reward.title}</h2>
              <p className="text-xl text-purple-800">{reward.value}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-red-600">No Win</h2>
              <p className="text-xl text-purple-800">Try again!</p>
            </>
          )}
        </div>
        <Tabs defaultValue="symbols" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="symbols">Symbols</TabsTrigger>
            <TabsTrigger value="combinations">Winning Combinations</TabsTrigger>
          </TabsList>
          <TabsContent value="symbols" className="text-black">
            <h3 className="text-lg font-semibold mb-2">Symbol Meanings:</h3>
            <ul className="text-sm">
              {(Object.keys(SYMBOL_MEANINGS) as Symbol[]).map((symbol) => (
                <li key={symbol} className="mb-1">
                  <span className="mr-2 text-lg">{symbol}</span> {SYMBOL_MEANINGS[symbol]} ({(SYMBOL_PROBABILITIES[symbol] * 100).toFixed(4)}%)
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="combinations" className="text-black">
            <h3 className="text-lg font-semibold mb-2">Winning Combinations:</h3>
            <ul className="text-sm">
              {Object.entries(WINNING_COMBINATIONS).map(([combo, description]) => (
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