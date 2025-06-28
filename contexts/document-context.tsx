"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { IDocument } from "@/lib/models/document"
import { useAuth } from "./auth-context"
import { toast } from "@/hooks/use-toast"

interface DocumentContextType {
  documents: IDocument[]
  loading: boolean
  uploadDocument: (file: File, description?: string, tags?: string[], projectId?: string) => Promise<void>
  deleteDocument: (documentId: string) => Promise<void>
  downloadDocument: (documentId: string) => Promise<void>
  updateDocument: (documentId: string, updates: Partial<IDocument>) => Promise<void>
  fetchDocuments: (projectId?: string) => Promise<void>
  refreshDocuments: () => void
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchDocuments = async (projectId?: string) => {
    if (!user) return

    setLoading(true)
    try {
      const url = projectId ? `/api/documents?projectId=${projectId}` : "/api/documents"

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      } else {
        console.error("Failed to fetch documents:", response.status)
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca documentele",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca documentele",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async (file: File, description?: string, tags?: string[], projectId?: string) => {
    if (!user) return

    try {
      const formData = new FormData()
      formData.append("file", file)
      if (description) formData.append("description", description)
      if (tags) formData.append("tags", JSON.stringify(tags))
      if (projectId) formData.append("projectId", projectId)

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const newDocument = await response.json()
        setDocuments((prev) => [newDocument, ...prev])
        toast({
          title: "Succes",
          description: "Documentul a fost încărcat cu succes",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Eroare",
          description: error.error || "Nu s-a putut încărca documentul",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut încărca documentul",
        variant: "destructive",
      })
    }
  }

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc._id !== documentId))
        toast({
          title: "Succes",
          description: "Documentul a fost șters cu succes",
        })
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-a putut șterge documentul",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge documentul",
        variant: "destructive",
      })
    }
  }

  const downloadDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`)

      if (response.ok) {
        const blob = await response.blob()
        const document = documents.find((doc) => doc._id === documentId)

        if (document) {
          const url = window.URL.createObjectURL(blob)
          const a = window.document.createElement("a")
          a.href = url
          a.download = document.originalName
          window.document.body.appendChild(a)
          a.click()
          window.document.body.removeChild(a)
          window.URL.revokeObjectURL(url)

          toast({
            title: "Succes",
            description: "Documentul a fost descărcat",
          })
        }
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-a putut descărca documentul",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error downloading document:", error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut descărca documentul",
        variant: "destructive",
      })
    }
  }

  const updateDocument = async (documentId: string, updates: Partial<IDocument>) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedDocument = await response.json()
        setDocuments((prev) => prev.map((doc) => (doc._id === documentId ? updatedDocument : doc)))
        toast({
          title: "Succes",
          description: "Documentul a fost actualizat",
        })
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-a putut actualiza documentul",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating document:", error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza documentul",
        variant: "destructive",
      })
    }
  }

  const refreshDocuments = () => {
    fetchDocuments()
  }

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  return (
    <DocumentContext.Provider
      value={{
        documents,
        loading,
        uploadDocument,
        deleteDocument,
        downloadDocument,
        updateDocument,
        fetchDocuments,
        refreshDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
}
