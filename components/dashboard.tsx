"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SessionList from "@/components/session-list"
import FileExplorer from "@/components/file-explorer"
import FileEditor from "@/components/file-editor"
import ChatContainer from "@/components/chat-container"
import { Button } from "@/components/ui/button"
import { PlusCircle, LogOut, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { ChatSession, ChatMessage, ProjectFile } from "@/types/database-types"

interface DashboardProps {
  initialSessions: ChatSession[]
  userId: string
}

export default function Dashboard({ initialSessions, userId }: DashboardProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions)
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    initialSessions.length > 0 ? initialSessions[0] : null,
  )
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (selectedSession) {
      loadSessionData(selectedSession.id)
    }
  }, [selectedSession])

  const loadSessionData = async (sessionId: string) => {
    setLoading(true)

    // Fetch messages
    const { data: messagesData } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    // Fetch files
    const { data: filesData } = await supabase
      .from("project_files")
      .select("*")
      .eq("session_id", sessionId)
      .order("path", { ascending: true })

    setMessages(messagesData || [])
    setFiles(filesData || [])
    setSelectedFile(filesData && filesData.length > 0 ? filesData[0] : null)
    setLoading(false)
  }

  const handleCreateSession = async () => {
    const title = `New Session ${new Date().toLocaleString()}`

    const { data: newSession, error } = await supabase
      .from("chat_sessions")
      .insert({ title, user_id: userId })
      .select()
      .single()

    if (error) {
      console.error("Error creating session:", error)
      return
    }

    setSessions([newSession, ...sessions])
    setSelectedSession(newSession)
    setMessages([])
    setFiles([])
    setSelectedFile(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file)
  }

  const handleFileUpdate = async (fileId: string, content: string) => {
    if (!selectedFile) return

    const { error } = await supabase
      .from("project_files")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", fileId)

    if (error) {
      console.error("Error updating file:", error)
      return
    }

    // Update local state
    setFiles(
      files.map((file) => (file.id === fileId ? { ...file, content, updated_at: new Date().toISOString() } : file)),
    )

    // Also update selected file if it's the one being edited
    if (selectedFile.id === fileId) {
      setSelectedFile({ ...selectedFile, content, updated_at: new Date().toISOString() })
    }
  }

  const handleMessageAdded = (message: ChatMessage) => {
    setMessages([...messages, message])

    // Also update the session's updated_at time
    if (selectedSession) {
      const updatedSession = {
        ...selectedSession,
        updated_at: new Date().toISOString(),
      }

      // Update in database
      supabase
        .from("chat_sessions")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedSession.id)
        .then(() => {
          // Update local state
          setSessions(
            sessions
              .map((s) => (s.id === selectedSession.id ? updatedSession : s))
              .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
          )
          setSelectedSession(updatedSession)
        })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Code Assistant Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={handleCreateSession} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Session
          </Button>
          <Link href="/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 flex-grow">
        <div className="col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <SessionList sessions={sessions} selectedSession={selectedSession} onSelectSession={setSelectedSession} />
        </div>

        <div className="col-span-3 bg-white rounded-lg shadow overflow-hidden">
          {selectedSession ? (
            <Tabs defaultValue="chat" className="h-full flex flex-col">
              <div className="px-4 pt-4 border-b">
                <TabsList>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chat" className="flex-grow p-4 overflow-auto">
                {selectedSession ? (
                  <ChatContainer sessionId={selectedSession.id} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Seleziona una sessione o creane una nuova</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="files" className="flex-grow grid grid-cols-2 gap-4 p-4">
                <div className="overflow-auto border rounded-lg">
                  <FileExplorer files={files} selectedFile={selectedFile} onSelectFile={handleFileSelect} />
                </div>
                <div className="overflow-hidden border rounded-lg">
                  <FileEditor file={selectedFile} onUpdateFile={handleFileUpdate} />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a session or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
