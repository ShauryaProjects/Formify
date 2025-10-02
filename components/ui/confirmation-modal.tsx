"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  confirmationPhrase: string
  variant?: "default" | "destructive"
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmationPhrase,
  variant = "default",
  isLoading = false
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("")
  const isConfirmDisabled = inputValue !== confirmationPhrase || isLoading

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!isConfirmDisabled) {
      onConfirm()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {variant === "destructive" && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            )}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-black/70">{description}</p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              To confirm, type: <span className="font-mono bg-black/5 px-2 py-1 rounded text-xs">{confirmationPhrase}</span>
            </label>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmationPhrase}
              className="font-mono"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className={cn(
                "flex-1",
                variant === "destructive"
                  ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
                  : "bg-black text-white hover:bg-black/90"
              )}
            >
              {isLoading ? "Processing..." : confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
