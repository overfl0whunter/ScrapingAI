"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import type { Message } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, FileCode, Key } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  onCreateFile: (path: string, content: string) => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  apiKey: string
  setApiKey: (key: string) => void
}

export default function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  onCreateFile,
  selectedModel,
  setSelectedModel,
  apiKey,
  setApiKey,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const extractCodeBlocks = (content: string) => {
    const fileRegex = /```(\w+)\s+file="([^"]+)"\s*\n([\s\S]*?)```/g
    let match
    const files = []

    while ((match = fileRegex.exec(content)) !== null) {
      const [_, language, filePath, code] = match
      files.push({ language, filePath, code })
    }

    return files
  }

  const handleCreateFile = (message: Message) => {
    if (typeof message.content === "string") {
      const files = extractCodeBlocks(message.content)
      files.forEach((file) => {
        onCreateFile(file.filePath, file.code)
      })
    }
  }

  const formatMessage = (content: string) => {
    // Replace code blocks with formatted version
    return content.replace(
      /```(\w+)\s+file="([^"]+)"\s*\n([\s\S]*?)```/g,
      (_, language, filePath, code) => `<div class="bg-gray-100 rounded-md p-2 my-2">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold">${filePath}</span>
            <span class="text-xs bg-gray-200 px-2 py-1 rounded">${language}</span>
          </div>
          <pre class="text-sm overflow-x-auto p-2">${code}</pre>
        </div>`,
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div className="inline-block max-w-[80%]">
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm font-semibold mb-1">{message.role === "user" ? "You" : "AI Assistant"}</div>
                {typeof message.content === "string" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(message.content),
                    }}
                  />
                ) : (
                  <div>Content not available</div>
                )}
              </div>
              {message.role === "assistant" &&
                typeof message.content === "string" &&
                extractCodeBlocks(message.content).length > 0 && (
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCreateFile(message)}>
                    <FileCode className="h-4 w-4 mr-2" />
                    Create Files
                  </Button>
                )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex-grow">
            <Label htmlFor="model-select" className="text-xs mb-1 block">
              Modello AI
            </Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="model-select" className="w-full">
                <SelectValue placeholder="Seleziona modello" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">OpenAI GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3-opus-20240229">Anthropic Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet-20240229">Anthropic Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku-20240307">Anthropic Claude 3 Haiku</SelectItem>
                <SelectItem value="meta-llama/llama-3-70b-instruct">Meta Llama 3 70B</SelectItem>
                <SelectItem value="mistral/mistral-large-latest">Mistral Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Key className="h-4 w-4" />
                API Key
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <Label htmlFor="api-key">La tua API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Inserisci la tua API key per OpenAI, Anthropic o altri provider supportati. Puoi gestire le tue API
                  key nelle impostazioni.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {!apiKey && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Per utilizzare il modello selezionato, aggiungi la tua API key nelle impostazioni o inseriscila qui.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me to create a project or help with code..."
            disabled={isLoading || !apiKey}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading || !apiKey}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
