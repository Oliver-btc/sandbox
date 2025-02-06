"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"

const rewards = [
  "10 sats", "20 sats", "50 sats", "100 sats", "500 sats", "1,000 sats", "5,000 sats", "10,000 sats",
  "5% Discount", "10% Discount", "Free Sticker", "Mystery Box", "Extra Spin", "Bitcoin Book", "NFT Art", "Blockchain Course"
]

export function SpinningWheelComponent() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState('')
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (spinning) return

    setSpinning(true)
    setResult('')

    const spinDegrees = Math.floor(Math.random() * 360) + 3600 // Spin 10 times + random
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${spinDegrees}deg)`
    }

    setTimeout(() => {
      setSpinning(false)
      const winningIndex = Math.floor((360 - (spinDegrees % 360)) / (360 / rewards.length))
      setResult(rewards[winningIndex])
    }, 5000)
  }

  useEffect(() => {
    rewards.forEach((reward, index) => {
      const segment = document.createElement('div')
      segment.className = 'wheel-segment'
      segment.style.transform = `rotate(${index * (360 / rewards.length)}deg)`
      segment.innerHTML = `<span style="transform: rotate(${90 + (360 / rewards.length) / 2}deg)">${reward}</span>`
      wheelRef.current?.appendChild(segment)
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8">
        <div
          ref={wheelRef}
          className="absolute w-full h-full rounded-full border-8 border-yellow-400 transition-transform duration-5000 ease-out"
          style={{ transformOrigin: 'center' }}
        ></div>
        <div className="absolute top-0 left-1/2 w-0 h-0 -mt-4 -ml-4 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-[16px] border-b-red-600"></div>
      </div>
      <Button
        onClick={spinWheel}
        disabled={spinning}
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel!'}
      </Button>
      {result && (
        <div className="mt-8 text-2xl font-bold text-white bg-black bg-opacity-50 p-4 rounded-lg">
          You won: {result}!
        </div>
      )}
      <style jsx>{`
        .wheel-segment {
          position: absolute;
          width: 50%;
          height: 50%;
          transform-origin: bottom right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 0.8rem;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        .wheel-segment:nth-child(odd) {
          background-color: #ff6b6b;
        }
        .wheel-segment:nth-child(even) {
          background-color: #4ecdc4;
        }
        .wheel-segment span {
          display: inline-block;
          transform-origin: center;
          padding: 0 10px;
          text-align: right;
          width: 100%;
          max-width: 120px;
        }
        @media (min-width: 768px) {
          .wheel-segment {
            font-size: 1rem;
          }
          .wheel-segment span {
            max-width: 140px;
          }
        }
      `}</style>
    </div>
  )
}