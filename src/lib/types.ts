export interface User {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
    created_at: string
    updated_at: string
  }
  
  export interface Project {
    id: string
    name: string
    description: string
    language: string
    user_id: string
    created_at: string
    updated_at: string
    is_public: boolean
    is_starred: boolean
    last_accessed: string
  }
  
  export interface CodeSnippet {
    id: string
    title: string
    code: string
    language: string
    project_id?: string
    user_id: string
    created_at: string
    updated_at: string
    description?: string
  }
  
  export interface AIModel {
    id: string
    name: string
    provider: string
    description: string
    type: "free" | "premium"
    max_tokens: number
    temperature_range: [number, number]
    default_temperature: number
    capabilities: string[]
    is_available: boolean
  }
  
  export interface UserSettings {
    id: string
    user_id: string
    theme: "light" | "dark" | "system"
    default_model_id: string
    default_language: string
    editor_font_size: number
    editor_tab_size: number
    editor_line_wrap: boolean
    notifications_enabled: boolean
  }
  
  export interface Activity {
    id: string
    user_id: string
    action_type: "create" | "update" | "delete" | "share" | "generate" | "star"
    resource_type: "project" | "snippet" | "model"
    resource_id: string
    resource_name: string
    created_at: string
    metadata?: Record<string, any>
  }
  
  export interface ApiKey {
    id: string
    user_id: string
    name: string
    key: string
    last_used?: string
    created_at: string
    expires_at?: string
  }
  
  export interface Subscription {
    id: string
    user_id: string
    plan: "free" | "pro" | "team" | "enterprise"
    status: "active" | "canceled" | "past_due"
    current_period_start: string
    current_period_end: string
    cancel_at_period_end: boolean
  }
  
  export interface Usage {
    user_id: string
    api_requests: number
    tokens_used: number
    period_start: string
    period_end: string
  }
  