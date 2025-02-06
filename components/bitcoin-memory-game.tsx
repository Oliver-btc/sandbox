"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Bitcoin-themed cards with explanations
const bitcoinCards = [
  { emoji: "💻", term: "Bitcoin Node", explanation: "Computer running Bitcoin software" },
  { emoji: "⚡", term: "Lightning Network", explanation: "Fast, off-chain transactions" },
  { emoji: "🌐", term: "Decentralization", explanation: "Distributed control and decision-making" },
  { emoji: "🔑", term: "Private Key", explanation: "Secret code to access bitcoins" },
  { emoji: "📦", term: "Block", explanation: "Bundle of Bitcoin transactions" },
  { emoji: "⛓️", term: "Blockchain", explanation: "Public ledger of all transactions" },
  { emoji: "🖊️", term: "Digital Signature", explanation: "Proves ownership of bitcoins" },
  { emoji: "🔒", term: "Cryptography", explanation: "Secures the Bitcoin network" }
]

// Difficulty levels
const difficulties = {
  easy: { pairs: 4, time: 5, gridCols: 4 },
  medium: { pairs: 6, time: 5, gridCols: 4 },
  hard: { pairs: 8, time: 5, gridCols: 4 }
}

const shuffleCards = (numPairs: number) => {
  const selectedCards = bitcoinCards.slice(0, numPairs)
  return [...selectedCards, ...selectedCards]
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({ id: index, ...card, isFlipped: false, isMatched: false }))
}

export function BitcoinMemoryGame() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [cards, setCards] = useState(() => shuffleCards(difficulties[difficulty].pairs))
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [memorizeTime, setMemorizeTime] = useState(difficulties[difficulty].time)
  const [gameCompleted, setGameCompleted] = useState(false)

  useEffect(() => {
    setCards(shuffleCards(difficulties[difficulty].pairs))
    setFlippedCardIds([])
    setMatchedPairs(0)
    setMoves(0)
    setGameStarted(false)
    setMemorizeTime(difficulties[difficulty].time)
    setGameCompleted(false)
  }, [difficulty])

  useEffect(() => {
    if (matchedPairs === difficulties[difficulty].pairs) {
      setGameCompleted(true)
    }
  }, [matchedPairs, difficulty])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameStarted && memorizeTime > 0) {
      timer = setInterval(() => setMemorizeTime(prev => prev - 1), 1000)
    } else if (memorizeTime === 0) {
      setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })))
    }
    return () => clearInterval(timer)
  }, [gameStarted, memorizeTime])

  useEffect(() => {
    if (flippedCardIds.length === 2) {
      const [firstId, secondId] = flippedCardIds
      const firstCard = cards[firstId]
      const secondCard = cards[secondId]

      if (firstCard.term === secondCard.term) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        )
        setMatchedPairs(prev => prev + 1)
        setFlippedCardIds([])
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          )
          setFlippedCardIds([])
        }, 1000)
      }
      setMoves(prev => prev + 1)
    }
  }, [flippedCardIds, cards])

  const handleCardClick = useCallback((id: number) => {
    if (memorizeTime > 0 || flippedCardIds.length === 2) return
    if (!cards[id].isFlipped && !cards[id].isMatched) {
      setCards(prevCards => prevCards.map(card => 
        card.id === id ? { ...card, isFlipped: true } : card
      ))
      setFlippedCardIds(prev => [...prev, id])
    }
  }, [memorizeTime, flippedCardIds.length, cards])

  const resetGame = useCallback(() => {
    setCards(shuffleCards(difficulties[difficulty].pairs))
    setFlippedCardIds([])
    setMatchedPairs(0)
    setMoves(0)
    setGameStarted(false)
    setMemorizeTime(difficulties[difficulty].time)
    setGameCompleted(false)
  }, [difficulty])

  const startGame = useCallback(() => {
    setGameStarted(true)
    setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: true })))
  }, [])

  const handleDifficultyChange = useCallback((newDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(newDifficulty)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-100 to-orange-300 p-4">
      <h1 className="text-4xl font-bold mb-6 text-orange-800">Bitcoin Memory Game</h1>
      {!gameStarted ? (
        <div className="flex flex-col items-center gap-4 mb-4">
          <Select onValueChange={handleDifficultyChange} value={difficulty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
            Start Game
          </Button>
        </div>
      ) : memorizeTime > 0 ? (
        <div className="text-2xl font-bold mb-4 text-orange-800">Memorize the cards: {memorizeTime}s</div>
      ) : (
        <div className="text-xl mb-4 text-orange-800">
          Moves: {moves} | Pairs: {matchedPairs}/{difficulties[difficulty].pairs}
        </div>
      )}
      {gameCompleted && (
        <Alert className="mb-4 bg-green-100 border-green-500">
          <AlertTitle className="text-green-800">Congratulations!</AlertTitle>
          <AlertDescription className="text-green-700">
            You&apos;ve completed the game in {moves} moves. Great job!
          </AlertDescription>
        </Alert>
      )}
      <div className={`grid grid-cols-4 gap-4 mb-6`}>
        {cards.map(card => (
          <TooltipProvider key={card.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  className={`w-24 h-24 flex flex-col items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
                    card.isFlipped || card.isMatched ? "bg-orange-400" : "bg-orange-600"
                  }`}
                  onClick={() => handleCardClick(card.id)}
                >
                  {card.isFlipped || card.isMatched ? (
                    <>
                      <span className="text-4xl mb-1">{card.emoji}</span>
                      <span className="text-xs text-center">{card.term}</span>
                    </>
                  ) : (
                    "₿"
                  )}
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{card.explanation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <Button onClick={resetGame} className="bg-orange-500 hover:bg-orange-600">
        Reset Game
      </Button>
    </div>
  )
}