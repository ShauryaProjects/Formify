"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import QuestionCard from "./question-card"
import { Plus } from "lucide-react"
import gsap from "gsap"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Question } from "./form-builder"

interface QuestionListProps {
  questions: Question[]
  onQuestionsChange: (questions: Question[]) => void
  stepId: string // Added stepId prop
}

export default function QuestionList({ questions, onQuestionsChange, stepId }: QuestionListProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" },
      )
    }
  }, [])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: "",
      type: "short",
      required: false,
      placeholder: "",
      stepId: stepId,
    }
    onQuestionsChange([...questions, newQuestion])

    setTimeout(() => {
      const newCard = listRef.current?.lastElementChild
      if (newCard) {
        gsap.fromTo(
          newCard,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        )
      }
    }, 50)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onQuestionsChange(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const deleteQuestion = (id: string) => {
    const element = document.querySelector(`[data-question-id="${id}"]`)
    if (element) {
      gsap.to(element, {
        opacity: 0,
        x: -50,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          onQuestionsChange(questions.filter((q) => q.id !== id))
        },
      })
    } else {
      onQuestionsChange(questions.filter((q) => q.id !== id))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id)
      const newIndex = questions.findIndex((q) => q.id === over.id)
      onQuestionsChange(arrayMove(questions, oldIndex, newIndex))
    }
  }

  return (
    <div className="space-y-6">
      <div ref={listRef} className="space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <Button
        ref={buttonRef}
        onClick={addQuestion}
        className="w-full rounded-2xl border-2 border-dashed border-black/20 bg-transparent py-8 text-black hover:border-black/40 hover:bg-black/5 transition-all duration-300 hover:scale-[1.02]"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Question
      </Button>
    </div>
  )
}
