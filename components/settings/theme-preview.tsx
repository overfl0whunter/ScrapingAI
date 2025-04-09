"use client"

interface ThemePreviewProps {
  colorScheme: string
}

export default function ThemePreview({ colorScheme }: ThemePreviewProps) {
  const getColorClasses = (scheme: string) => {
    switch (scheme) {
      case "purple":
        return {
          light: "bg-purple-100",
          medium: "bg-purple-500",
          dark: "bg-purple-800",
        }
      case "green":
        return {
          light: "bg-green-100",
          medium: "bg-green-500",
          dark: "bg-green-800",
        }
      case "orange":
        return {
          light: "bg-orange-100",
          medium: "bg-orange-500",
          dark: "bg-orange-800",
        }
      default: // Default blue
        return {
          light: "bg-blue-100",
          medium: "bg-blue-500",
          dark: "bg-blue-800",
        }
    }
  }

  const colors = getColorClasses(colorScheme)

  return (
    <div className="flex space-x-1 mt-1">
      <div className={`w-8 h-4 rounded ${colors.light}`}></div>
      <div className={`w-8 h-4 rounded ${colors.medium}`}></div>
      <div className={`w-8 h-4 rounded ${colors.dark}`}></div>
    </div>
  )
}
