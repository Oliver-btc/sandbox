import { useState, useCallback } from 'react'
import { SYMBOLS, type Symbol, SYMBOL_PROBABILITIES, SYMBOL_MEANINGS, WINNING_COMBINATIONS } from './config'

type Reward = {
  title: string
  description: string
  value: string
} | null

export const useSlotMachine = (toast: any) => {
  const [reels, setReels] = useState<Symbol[]>([SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]])
  const [spinning, setSpinning] = useState<boolean[]>([false, false, false])
  const [reward, setReward] = useState<Reward>(null)

  const getRandomSymbol = useCallback((): Symbol => {
    const random = Math.random()
    let cumulativeProbability = 0
    for (const symbol of SYMBOLS) {
      cumulativeProbability += SYMBOL_PROBABILITIES[symbol]
      if (random < cumulativeProbability) {
        return symbol
      }
    }
    return SYMBOLS[SYMBOLS.length - 1]
  }, [])

  const generateReelResult = useCallback((): Symbol[] => {
    // 95% chance of winning (all symbols match)
    if (Math.random() < 0.95) {
      const winningSymbol = getRandomSymbol()
      return [winningSymbol, winningSymbol, winningSymbol]
    } else {
      // 5% chance of not winning (at least one symbol different)
      let result: Symbol[] = []
      do {
        result = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      } while (result[0] === result[1] && result[1] === result[2])
      return result
    }
  }, [getRandomSymbol])

  const calculateReward = useCallback((result: Symbol[]): Reward => {
    if (result[0] === result[1] && result[1] === result[2]) {
      const resultString = result[0] + result[0] + result[0]
      return {
        title: "You Win!",
        description: WINNING_COMBINATIONS[resultString] || `You won ${SYMBOL_MEANINGS[result[0]]}!`,
        value: SYMBOL_MEANINGS[result[0]]
      }
    }
    return null
  }, [])

  const spinReels = useCallback(() => {
    const newReels = generateReelResult()
    setReels(newReels)
    setSpinning([true, true, true])
    setReward(null)
    
    setTimeout(() => setSpinning([false, true, true]), 1000)
    setTimeout(() => setSpinning([false, false, true]), 2000)
    setTimeout(() => {
      setSpinning([false, false, false])
      const newReward = calculateReward(newReels)
      setReward(newReward)
      if (newReward) {
        toast({ title: newReward.title, description: newReward.description, variant: "default" })
      } else {
        toast({ title: "So Close!", description: "Almost got it! Try again!", variant: "destructive" })
      }
    }, 3000)
  }, [generateReelResult, calculateReward, toast])

  return { reels, spinning, reward, spinReels }
}