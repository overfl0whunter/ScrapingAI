import { AlertCircle, CheckCircle2 } from "lucide-react"

interface AuthMessageProps {
  type: "error" | "success"
  message: string
}

export function AuthMessage({ type, message }: AuthMessageProps) {
  if (!message) return null

  return (
    <div
      className={`flex items-center p-3 rounded-md text-sm ${
        type === "error"
          ? "bg-red-50 text-red-800 border border-red-200"
          : "bg-green-50 text-green-800 border border-green-200"
      }`}
    >
      {type === "error" ? (
        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
      ) : (
        <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
      )}
      <span>{message}</span>
    </div>
  )
}
