"use client"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { ChatSession, ProjectFile } from "@/types/database-types"
import type { Message } from "ai"

export const DatabaseService = {
  // Chat Sessions
  async createChatSession(title: string): Promise<ChatSession | null> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("chat_sessions").insert({ title }).select().single()

    if (error) {
      console.error("Error creating chat session:", error)
      return null
    }

    return data
  },

  async getChatSessions(): Promise<ChatSession[]> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("chat_sessions").select("*").order("updated_at", { ascending: false })

    if (error) {
      console.error("Error getting chat sessions:", error)
      return []
    }

    return data || []
  },

  async getChatSession(id: string): Promise<ChatSession | null> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.from("chat_sessions").select("*").eq("id", id).single()

    if (error) {
      console.error("Error getting chat session:", error)
      return null
    }

    return data
  },

  async updateChatSession(id: string, title: string): Promise<void> {
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase
      .from("chat_sessions")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Error updating chat session:", error)
    }
  },

  async deleteChatSession(id: string): Promise<void> {
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.from("chat_sessions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting chat session:", error)
    }
  },

  // Chat Messages
  async saveChatMessages(sessionId: string, messages: Message[]): Promise<void> {
    const supabase = getSupabaseBrowserClient()

    // First, delete existing messages for this session
    const { error: deleteError } = await supabase.from("chat_messages").delete().eq("session_id", sessionId)

    if (deleteError) {
      console.error("Error deleting existing messages:", deleteError)
      return
    }

    // Then, insert the new messages
    const { error: insertError } = await supabase.from("chat_messages").insert(
      messages.map((message) => ({
        session_id: sessionId,
        role: message.role,
        content: message.content,
      })),
    )

    if (insertError) {
      console.error("Error saving chat messages:", insertError)
    }
  },

  async getChatMessages(sessionId: string): Promise<Message[]> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error getting chat messages:", error)
      return []
    }

    return (data || []).map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant" | "system",
      content: message.content,
    }))
  },

  // Project Files
  async saveProjectFile(sessionId: string, path: string, content: string): Promise<ProjectFile | null> {
    const supabase = getSupabaseBrowserClient()

    // Check if the file already exists
    const { data: existingFile } = await supabase
      .from("project_files")
      .select("*")
      .eq("session_id", sessionId)
      .eq("path", path)
      .single()

    if (existingFile) {
      // Update existing file
      const { data, error } = await supabase
        .from("project_files")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", existingFile.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating project file:", error)
        return null
      }

      return data
    } else {
      // Create new file
      const { data, error } = await supabase
        .from("project_files")
        .insert({ session_id: sessionId, path, content })
        .select()
        .single()

      if (error) {
        console.error("Error creating project file:", error)
        return null
      }

      return data
    }
  },

  async getProjectFiles(sessionId: string): Promise<ProjectFile[]> {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .eq("session_id", sessionId)
      .order("path", { ascending: true })

    if (error) {
      console.error("Error getting project files:", error)
      return []
    }

    return data || []
  },

  async deleteProjectFile(id: string): Promise<void> {
    const supabase = getSupabaseBrowserClient()

    const { error } = await supabase.from("project_files").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project file:", error)
    }
  },
}
