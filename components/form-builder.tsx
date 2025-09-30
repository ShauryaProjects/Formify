"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FormSettings from "./form-settings"
import QuestionList from "./question-list"
import FormPreviewLive from "./form-preview-live"
import StepsPanel from "./steps-panel"
import type { Step } from "./steps-panel"
import { ArrowLeft, Save, Eye, X } from "lucide-react"
import Link from "next/link"

export type QuestionType = "short" | "paragraph" | "multiple" | "checkbox" | "dropdown"

export interface Question {
  id: string
  text: string
  type: QuestionType
  required: boolean
  placeholder?: string
  options?: string[]
  stepId: string // Added stepId to associate questions with steps
}

export interface FormData {
  title: string
  description: string
  questions: Question[]
  steps: Step[] // Added steps array
}

export default function FormBuilder() {
  const [steps, setSteps] = useState<Step[]>([{ id: "step-1", title: "Step 1" }])
  const [activeStepId, setActiveStepId] = useState<string>("step-1")

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    questions: [],
    steps: [{ id: "step-1", title: "Step 1" }],
  })
  const [savedFormId, setSavedFormId] = useState<string | null>(null)
  const [isPreviewOpen, setPreviewOpen] = useState(false)

  const activeStepQuestions = formData.questions.filter((q) => q.stepId === activeStepId)

  const handleSaveForm = () => {
    const formId = `form-${Date.now()}`
    setSavedFormId(formId)
    console.log("Form saved:", formData)
  }

  const handleQuestionsChange = (questions: Question[]) => {
    const otherStepQuestions = formData.questions.filter((q) => q.stepId !== activeStepId)
    setFormData({ ...formData, questions: [...otherStepQuestions, ...questions] })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-black hover:text-black/60 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <Button
            onClick={handleSaveForm}
            className="bg-black text-white hover:bg-black/90 transition-all duration-300 hover:scale-105"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Form
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[20%_55%_25%] gap-0 h-[calc(100vh-8rem)]">
          {/* Left Column: Steps Panel (20%) */}
          <div className="overflow-y-auto pr-6 border-r border-black/10">
            <StepsPanel
              steps={steps}
              activeStepId={activeStepId}
              onStepsChange={(newSteps) => {
                setSteps(newSteps)
                setFormData({ ...formData, steps: newSteps })
              }}
              onActiveStepChange={setActiveStepId}
            />
          </div>

          {/* Middle Column: Form Builder (55%) */}
          <div className="overflow-y-auto px-6 border-r border-black/10">
            <div className="space-y-8">
              {/* Form Settings */}
              <FormSettings
                title={formData.title}
                description={formData.description}
                onTitleChange={(title) => setFormData({ ...formData, title })}
                onDescriptionChange={(description) => setFormData({ ...formData, description })}
              />

              {/* Question List for Active Step */}
              <QuestionList
                questions={activeStepQuestions}
                onQuestionsChange={handleQuestionsChange}
                stepId={activeStepId}
              />

              {/* Saved Form Link */}
              {savedFormId && (
                <div className="rounded-2xl border border-black/10 bg-black/5 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-black">Form Saved Successfully!</h3>
                  <p className="mb-3 text-sm text-black/60">Share this link with others:</p>
                  <div className="flex items-center gap-3">
                    <Input
                      readOnly
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/form/${savedFormId}`}
                      className="flex-1 border-black/20 bg-white text-black"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/form/${savedFormId}`)
                      }}
                      variant="outline"
                      className="border-black/20 bg-transparent text-black hover:bg-black hover:text-white"
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Preview (25%) - hidden on mobile */}
          <div className="overflow-y-auto pl-6 hidden lg:block">
            <div className="sticky top-0 mb-4 pb-4 bg-white/80 backdrop-blur-sm border-b border-black/10">
              <h2 className="text-lg font-semibold text-black">Preview</h2>
              <p className="text-sm text-black/60">
                Step {steps.findIndex((s) => s.id === activeStepId) + 1} of {steps.length}
              </p>
            </div>
            <FormPreviewLive
              formData={formData}
              activeStepId={activeStepId}
              steps={steps}
              onStepChange={setActiveStepId}
            />
          </div>
        </div>
      </div>

      {/* Floating mobile button to open preview */}
      <div className="lg:hidden fixed bottom-5 right-5 z-50">
        <Button
          onClick={() => setPreviewOpen(true)}
          className="rounded-xl bg-black text-white shadow-xl px-5 py-6 h-auto hover:bg-black/90 transition-transform duration-200 hover:scale-105"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Preview
        </Button>
      </div>

      {/* Mobile Preview Modal */}
      {isPreviewOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
          <div className="absolute inset-x-0 bottom-0 top-0 flex items-end">
            <div className="w-full rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out">
              <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                <div className="font-semibold text-black">Preview</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewOpen(false)}
                  className="text-black/60 hover:text-black hover:bg-black/5"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="max-h-[calc(100vh-6rem)] overflow-y-auto p-4">
                <FormPreviewLive
                  formData={formData}
                  activeStepId={activeStepId}
                  steps={steps}
                  onStepChange={setActiveStepId}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
