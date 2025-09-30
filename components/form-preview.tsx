"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import type { FormData } from "./form-builder"
import gsap from "gsap"

interface FormPreviewProps {
  formData: FormData
  onBack: () => void
}

export default function FormPreview({ formData, onBack }: FormPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll(".preview-item")
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Editor</span>
          </button>
          <span className="text-sm text-white/60">Preview Mode</span>
        </div>
      </header>

      {/* Preview Content */}
      <div ref={containerRef} className="container mx-auto px-6 pt-24 pb-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl md:p-12">
            {/* Form Header */}
            <div className="preview-item mb-8 space-y-3">
              <h1 className="text-3xl font-bold text-black md:text-4xl">{formData.title || "Untitled Form"}</h1>
              {formData.description && <p className="text-black/60 leading-relaxed">{formData.description}</p>}
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="preview-item space-y-3">
                  <Label className="text-base font-semibold text-black">
                    {index + 1}. {question.text || "Untitled Question"}
                    {question.required && <span className="ml-1 text-red-600">*</span>}
                  </Label>

                  {question.type === "short" && (
                    <Input placeholder="Your answer" className="border-black/20 bg-white text-black" />
                  )}

                  {question.type === "paragraph" && (
                    <Textarea
                      placeholder="Your answer"
                      rows={4}
                      className="border-black/20 bg-white text-black resize-none"
                    />
                  )}

                  {question.type === "multiple" && (
                    <RadioGroup>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label
                            htmlFor={`${question.id}-${optionIndex}`}
                            className="font-normal text-black cursor-pointer"
                          >
                            {option || `Option ${optionIndex + 1}`}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "checkbox" && (
                    <div className="space-y-3">
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <Checkbox id={`${question.id}-${optionIndex}`} />
                          <Label
                            htmlFor={`${question.id}-${optionIndex}`}
                            className="font-normal text-black cursor-pointer"
                          >
                            {option || `Option ${optionIndex + 1}`}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "dropdown" && (
                    <Select>
                      <SelectTrigger className="border-black/20 bg-white text-black">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options?.map((option, optionIndex) => (
                          <SelectItem key={optionIndex} value={option}>
                            {option || `Option ${optionIndex + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            {formData.questions.length > 0 && (
              <div className="preview-item mt-8">
                <Button className="w-full bg-black text-white hover:bg-black/90 transition-all duration-300 hover:scale-[1.02] py-6 text-base">
                  Submit Form
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
