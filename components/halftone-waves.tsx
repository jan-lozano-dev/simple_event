"use client"

import { useEffect, useRef } from 'react'

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight + 100 // Add extra height for mobile browsers

      canvas.width = width * dpr
      canvas.height = height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    }

    const drawHalftoneWave = () => {
      const gridSize = 20
      const width = window.innerWidth
      const height = window.innerHeight + 100
      const rows = Math.ceil(height / gridSize)
      const cols = Math.ceil(width / gridSize)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize
          const centerY = y * gridSize
          const distanceFromCenter = Math.sqrt(
            Math.pow(centerX - width / 2, 2) +
            Math.pow(centerY - window.innerHeight / 2, 2)
          )
          const maxDistance = Math.sqrt(
            Math.pow(width / 2, 2) +
            Math.pow(window.innerHeight / 2, 2)
          )
          const normalizedDistance = distanceFromCenter / maxDistance
          
          const waveOffset = Math.sin(normalizedDistance * 10 - time) * 0.5 + 0.5
          const size = gridSize * waveOffset * 0.8

          ctx.beginPath()
          ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${waveOffset * 0.5})`
          ctx.fill()
        }
      }
    }

    const animate = () => {
      const width = window.innerWidth
      const height = window.innerHeight + 100
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)

      drawHalftoneWave()

      time += 0.05
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full bg-black" style={{ height: '100vh', minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }} />
}
