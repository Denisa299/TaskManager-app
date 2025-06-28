"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Download,
  Trash2,
  Edit,
  File,
  ImageIcon,
  FileText,
  Archive,
  Video,
  Music,
  MoreVertical,
  Eye,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import type { IDocument } from "@/lib/models/document"

interface DocumentCardProps {
  document: IDocument
  currentUserId: string
  onDownload: (documentId: string) => Promise<void>
  onDelete: (documentId: string) => Promise<void>
  onEdit?: (document: IDocument) => void
}

export function DocumentCard({ document, currentUserId, onDownload, onDelete, onEdit }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await onDelete(document._id!)
    } finally {
      setIsDeleting(false)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-8 w-8 text-blue-500" />
    if (type.startsWith("video/")) return <Video className="h-8 w-8 text-purple-500" />
    if (type.startsWith("audio/")) return <Music className="h-8 w-8 text-green-500" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="h-8 w-8 text-red-500" />
    if (type.includes("zip") || type.includes("rar")) return <Archive className="h-8 w-8 text-orange-500" />
    return <File className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          {getFileIcon(document.type)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownload(document._id!)}>
                <Download className="h-4 w-4 mr-2" />
                Descarcă
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(document.url, "_blank")}>
                <Eye className="h-4 w-4 mr-2" />
                Previzualizează
              </DropdownMenuItem>
              {document.uploadedBy._id === currentUserId && (
                <>
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(document)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editează
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Se șterge..." : "Șterge"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-sm mb-1 truncate" title={document.name}>
          {document.name}
        </h3>

        {document.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{document.description}</p>
        )}

        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={document.uploadedBy.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-xs">
              {document.uploadedBy.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">{document.uploadedBy.name}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{formatFileSize(document.size)}</span>
          <span>
            {formatDistanceToNow(new Date(document.createdAt), {
              addSuffix: true,
              locale: ro,
            })}
          </span>
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {document.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {document.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{document.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Download className="h-3 w-3" />
            <span>{document.downloadCount}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => onDownload(document._id!)} className="h-6 px-2 text-xs">
            Descarcă
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
