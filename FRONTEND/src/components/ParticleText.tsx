"use client"

import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 4.0
  maxForce = 0.05
  particleSize = 10
  isKilled = false

  startColor = { r: 0, g: 0, b: 0 }
  targetColor = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move(mousePos?: Vector2D | null) {
    let proximityMult = 1
    const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2))

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    // Mouse repulsion force
    if (mousePos && !this.isKilled) {
      const mouseDistance = Math.sqrt(
        Math.pow(this.pos.x - mousePos.x, 2) + Math.pow(this.pos.y - mousePos.y, 2)
      )
      const repulsionRadius = 100
      
      if (mouseDistance < repulsionRadius) {
        const repulsionStrength = (1 - mouseDistance / repulsionRadius) * 2
        const awayFromMouse = {
          x: this.pos.x - mousePos.x,
          y: this.pos.y - mousePos.y,
        }
        
        const awayMagnitude = Math.sqrt(awayFromMouse.x * awayFromMouse.x + awayFromMouse.y * awayFromMouse.y)
        if (awayMagnitude > 0) {
          this.acc.x += (awayFromMouse.x / awayMagnitude) * repulsionStrength
          this.acc.y += (awayFromMouse.y / awayMagnitude) * repulsionStrength
        }
      }
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y)
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    }

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce
      steer.y = (steer.y / steerMagnitude) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const angle = Math.random() * Math.PI * 2
      const mag = (width + height) / 2
      const centerX = width / 2
      const centerY = height / 2
      const exitX = centerX + Math.cos(angle) * mag
      const exitY = centerY + Math.sin(angle) * mag

      this.target.x = exitX
      this.target.y = exitY

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0

      this.isKilled = true
    }
  }
}

interface ParticleTextProps {
  words?: string[]
}

const DEFAULT_WORDS = ["CLUB - CONNECT", "CONNECT", "COMMUNITY", "EVENTS"]

export function ParticleText({ words = DEFAULT_WORDS }: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const wordIndexRef = useRef(0)
  const wordFormedRef = useRef(false)
  const pauseFramesRef = useRef(0)
  const mousePosRef = useRef<Vector2D | null>(null)

  const pixelSteps = 6
  const drawAsPoints = true
  const pauseDuration = 180 // 3 seconds pause at 60fps

  const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
    const angle = Math.random() * Math.PI * 2
    const startX = x + Math.cos(angle) * mag
    const startY = y + Math.sin(angle) * mag
    return { x: startX, y: startY }
  }

  const nextWord = (word: string, canvas: HTMLCanvasElement) => {
    const offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const offscreenCtx = offscreenCanvas.getContext("2d")!

    offscreenCtx.fillStyle = "white"
    offscreenCtx.font = "bold 100px Arial"
    offscreenCtx.textAlign = "center"
    offscreenCtx.textBaseline = "middle"
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 3)

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    const newColor = { r: 255, g: 255, b: 255 }
    const particles = particlesRef.current
    let particleIndex = 0

    const coordsIndexes: number[] = []
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i)
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex
      const alpha = pixels[pixelIndex + 3]

      if (alpha > 0) {
        const x = (pixelIndex / 4) % canvas.width
        const y = Math.floor(pixelIndex / 4 / canvas.width)

        let particle: Particle

        if (particleIndex < particles.length) {
          particle = particles[particleIndex]
          particle.isKilled = false
          particleIndex++
        } else {
          particle = new Particle()
          const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
          particle.pos.x = randomPos.x
          particle.pos.y = randomPos.y
          particle.maxSpeed = Math.random() * 2 + 2
          particle.maxForce = particle.maxSpeed * 0.05
          particle.particleSize = Math.random() * 6 + 6
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025
          particles.push(particle)
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        }
        particle.targetColor = newColor
        particle.colorWeight = 0
        particle.target.x = x
        particle.target.y = y
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height)
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      particle.move(mousePosRef.current)
      particle.draw(ctx, drawAsPoints)

      if (particle.isKilled) {
        if (particle.pos.x < 0 || particle.pos.x > canvas.width || particle.pos.y < 0 || particle.pos.y > canvas.height) {
          particles.splice(i, 1)
        }
      }
    }

    // Check if all particles have reached their targets (word is formed)
    if (!wordFormedRef.current) {
      const allParticlesInPlace = particles.every((particle) => {
        if (particle.isKilled) return true
        const distance = Math.sqrt(
          Math.pow(particle.pos.x - particle.target.x, 2) + Math.pow(particle.pos.y - particle.target.y, 2)
        )
        return distance < 5 // Within 5 pixels of target
      })

      if (allParticlesInPlace && particles.length > 0) {
        wordFormedRef.current = true
        pauseFramesRef.current = 0
      }
    }

    // If word is formed, count pause frames
    if (wordFormedRef.current) {
      pauseFramesRef.current++

      // After pause duration, transition to next word
      if (pauseFramesRef.current >= pauseDuration) {
        wordIndexRef.current = (wordIndexRef.current + 1) % words.length
        nextWord(words[wordIndexRef.current], canvas)
        wordFormedRef.current = false
        pauseFramesRef.current = 0
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mousePosRef.current = null
    }

    resizeCanvas()
    nextWord(words[0], canvas)
    animate()

    const handleResize = () => {
      resizeCanvas()
      nextWord(words[wordIndexRef.current], canvas)
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <div className="w-full h-full absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" style={{ background: "black", zIndex: 10 }} />
    </div>
  )
}
