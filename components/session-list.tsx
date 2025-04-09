"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ChatSession } from "@/types/database-types"

interface SessionListProps {
  sessions: ChatSession[]
  selectedSession: ChatSession | null
  onSelectSession: (session: ChatSession) => void
}

export default function SessionList({ sessions, selectedSession, onSelectSession }: SessionListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Your Sessions</h2>
      </div>
      <div className="flex-grow overflow-auto p-2">
        {sessions.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No sessions found</p>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.id}
              className={`mb-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedSession?.id === session.id ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={() => onSelectSession(session)}
            >
              <CardContent className="p-3">
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-xs text-gray-500">{new Date(session.updated_at).toLocaleString()}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
