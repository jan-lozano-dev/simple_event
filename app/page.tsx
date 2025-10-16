"use client"

import { useState, useEffect } from "react"
import HalftoneWaves from "@/components/halftone-waves"
import ContactForm from "@/components/contact-form"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    // Prevent scrolling on the main page
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
  }, [])

  return (
    <main className="relative">
      <HalftoneWaves />

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10" style={{ height: '100vh', height: '100dvh' }}>
        <Button variant="default"
          onClick={() => setIsFormOpen(true)}
          className="pointer-events-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full flex items-center justify-center p-0 h-20 text-lg w-64"
          style={{ transform: 'translate(-50%, -50%)', position: 'absolute', left: '50%', top: '50%' }}
        >
          {"barra lliure, cara tapada."}
        </Button>
      </div>

      {isFormOpen && <ContactForm onClose={() => setIsFormOpen(false)} />}
    </main>
  )
}
