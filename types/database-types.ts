export interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: string
  content: string
  created_at: string
  user_id: string
}

export interface ProjectFile {
  id: string
  session_id: string
  path: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
}
