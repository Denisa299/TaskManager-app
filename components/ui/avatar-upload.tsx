"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { stringToColor } from "@/lib/utils"

interface AvatarUploadProps {
  initialImage?: string
  firstName?: string
  lastName?: string
  onImageChange?: (file: File | null, previewUrl?: string) => void
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function AvatarUpload({
  initialImage,
  firstName = "",
  lastName = "",
  onImageChange,
  className = "",
  size = "md",
}: AvatarUploadProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Încarcă imaginea inițială când componenta este montată
  useEffect(() => {
    if (initialImage) {
      setImage(initialImage)
    }
  }, [initialImage])

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl",
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verifică tipul fișierului
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Eroare",
        description: "Te rugăm să selectezi o imagine.",
        variant: "destructive",
      })
      return
    }

    // Verifică dimensiunea fișierului (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Eroare",
        description: "Imaginea trebuie să fie mai mică de 5MB.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImage(result)
      if (onImageChange) {
        onImageChange(file, result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onImageChange) {
      onImageChange(null)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Generează inițiale pentru fallback
  const getInitials = () => {
    const firstInitial = firstName.charAt(0).toUpperCase()
    const lastInitial = lastName.charAt(0).toUpperCase()
    return `${firstInitial}${lastInitial}` || "U"
  }

  // Generează culoare consistentă pentru avatar
  const avatarColor = stringToColor(`${firstName} ${lastName}`)

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
        aria-label="Încarcă avatar"
      />

      <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Avatar className={`${sizeClasses[size]} transition-all duration-200 ${isHovered ? "opacity-75" : ""}`}>
          <AvatarImage src={image || ""} alt="Avatar" />
          <AvatarFallback
            className={`${textSizeClasses[size]} bg-gradient-to-r ${avatarColor} text-white font-semibold`}
          >
            {getInitials()}
          </AvatarFallback>
        </Avatar>

        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full"></div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={triggerFileInput}
            className="z-10 h-8 w-8 rounded-full bg-white bg-opacity-80 text-gray-700 hover:bg-white"
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Încarcă avatar</span>
          </Button>

          {image && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleRemoveImage}
              className="z-10 h-8 w-8 rounded-full bg-white bg-opacity-80 text-gray-700 hover:bg-white absolute -bottom-1 -right-1"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Șterge avatar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
