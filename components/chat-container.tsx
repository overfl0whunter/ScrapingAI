"use client"

import { useState, useEffect, useCallback } from "react"
import { useChat } from "ai/react"
import ChatInterface from "./chat-interface"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"

interface ChatContainerProps {
  sessionId?: string
}

export default function ChatContainer({ sessionId }: ChatContainerProps) {
  const { user } = useAuth()
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [apiKey, setApiKey] = useState("")
  const [loading, setLoading] = useState(true)

  const loadApiKey = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("user_api_keys")
        .select("api_key")
        .eq("user_id", user.id)
        .eq("service_name", selectedModel.startsWith("claude") ? "Anthropic" : "OpenAI")
        .single()

      if (!error && data && typeof data.api_key === "string") {
        setApiKey(data.api_key)
      }
    } catch (error) {
      console.error("Error loading API key:", error)
      toast.error("Errore nel caricamento della API key")
    } finally {
      setLoading(false)
    }
  }, [user, selectedModel])

  useEffect(() => {
    loadApiKey()
  }, [loadApiKey])

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
      apiKey: apiKey,
    },
    onResponse: (response) => {
      if (!response.ok) {
        response.json().then((data) => {
          if (data.error) {
            toast.error(data.error)
          }
        })
      }
    },
  })

  const handleCreateFile = (path: string, content: string) => {
    if (sessionId) {
      // Implementa la logica per salvare il file
      console.log("Salvataggio file:", path, content)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <ChatInterface
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        onCreateFile={handleCreateFile}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  )
}
