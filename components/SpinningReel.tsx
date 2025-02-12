import React, { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Symbol } from "./config"

type SpinningReelProps = {
  isSpinning: boolean
  finalSymbol: Symbol
  duration: number
}

export const SpinningReel: React.FC<SpinningReelProps> = ({ isSpinning, finalSymbol, duration }) => {
  const [currentSymbol, setCurrentSymbol] = useState<Symbol>(finalSymbol)
  const controls = useAnimation()

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (isSpinning) {
      controls.start({
        rotateX: [0, 360 * (duration / 1000) * 2],
        transition: { duration: duration / 1000, ease: "linear" }
      })

      intervalId = setInterval(() => {
        setCurrentSymbol(prev => {
          const index = Math.floor(Math.random() * 5)
          return ["₿", "🏷️", "⚡", "📦", "5️⃣"][index] as Symbol
        })
      }, 100)
    } else {
      controls.stop()
      setCurrentSymbol(finalSymbol)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
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