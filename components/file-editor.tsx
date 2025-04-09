"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import type { ProjectFile } from "@/types/database-types"

interface FileEditorProps {
  file: ProjectFile | null
  onUpdateFile: (fileId: string, content: string) => void
}

export default function FileEditor({ file, onUpdateFile }: FileEditorProps) {
  const [content, setContent] = useState("")
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    if (file) {
      setContent(file.content)
      setIsModified(false)
    }
  }, [file])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsModified(true)
  }

  const handleSave = () => {
    if (file && isModified) {
      onUpdateFile(file.id, content)
      setIsModified(false)
    }
  }

  // Determine language for syntax highlighting
  const getLanguage = (filePath: string) => {
    const extension = filePath.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "js":
        return "javascript"
      case "jsx":
        return "jsx"
      case "ts":
        return "typescript"
      case "tsx":
        return "tsx"
      case "css":
        return "css"
      case "html":
        return "html"
      case "json":
        return "json"
      case "md":
        return "markdown"
      default:
        return "plaintext"
    }
  }

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Select a file to edit</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="font-mono text-sm truncate">{file.path}</div>
        <Button size="sm" onClick={handleSave} disabled={!isModified} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      <textarea
        value={content}
        onChange={handleContentChange}
        className="flex-grow p-4 font-mono text-sm resize-none focus:outline-none w-full h-full"
        spellCheck={false}
      />
    </div>
  )
}
