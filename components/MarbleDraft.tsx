"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Engine, Render, World, Bodies, Events, Runner, Composite, Body, Vector } from 'matter-js'
import { Button } from "@/components/ui/button"

const BUCKET_VALUES = [21, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 21]
const MARBLE_RADIUS = 8
const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600
const DROPPER_WIDTH = 40
const DROPPER_HEIGHT = 20
const TOTAL_MARBLES = 21
const MARBLE_DROP_DELAY = 200 // milliseconds between each marble drop

export function MarbleGameComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const [score, setScore] = useState(0)
  const [bucketCounts, setBucketCounts] = useState<number[]>(Array(BUCKET_VALUES.length).fill(0))
  const [gameOver, setGameOver] = useState(false)
  const countedMarblesRef = useRef(new Set())
  const marblePositionsRef = useRef<{[key: number]: number}>({})
  const [isDropping, setIsDropping] = useState(false)
  const marbleCountRef = useRef(0)
  const [arrowAngle, setArrowAngle] = useState(Math.PI / 2); // Default to pointing down
  const isDraggingRef = useRef(false)

  // Declare bucketEdges in the outer scope so that it's accessible globally
  let bucketEdges: { leftEdge: number, rightEdge: number, width: number, centerX: number }[] = []

  useEffect(() => {
    if (!canvasRef.current) return

    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 }
    })
    engineRef.current = engine

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        wireframes: false,
        background: '#000000' // Changed to black for a futuristic look
      }
    })

    const wallOptions = { isStatic: true, render: { fillStyle: '#F7931A' } } // Dark gray walls to match Bitcoin theme
    World.add(engine.world, [
      Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 30, CANVAS_WIDTH + 20, 70, wallOptions),
      Bodies.rectangle(-10, CANVAS_HEIGHT / 2, 25, CANVAS_HEIGHT, wallOptions),
      Bodies.rectangle(CANVAS_WIDTH + 10, CANVAS_HEIGHT / 2, 25, CANVAS_HEIGHT, wallOptions)
    ])

    const obstacleOptions = { 
      isStatic: true, 
      render: { fillStyle: '#F7931A' }, // Use Bitcoin orange for obstacles
      label: 'obstacle'
    }

    const centerX = CANVAS_WIDTH / 2
    const obstacleRows = 12 // Increased number of rows for more obstacles
    const obstacleSpacing = 60 // Reduced spacing to add more obstacles
    const startY = 85 // Start a little higher for better obstacle distribution

    // Create obstacles (pins) with more gradual size increase towards the walls
    for (let i = 0; i < obstacleRows; i++) {
      const isEvenRow = i % 2 === 0
      const obstaclesInThisRow = isEvenRow ? 14 : 13
      const rowWidth = (obstaclesInThisRow - 1) * obstacleSpacing
      const rowStartX = centerX - rowWidth / 2

      for (let j = 0; j < obstaclesInThisRow; j++) {
        const x = rowStartX + j * obstacleSpacing
        const y = startY + i * 40

        // Calculate distance from center as a percentage
        const distanceFromCenter = Math.abs(x - centerX) / (CANVAS_WIDTH / 2)

        // Use a logarithmic scale for smoother size transition
        const sizeMultiplier = Math.log(distanceFromCenter * 3 + 1) + 1
        const obstacleSize = 5 * sizeMultiplier

        World.add(engine.world, Bodies.circle(x, y, obstacleSize, obstacleOptions))
      }
    }

    const createBucket = (x: number, y: number, width: number, height: number, options: Matter.IBodyDefinition) => {
      const bucket = Body.create({
        parts: [
          Bodies.rectangle(x, y + height / 2, width, 10, { ...options, label: 'bucket_bottom' }),
        ],
        isStatic: true,
        label: 'bucket'
      })
      return bucket
    }

    const bucketOptions = { 
      isStatic: true, 
      render: { fillStyle: '#F7931A' }, // Darker color for buckets
    }

    // Compute bucket positions and widths with equal widths for all
    const bucketWidth = CANVAS_WIDTH / BUCKET_VALUES.length

    bucketEdges = BUCKET_VALUES.map((value, index) => ({
      leftEdge: index * bucketWidth,
      rightEdge: (index + 1) * bucketWidth,
      width: bucketWidth,
      centerX: index * bucketWidth + bucketWidth / 2
    }))

    // Create buckets with equal widths
    const buckets = BUCKET_VALUES.map((value, index) => {
      const { centerX, width } = bucketEdges[index]
      return {
        body: createBucket(centerX, 590, width, 20, bucketOptions),
        value: value
      }
    })
    World.add(engine.world, buckets.map(b => b.body))

    // Add bucket walls
    for (let i = 1; i < BUCKET_VALUES.length; i++) {
      const x = bucketEdges[i].leftEdge
      World.add(engine.world, Bodies.rectangle(x, 575, 1, 45, {
        isStatic: true,
        render: { fillStyle: '#F7931A' }, // Orange bucket walls for contrast
        label: 'bucket_wall'
      }))
    }

    Events.on(render, 'afterRender', () => {
      const ctx = render.context
      if (!ctx) return

      // Render bucket values with improved visibility and positioning
      ctx.save()
      const bucketCount = BUCKET_VALUES.length
      const fontSize = Math.max(12, Math.min(12, 200 / bucketCount)) // Slightly smaller font to accommodate two lines
      ctx.font = `${fontSize}px Arial`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#FFFFFF' // White text for clarity

      buckets.forEach((bucket, index) => {
        const { centerX } = bucketEdges[index]
        const y = bucket.body.bounds.min.y - 25
        
        ctx.save()
        ctx.translate(centerX, y)
        
        // Always rotate text for consistent layout
        ctx.rotate(-Math.PI *2)
        
        // Draw the sat value
        ctx.fillText(`${bucket.value}`, 0, 0)
        
        // Draw "sats" on the next line
        ctx.fillText('sats', 0, fontSize + 2)
        
        ctx.restore()
      })

      ctx.restore()

      // Render marbles with neon glow
      Composite.allBodies(engine.world).forEach(body => {
        if (body.label === 'marble') {
          const { x, y } = body.position
          const radius = MARBLE_RADIUS

          ctx.save()
          ctx.translate(x, y)

          // Create a gradient fill for the marble
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
          gradient.addColorStop(0, '#F7931A') // Bitcoin orange center
          gradient.addColorStop(1, '#F57F17') // Darker orange edge
          ctx.fillStyle = gradient

          ctx.shadowColor = '#F7931A'
          ctx.shadowBlur = 20

          ctx.beginPath()
          ctx.arc(0, 0, radius, 0, 2 * Math.PI)
          ctx.fill()

          // Draw Bitcoin symbol
          ctx.fillStyle = '#FFFFFF'
          ctx.font = `${radius * 1.5}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('₿', 0, 0)

          ctx.restore()
        }
      })

      // Render the Bitcoin Vault with a directional arrow
      ctx.save()

      // Add a glowing effect around the vault
      ctx.shadowColor = '#FFA500' // Bright orange shadow
      ctx.shadowBlur = 40  // Increase blur for stronger glow effect

      // Draw the circular vault door in orange, matching the marble color
      ctx.beginPath()
      ctx.arc(CANVAS_WIDTH / 2, DROPPER_HEIGHT / 2, 30, 0, 2 * Math.PI)
      ctx.fillStyle = '#F7931A' // Bitcoin orange for the vault
      ctx.fill()

      // Draw a Bitcoin logo in the center of the vault
      ctx.shadowBlur = 0  // Remove the shadow effect for text
      ctx.font = '20px Arial'
      ctx.fillStyle = '#FFFFFF'  // White color for the Bitcoin logo
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('₿', CANVAS_WIDTH / 2, DROPPER_HEIGHT / 2)

      // Add glowing effect around the vault
      ctx.shadowColor = '#FFA500'
      ctx.shadowBlur = 15

      // Restore context
      ctx.restore()

      // Render the directional arrow
      ctx.save()
      ctx.translate(CANVAS_WIDTH / 2, DROPPER_HEIGHT / 2)
      ctx.rotate(arrowAngle - Math.PI / 2)

      // Draw the arrow
      ctx.beginPath()
      ctx.moveTo(0, 50)
      ctx.lineTo(-10, 30)
      ctx.lineTo(10, 30)
      ctx.closePath()
      ctx.fillStyle = '#F7931A'
      ctx.fill()
      ctx.restore()
    })

    Events.on(engine, 'afterUpdate', () => {
      const marbles = Composite.allBodies(engine.world).filter(body => body.label === 'marble')
      marbles.forEach(marble => {
        if (!countedMarblesRef.current.has(marble.id)) {
          const bucketIndex = getBucketIndex(marble.position.x)
          if (bucketIndex !== -1 && isMarbleSettled(marble)) {
            countedMarblesRef.current.add(marble.id)
            marblePositionsRef.current[marble.id] = bucketIndex
            setBucketCounts(prev => {
              const newCounts = [...prev]
              newCounts[bucketIndex]++
              return newCounts
            })
            setScore(prev => prev + BUCKET_VALUES[bucketIndex])

            if (countedMarblesRef.current.size === TOTAL_MARBLES) {
              setGameOver(true)
              setIsDropping(false)
            }
          }
        }
      })
    })

    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

    // Mouse control for adjusting arrow angle
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      handleMouseMove(e)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      
      const rect = canvasRef.current!.getBoundingClientRect()
      const canvasX = CANVAS_WIDTH / 2
      const canvasY = DROPPER_HEIGHT
      const mouseX = e.clientX - rect.left - canvasX
      const mouseY = -(e.clientY - rect.top - canvasY)
      let newAngle = Math.atan2(mouseY, mouseX)
      newAngle = Math.max(Math.min(newAngle, 3 * Math.PI / 4), Math.PI / 4)
      setArrowAngle(newAngle)
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    canvasRef.current.addEventListener('mousedown', handleMouseDown)
    canvasRef.current.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      Render.stop(render)
      World.clear(engine.world, false)
      Engine.clear(engine)
      Runner.stop(runner)
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown)
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [arrowAngle])

  const getBucketIndex = (x: number) => {
    // Use the bucketEdges variable declared outside the useEffect
    for (let i = 0; i < bucketEdges.length; i++) {
      if (x >= bucketEdges[i].leftEdge && x <= bucketEdges[i].rightEdge) {
        return i
      }
    }
    return -1
  }

  const isMarbleSettled = (marble: Matter.Body) => {
    return Math.abs(marble.velocity.y) < 0.1 && marble.position.y > 550
  }

  const dropMarbles = () => {
    if (!engineRef.current || isDropping) return

    setIsDropping(true)
    marbleCountRef.current = 0
    countedMarblesRef.current.clear()
    marblePositionsRef.current = {}

    const dropNextMarble = () => {
      if (marbleCountRef.current < TOTAL_MARBLES) {
        const x = CANVAS_WIDTH / 2
        const y = DROPPER_HEIGHT

        const marble = Bodies.circle(x, y, MARBLE_RADIUS, {
          restitution: 0.5,
          friction: 0.1,
          frictionAir: 0.01,
          density: 0.001,
          render: { visible: false },
          label: 'marble'
        })

        const adjustedAngle = arrowAngle
        const speed = 5
        const velocityX = Math.cos(adjustedAngle) * speed
        const velocityY = Math.sin(adjustedAngle) * speed
        const velocity = Vector.create(velocityX, velocityY)
        Body.setVelocity(marble, velocity)

        World.add(engineRef.current!.world, marble)
        marbleCountRef.current++

        setTimeout(dropNextMarble, MARBLE_DROP_DELAY)
      } else {
        setIsDropping(false)
      }
    }

    dropNextMarble()
  }

  const restartGame = () => {
    setScore(0)
    setBucketCounts(Array(BUCKET_VALUES.length).fill(0))
    setGameOver(false)
    setIsDropping(false)
    marbleCountRef.current = 0
    countedMarblesRef.current.clear()
    marblePositionsRef.current = {}
    if (engineRef.current) {
      const marbles = Composite.allBodies(engineRef.current.world).filter(body => body.label === 'marble')
      World.remove(engineRef.current.world, marbles)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-white">21 Bitcoin Game</h1>
      <div className="bg-gradient-to-b from-[#F7931A] to-black p-4 rounded-lg shadow-md">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
        />
        <div className="mt-4 flex flex-col items-center">
          <p className="text-lg font-semibold mb-2 text-[#F7931A]">Score: {score} sats</p>
          <p className="text-sm text-white mb-2">Click and drag the arrow to adjust the direction</p>
          <div className="flex justify-between w-full mb-4">
            {BUCKET_VALUES.map((value, index) => (
              <div key={index} className="text-center">
                <p className="font-bold text-white">{value}</p>
                <p className="text-white">{bucketCounts[index]}</p>
              </div>
            ))}
          </div>
          {!gameOver && !isDropping && (
            <Button onClick={dropMarbles} className="w-full bg-orange-500 text-white">
              Drop Marbles
            </Button>
          )}
          {isDropping && (
            <p className="text-lg font-semibold mb-2 text-orange-400">Dropping marbles...</p>
          )}
          {gameOver && (
            <Button onClick={restartGame} className="w-full bg-orange-500 text-white">
              Play Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}