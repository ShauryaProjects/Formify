"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"
import gsap from "gsap"
import { useState } from "react"

export interface Step {
  id: string
  title: string
}

interface StepsPanelProps {
  steps: Step[]
  activeStepId: string
  onStepsChange: (steps: Step[]) => void
  onActiveStepChange: (stepId: string) => void
}

export default function StepsPanel({ steps, activeStepId, onStepsChange, onActiveStepChange }: StepsPanelProps) {
  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
      )
    }
  }, [])

  const addStep = () => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      title: `Step ${steps.length + 1}`,
    }
    onStepsChange([...steps, newStep])
    onActiveStepChange(newStep.id)

    // Animate new step
    setTimeout(() => {
      const newElement = panelRef.current?.querySelector(`[data-step-id="${newStep.id}"]`)
      if (newElement) {
        gsap.fromTo(
          newElement,
          { opacity: 0, x: -20, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
        )
      }
    }, 50)
  }

  const deleteStep = (stepId: string) => {
    if (steps.length === 1) return // Don't delete the last step

    const element = panelRef.current?.querySelector(`[data-step-id="${stepId}"]`)
    if (element) {
      gsap.to(element, {
        opacity: 0,
        x: -30,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          const newSteps = steps.filter((s) => s.id !== stepId)
          onStepsChange(newSteps)
          if (activeStepId === stepId) {
            onActiveStepChange(newSteps[0].id)
          }
        },
      })
    }
  }

  const startEditing = (step: Step) => {
    setEditingStepId(step.id)
    setEditingTitle(step.title)
  }

  const saveEdit = () => {
    if (editingStepId) {
      onStepsChange(steps.map((s) => (s.id === editingStepId ? { ...s, title: editingTitle } : s)))
      setEditingStepId(null)
    }
  }

  const cancelEdit = () => {
    setEditingStepId(null)
    setEditingTitle("")
  }

  return (
    <div ref={panelRef} className="space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-black mb-2">Form Steps</h2>
        <p className="text-sm text-black/60">Organize your form into multiple pages</p>
      </div>

      <Button
        onClick={addStep}
        className="w-full rounded-xl border-2 border-dashed border-black/20 bg-transparent py-6 text-black hover:border-black/40 hover:bg-black/5 transition-all duration-300 hover:scale-[1.02]"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Page/Step
      </Button>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            data-step-id={step.id}
            className={`rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer ${
              activeStepId === step.id
                ? "border-black bg-black text-white shadow-lg scale-[1.02]"
                : "border-black/20 bg-white text-black hover:border-black/40 hover:bg-black/5"
            }`}
            onClick={() => onActiveStepChange(step.id)}
          >
            {editingStepId === step.id ? (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 h-8 text-sm border-black/20"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit()
                    if (e.key === "Escape") cancelEdit()
                  }}
                />
                <Button size="sm" variant="ghost" onClick={saveEdit} className="h-8 w-8 p-0 hover:bg-green-500/20">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8 w-8 p-0 hover:bg-red-500/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs opacity-60 mb-1">Step {index + 1}</div>
                  <div className="font-semibold">{step.title}</div>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(step)}
                    className={`h-8 w-8 p-0 ${activeStepId === step.id ? "hover:bg-white/20" : "hover:bg-black/10"}`}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  {steps.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteStep(step.id)}
                      className={`h-8 w-8 p-0 ${
                        activeStepId === step.id ? "hover:bg-red-500/20" : "hover:bg-red-500/10"
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
