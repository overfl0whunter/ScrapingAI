"use client"

import type React from "react"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { ChatSession, ChatMessage } from "@/types/database-types"

interface SessionDetailProps {
  session: ChatSession
  messages: ChatMessage[]
  onMessageAdded: (message: ChatMessage) => void
  userId: string // Add userId prop
}

export default function SessionDetail({ session, messages, onMessageAdded, userId }: SessionDetailProps) {
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    setSending(true)

    try {
      const { data: message, error } = await supabase
        .from("chat_messages")
        .insert({
          session_id: session.id,
          role: "user",
          content: newMessage.trim(),
          user_id: userId, // Include the user_id
        })
        .select()
        .single()

      if (error) throw error

      // Clear input and update messages
      setNewMessage("")
      if (message) {
        onMessageAdded(message)
      }

      // Simulate AI response (in a real app, this would call an AI API)
      setTimeout(async () => {
        const { data: aiMessage, error: aiError } = await supabase
          .from("chat_messages")
          .insert({
            session_id: session.id,
            role: "assistant",
            content: `This is a simulated AI response to: "${newMessage.trim()}"`,
            user_id: userId, // Include the user_id for AI messages too
          })
          .select()
          .single()

        if (!aiError && aiMessage) {
          onMessageAdded(aiMessage)
        }
      }, 1500)
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{session.title}</h2>
        <p className="text-sm text-gray-500">Created: {new Date(session.created_at).toLocaleString()}</p>
      </div>

      <ScrollArea className="flex-grow pr-4 mb-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No messages in this session</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="text-sm font-semibold mb-1">{message.role === "user" ? "You" : "AI Assistant"}</div>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs mt-1 opacity-70">{new Date(message.created_at).toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        )}
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending}
          className="flex-grow"
        />
        <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
