"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { FormData } from "./form-builder"
import type { Step } from "./steps-panel"
import gsap from "gsap"

interface FormPreviewLiveProps {
  formData: FormData
  activeStepId: string // Added activeStepId prop
  steps: Step[] // Added steps prop
  onStepChange: (stepId: string) => void // Added onStepChange prop
}

export default function FormPreviewLive({ formData, activeStepId, steps, onStepChange }: FormPreviewLiveProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prevQuestionsRef = useRef<string[]>([])

  const activeStepQuestions = formData.questions.filter((q) => q.stepId === activeStepId)
  const currentStepIndex = steps.findIndex((s) => s.id === activeStepId)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  useEffect(() => {
    if (!containerRef.current) return

    const currentQuestionIds = activeStepQuestions.map((q) => q.id)
    const prevQuestionIds = prevQuestionsRef.current

    const newQuestionIds = currentQuestionIds.filter((id) => !prevQuestionIds.includes(id))

    if (newQuestionIds.length > 0) {
      newQuestionIds.forEach((id) => {
        const element = containerRef.current?.querySelector(`[data-question-preview-id="${id}"]`)
        if (element) {
          gsap.fromTo(
            element,
            { opacity: 0, y: 20, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power3.out",
            },
          )
        }
      })
    }

    prevQuestionsRef.current = currentQuestionIds
  }, [activeStepQuestions])

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll(".preview-item")
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
        },
      )
    }
  }, [activeStepId])

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      onStepChange(steps[currentStepIndex - 1].id)
    }
  }

  const handleNextStep = () => {
    if (!isLastStep) {
      onStepChange(steps[currentStepIndex + 1].id)
    }
  }

  return (
    <div ref={containerRef} className="rounded-2xl bg-neutral-100 p-8 shadow-lg">
      {/* Form Header */}
      <div className="preview-item mb-8 space-y-3">
        <h1 className="text-3xl font-bold text-black md:text-4xl">{formData.title || "Untitled Form"}</h1>
        {formData.description && <p className="text-black/60 leading-relaxed">{formData.description}</p>}
        {steps.length > 1 && (
          <div className="text-sm text-black/60 font-medium">
            {steps[currentStepIndex]?.title} ({currentStepIndex + 1} of {steps.length})
          </div>
        )}
      </div>

      {/* Questions */}
      {activeStepQuestions.length > 0 ? (
        <div className="space-y-8">
          {activeStepQuestions.map((question, index) => (
            <div key={question.id} data-question-preview-id={question.id} className="preview-item space-y-3">
              <Label className="text-base font-semibold text-black">
                {index + 1}. {question.text || "Untitled Question"}
                {question.required && <span className="ml-1 text-red-600">*</span>}
              </Label>

              {question.type === "short" && (
                <Input
                  placeholder={question.placeholder && question.placeholder.length > 0 ? question.placeholder : "Your answer"}
                  className="border-black/20 bg-white text-black"
                />
              )}

              {question.type === "paragraph" && (
                <Textarea
                  placeholder={question.placeholder && question.placeholder.length > 0 ? question.placeholder : "Your answer"}
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

          <div className="preview-item mt-8 flex items-center justify-between gap-4">
            {steps.length > 1 && !isFirstStep && (
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                className="border-black/20 bg-white text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}

            {isLastStep ? (
              <Button className="ml-auto bg-black text-white hover:bg-black/90 transition-all duration-300 hover:scale-[1.02] py-6 px-8 text-base">
                Submit Form
              </Button>
            ) : (
              <Button
                onClick={handleNextStep}
                className="ml-auto bg-black text-white hover:bg-black/90 transition-all duration-300 hover:scale-[1.02] py-6 px-8 text-base"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-black/40 text-sm">No questions yet. Add questions to see the preview.</p>
        </div>
      )}
    </div>
  )
}
