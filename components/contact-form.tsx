"use client"

import { useState, type FormEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface ContactFormProps {
  onClose: () => void
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    honeypot: "", // Bot detection field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    // Prevent scrolling when form is open
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'

    // Cleanup function to restore scrolling when form closes
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.height = 'unset'
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitMessage("Registrat correctament! Fins aviat :)")
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        const error = await response.json()
        setSubmitMessage(error.error || "Error en l'enviament")
      }
    } catch (error) {
      setSubmitMessage("Error de connexió")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-background/40 backdrop-blur-md border border-border/50 rounded-lg shadow-2xl p-8 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-6">31/10, 23:30-??? </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nom
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-border text-foreground focus:ring-ring"
              placeholder="Introdueix el teu nom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname" className="text-foreground">
              Cognom
            </Label>
            <Input
              id="surname"
              type="text"
              required
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              className="bg-background border-border text-foreground focus:ring-ring"
              placeholder="Introdueix el teu cognom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-background border-border text-foreground focus:ring-ring"
              placeholder="Introdueix el teu correu electrònic"
            />
          </div>

          {/* Honeypot field - hidden from users but visible to bots */}
          <div style={{ display: 'none' }}>
            <Label htmlFor="website">Website (leave blank)</Label>
            <Input
              id="website"
              type="text"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>


          {submitMessage && (
            <p className={`text-sm pt-2 ${submitMessage.includes("Error") ? "text-red-500" : "text-green-500"}`}>
              {submitMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6 disabled:opacity-50"
          >
            {isSubmitting ? "Enviant..." : "fins HuertoWeen :)"}
          </Button>
        </form>
      </div>
    </div>
  )
}
