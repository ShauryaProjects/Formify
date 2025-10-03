"use client"

import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import gsap from "gsap"

interface FormSettingsProps {
  title: string
  description: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
}

export default function FormSettings({ title, description, onTitleChange, onDescriptionChange }: FormSettingsProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
    }
  }, [])

  return (
    <div ref={cardRef} className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
      <h2 className="mb-6 text-2xl font-bold text-black">Form Settings</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="form-title" className="text-black">
            Form Title
          </Label>
          <Input
            id="form-title"
            placeholder="Enter form title..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="border-black/20 bg-white text-black placeholder:text-black/40"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="form-description" className="text-black">
            Form Description
          </Label>
          <Textarea
            id="form-description"
            placeholder="Enter form description..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
            className="border-black/20 bg-white text-black placeholder:text-black/40 resize-none"
          />
        </div>
      </div>
    </div>
  )
}
