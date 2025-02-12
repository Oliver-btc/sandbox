"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Engine, Render, World, Bodies, Events, Runner, Composite, Body, Vector } from 'matter-js'
import { Button } from "@/components/ui/button"
import useAudioManager from './AudioManager'
import { Volume2, VolumeX } from 'lucide-react'

const BUCKET_VALUES = [21, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 21]
const MARBLE_RADIUS = 8
const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600
const DROPPER_WIDTH = 40
const DROPPER_HEIGHT = 20
const TOTAL_MARBLES = 21
const MARBLE_DROP_DELAY = 200 // milliseconds between each marble drop

export const MarbleGameComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const [score, setScore] = useState(0)
  const [bucketCounts, setBucketCounts] = useState<number[]>(Array(BUCKET_VALUES.length).fill(0))
  const [gameOver, setGameOver] = useState(false)
  const countedMarblesRef = useRef(new Set<number>())
  const marblePositionsRef = useRef<{[key: number]: number}>({})
  const [isDropping, setIsDropping] = useState(false)
  const marbleCountRef = useRef(0)
  const [arrowAngle, setArrowAngle] = useState(Math.PI / 2)
  const isDraggingRef = useRef(false)
  const [isMuted, setIsMuted] = useState(false)
  const { playSound } = useAudioManager(isMuted)
  const lastObstacleSoundTimeRef = useRef(0)
  const [settledMarbles, setSettledMarbles] = useState(0)
  const gameEndedRef = useRef(false)
  const [gameInProgress, setGameInProgress] = useState(false)

  let bucketEdges: { leftEdge: number, rightEdge: number, width: number, centerX: number }[] = []

  const playObstacleSound = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastObstacleSoundTimeRef.current > 50) { // 50ms debounce
      playSound('marbleHitObstacle', 0.5);
      lastObstacleSoundTimeRef.current = currentTime;
    }
  }, [playSound]);

  const playBucketSound = useCallback(() => {
    playSound('marbleInBucket');
  }, [playSound]);

  const playGameOverSound = useCallback(() => {
    playSound('gameOver');
  }, [playSound]);

  const isMarbleSettled = (marble: Matter.Body) => {
    return Math.abs(marble.velocity.y) < 0.1 && marble.position.y > 550
  }

  const getBucketIndex = (x: number) => {
    for (let i = 0; i < bucketEdges.length; i++) {
      if (x >= bucketEdges[i].leftEdge && x <= bucketEdges[i].rightEdge) {
        return i
      }
    }
    return -1
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const updateCanvasSize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const containerWidth = canvas.parentElement?.clientWidth || CANVAS_WIDTH
      const desiredWidth = Math.min(containerWidth, CANVAS_WIDTH)
      const scaleFactor = desiredWidth / CANVAS_WIDTH

      canvas.style.width = `${desiredWidth}px`
      canvas.style.height = `${CANVAS_HEIGHT * scaleFactor}px`
      canvas.width = desiredWidth
      canvas.height = CANVAS_HEIGHT * scaleFactor

      if (engineRef.current) {
        const engine = engineRef.current
        engine.world.gravity.scale = 0.001 * scaleFactor
        Composite.scale(engine.world, scaleFactor, scaleFactor, Vector.create(0, 0))
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

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
        background: '#000000'
      }
    })

    const wallOptions = { isStatic: true, render: { fillStyle: '#F7931A' } }
    World.add(engine.world, [
      Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 30, CANVAS_WIDTH + 20, 70, wallOptions),
      Bodies.rectangle(-10, CANVAS_HEIGHT / 2, 25, CANVAS_HEIGHT, wallOptions),
      Bodies.rectangle(CANVAS_WIDTH + 10, CANVAS_HEIGHT / 2, 25, CANVAS_HEIGHT, wallOptions)
    ])

    const obstacleOptions = { 
      isStatic: true, 
      render: { fillStyle: '#F7931A' },
      label: 'obstacle'
    }

    const centerX = CANVAS_WIDTH / 2
    const obstacleRows = 12
    const obstacleSpacing = 60
    const startY = 85

    for (let i = 0; i < obstacleRows; i++) {
      const isEvenRow = i % 2 === 0
      const obstaclesInThisRow = isEvenRow ? 14 : 13
      const rowWidth = (obstaclesInThisRow - 1) * obstacleSpacing
      const rowStartX = centerX - rowWidth / 2

      for (let j = 0; j < obstaclesInThisRow; j++) {
        const x = rowStartX + j * obstacleSpacing
        const y = startY + i * 40

        const distanceFromCenter = Math.abs(x - centerX) / (CANVAS_WIDTH / 2)
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
      render: { fillStyle: '#F7931A' },
    }

    const bucketWidth = CANVAS_WIDTH / BUCKET_VALUES.length

    bucketEdges = BUCKET_VALUES.map((value, index) => ({
      leftEdge: index * bucketWidth,
      rightEdge: (index + 1) * bucketWidth,
      width: bucketWidth,
      centerX: index * bucketWidth + bucketWidth / 2
    }))

    const buckets = BUCKET_VALUES.map((value, index) => {
      const { centerX, width } = bucketEdges[index]
      return {
        body: createBucket(centerX, 590, width, 20, bucketOptions),
        value: value
      }
    })
    World.add(engine.world, buckets.map(b => b.body))

    for (let i = 1; i < BUCKET_VALUES.length; i++) {
      const x = bucketEdges[i].leftEdge
      World.add(engine.world, Bodies.rectangle(x, 575, 1, 45, {
        isStatic: true,
        render: { fillStyle: '#F7931A' },
        label: 'bucket_wall'
      }))
    }

    Events.on(render, 'afterRender', () => {
      const ctx = render.context
      if (!ctx) return

      ctx.save()
      const bucketCount = BUCKET_VALUES.length
      const fontSize = Math.max(12, Math.min(12, 200 / bucketCount))
      ctx.font = `${fontSize}px Arial`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#FFFFFF'

      buckets.forEach((bucket, index) => {
        const { centerX } = bucketEdges[index]
        const y = bucket.body.bounds.min.y - 25
        
        ctx.save()
        ctx.translate(centerX, y)
        ctx.rotate(-Math.PI * 2)
        ctx.fillText(`${bucket.value}`, 0, 0)
        ctx.fillText('sats', 0, fontSize + 2)
        ctx.restore()
      })

      ctx.restore()

      Composite.allBodies(engine.world).forEach(body => {
        if (body.label === 'marble') {
          const { x, y } = body.position
          const radius = MARBLE_RADIUS

          ctx.save()
          ctx.translate(x, y)

          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
          gradient.addColorStop(0, '#F7931A')
          gradient.addColorStop(1, '#F57F17')
          ctx.fillStyle = gradient

          ctx.shadowColor = '#F7931A'
          ctx.shadowBlur = 20

          ctx.beginPath()
          ctx.arc(0, 0, radius, 0, 2 * Math.PI)
          ctx.fill()

          ctx.fillStyle = '#FFFFFF'
          ctx.font = `${radius * 1.5}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('₿', 0, 0)

          ctx.restore()
        }
      })

      ctx.save()
      ctx.shadowColor = '#FFA500'
      ctx.shadowBlur = 40

      ctx.beginPath()
      ctx.arc(CANVAS_WIDTH / 2, DROPPER_HEIGHT / 2, 30, 0, 2 * Math.PI)
      ctx.fillStyle = '#F7931A'
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.font = '20px Arial'
      ctx.fillStyle = '#FFFFFF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('₿', CANVAS_WIDTH / 2, DROPPER_HEIGHT / 2)

      ctx.shadowColor = '#FFA500'
      ctx.shadowBlur = 15

      ctx.restore()

      ctx.save()
      ctx.translate(CANVAS_WIDTH / 2, DROPPER_HEIGHT / 2)
      ctx.rotate(arrowAngle - Math.PI / 2)

      ctx.beginPath()
      ctx.moveTo(0, 50)
      ctx.lineTo(-10, 30)
      ctx.lineTo(10, 30)
      ctx.closePath()
      ctx.fillStyle = '#F7931A'
      ctx.fill()
      ctx.restore()
    })

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        if ((pair.bodyA.label === 'marble' && pair.bodyB.label === 'obstacle') ||
            (pair.bodyA.label === 'obstacle' && pair.bodyB.label === 'marble')) {
          playObstacleSound();
        }
      });
    });

    Events.on(engine, 'afterUpdate', () => {
      const marbles = Composite.allBodies(engine.world).filter(body => body.label === 'marble')
      let newSettledCount = 0

      marbles.forEach(marble => {
        if (isMarbleSettled(marble)) {
          newSettledCount++
          if (!countedMarblesRef.current.has(marble.id)) {
            countedMarblesRef.current.add(marble.id)
            const bucketIndex = getBucketIndex(marble.position.x)
            if (bucketIndex !== -1) {
              marblePositionsRef.current[marble.id] = bucketIndex
              setBucketCounts(prev => {
                const newCounts = [...prev]
                newCounts[bucketIndex]++
                return newCounts
              })
              setScore(prev => prev + BUCKET_VALUES[bucketIndex])
              playBucketSound()
            }
          }
        }
      })

      setSettledMarbles(newSettledCount)

      if (newSettledCount === TOTAL_MARBLES && !gameEndedRef.current) {
        gameEndedRef.current = true
        setGameOver(true)
        setIsDropping(false)
        setGameInProgress(false)
        playGameOverSound()
      }
    })

    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

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

    // Modify event handlers for touch devices
    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true
      handleTouchMove(e)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return
      
      const touch = e.touches[0]
      const rect = canvasRef.current!.getBoundingClientRect()
      const scale = rect.width / CANVAS_WIDTH
      const canvasX = (CANVAS_WIDTH / 2) * scale
      const canvasY = DROPPER_HEIGHT * scale
      const touchX = touch.clientX - rect.left - canvasX
      const touchY = -(touch.clientY - rect.top - canvasY)
      let newAngle = Math.atan2(touchY, touchX)
      newAngle = Math.max(Math.min(newAngle, 3 * Math.PI / 4), Math.PI / 4)
      setArrowAngle(newAngle)
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
    }

    canvasRef.current.addEventListener('touchstart', handleTouchStart)
    canvasRef.current.addEventListener('touchmove', handleTouchMove)
    canvasRef.current.addEventListener('touchend', handleTouchEnd)

    return () => {
      Render.stop(render)
      World.clear(engine.world, false)
      Engine.clear(engine)
      Runner.stop(runner)
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown)
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      canvasRef.current?.removeEventListener('touchstart', handleTouchStart)
      canvasRef.current?.removeEventListener('touchmove', handleTouchMove)
      canvasRef.current?.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [arrowAngle, playObstacleSound, playBucketSound, playGameOverSound])

  const dropMarbles = useCallback(() => {
    if (!engineRef.current || gameInProgress) return

    // Reset game state
    setIsDropping(true)
    setGameOver(false)
    setGameInProgress(true)
    gameEndedRef.current = false
    marbleCountRef.current = 0
    countedMarblesRef.current.clear()
    marblePositionsRef.current = {}
    setScore(0)
    setBucketCounts(Array(BUCKET_VALUES.length).fill(0))
    setSettledMarbles(0)
    
    // Remove existing marbles
    if (engineRef.current) {
      const existingMarbles = Composite.allBodies(engineRef.current.world).filter(body => body.label === 'marble')
      World.remove(engineRef.current.world, existingMarbles)
    }
    
    playSound('gameStart');
    playSound('marbleDrop', 0.1);

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
  }, [gameInProgress, playSound, arrowAngle, BUCKET_VALUES.length]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[600px] mx-auto bg-transparent rounded-lg p-0">
      <div className="w-full bg-gradient-to-b from-[#F7931A] to-black p-2 sm:p-4 rounded-lg shadow-md">
        <div className="relative" style={{ paddingBottom: '100%' }}>
          <canvas 
            ref={canvasRef} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              touchAction: 'none',
              userSelect: 'none',
            }}
          />
        </div>
        <div className="mt-4 flex flex-col items-center">
          <p className="text-lg font-semibold mb-2 text-[#F7931A]">Score: {score} sats</p>
          <p className="text-xs sm:text-sm text-white mb-2">Tap and drag the arrow to adjust the direction</p>
          {/* <div className="flex justify-between w-full mb-4 overflow-x-auto">
            {BUCKET_VALUES.map((value, index) => (
              <div key={index} className="text-center mx-1">
                <p className="font-bold text-white text-xs sm:text-sm">{value}</p>
                <p className="text-white text-xs sm:text-sm">{bucketCounts[index]}</p>
              </div>
            ))}
          </div> */}
          <div className="flex items-center justify-center w-full space-x-2">
            <button 
              onClick={toggleMute} 
              className="text-white hover:text-gray-300 transition-colors p-2"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            {!gameInProgress && (
              <Button onClick={dropMarbles} className="bg-gradient-to-b from-[#F7931A] to-[#000000] text-white px-3 sm:px-4 py-2 text-sm sm:text-base">
                {gameOver ? "Claim Sats" : "Drop Marbles"}
              </Button>
            )}
            {gameInProgress && (
              <p className="text-base sm:text-lg font-semibold mt-2 text-orange-400">Game in progress...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarbleGameComponent;

