"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GripVertical, Trash2, Plus, X } from "lucide-react"
import type { Question, QuestionType } from "./form-builder"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface QuestionCardProps {
  question: Question
  index: number
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDelete: (id: string) => void
}

export default function QuestionCard({ question, index, onUpdate, onDelete }: QuestionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const hasOptions = ["multiple", "checkbox", "dropdown"].includes(question.type)

  const addOption = () => {
    const options = question.options || []
    onUpdate(question.id, { options: [...options, ""] })
  }

  const updateOption = (optionIndex: number, value: string) => {
    const options = [...(question.options || [])]
    options[optionIndex] = value
    onUpdate(question.id, { options })
  }

  const removeOption = (optionIndex: number) => {
    const options = question.options?.filter((_, i) => i !== optionIndex) || []
    onUpdate(question.id, { options })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-question-id={question.id}
      className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-black/40 hover:text-black transition-colors active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-black">Question {index + 1}</span>
        </div>
        <Button
          onClick={() => onDelete(question.id)}
          variant="ghost"
          size="icon"
          className="text-black/40 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}`} className="text-black">
            Question Text
          </Label>
          <Input
            id={`question-${question.id}`}
            placeholder="Enter your question..."
            value={question.text}
            onChange={(e) => onUpdate(question.id, { text: e.target.value })}
            className="border-black/20 bg-white text-black placeholder:text-black/40"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`type-${question.id}`} className="text-black">
              Question Type
            </Label>
            <div className="flex items-center gap-2">
              <Label htmlFor={`required-${question.id}`} className="text-xs text-black/60">
                Required
              </Label>
              <Switch
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) => onUpdate(question.id, { required: checked })}
                className="h-4 w-8 [&>span]:h-4 [&>span]:w-4"
              />
            </div>
          </div>

          <Select
            value={question.type}
            onValueChange={(value: QuestionType) => {
              const updates: Partial<Question> = { type: value }
              if (!["multiple", "checkbox", "dropdown"].includes(value)) {
                updates.options = undefined
              } else if (!question.options) {
                updates.options = ["Option 1"]
              }
              onUpdate(question.id, updates)
            }}
          >
            <SelectTrigger className="border-black/20 bg-white text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short Answer</SelectItem>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="multiple">Multiple Choice</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="dropdown">Dropdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasOptions && (
          <div className="space-y-3">
            <Label className="text-black">Options</Label>
            <div className="space-y-2">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                    className="flex-1 border-black/20 bg-white text-black placeholder:text-black/40"
                  />
                  <Button
                    onClick={() => removeOption(optionIndex)}
                    variant="ghost"
                    size="icon"
                    className="text-black/40 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={addOption}
              variant="outline"
              size="sm"
              className="border-black/20 bg-transparent text-black hover:bg-black/5"
            >
              <Plus className="mr-2 h-3 w-3" />
              Add Option
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`placeholder-${question.id}`} className="text-black">
            Placeholder
          </Label>
          <Input
            id={`placeholder-${question.id}`}
            placeholder="Enter a placeholder shown in the input"
            value={question.placeholder ?? ""}
            onChange={(e) => onUpdate(question.id, { placeholder: e.target.value })}
            className="border-black/20 bg-white text-black placeholder:text-black/40"
          />
        </div>
      </div>
    </div>
  )
}
