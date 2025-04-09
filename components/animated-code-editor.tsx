"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Check, Copy, Terminal, Code, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedCodeEditorProps {
  code: string
  language: string
  title?: string
  animationSpeed?: number
  theme?: "dark" | "light"
  onCodeChange?: (code: string) => void
  readOnly?: boolean
  showLineNumbers?: boolean
  showControls?: boolean
}

export function AnimatedCodeEditor({
  code,
  language,
  title = "Code Editor",
  animationSpeed = 30,
  theme = "dark",
  onCodeChange,
  readOnly = false,
  showLineNumbers = true,
  showControls = true,
}: AnimatedCodeEditorProps) {
  const [displayedCode, setDisplayedCode] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [currentTab, setCurrentTab] = useState<"code" | "preview">("code")
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Animation effect
  useEffect(() => {
    if (!code || isAnimating) return

    setIsAnimating(true)
    setDisplayedCode("")

    let index = 0
    const interval = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode((prev) => prev + code.charAt(index))
        index++
      } else {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, animationSpeed)

    return () => clearInterval(interval)
  }, [code, animationSpeed])

  // Handle code changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setDisplayedCode(newCode)
    onCodeChange?.(newCode)
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayedCode)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Reset animation
  const resetAnimation = () => {
    setIsAnimating(false)
    setDisplayedCode("")
    setTimeout(() => {
      setIsAnimating(true)
    }, 100)
  }

  // Format line numbers
  const lineNumbers = displayedCode.split("\n").map((_, i) => i + 1)

  return (
    <Card
      className={cn(
        "overflow-hidden border rounded-lg shadow-lg transition-all duration-200",
        theme === "dark" ? "bg-zinc-900 text-zinc-100" : "bg-white text-zinc-800",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 border-b",
          theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-zinc-100 border-zinc-200",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium ml-2">{title}</span>
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as "code" | "preview")}>
              <TabsList className="h-8">
                <TabsTrigger value="code" className="h-7 px-2 text-xs">
                  <Code className="h-3.5 w-3.5 mr-1" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="preview" className="h-7 px-2 text-xs">
                  <Play className="h-3.5 w-3.5 mr-1" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetAnimation} disabled={isAnimating}>
              <Terminal className="h-3.5 w-3.5" />
            </Button>

            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyToClipboard}>
              {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        <TabsContent value="code" className="mt-0">
          <div className="relative font-mono text-sm">
            <div
              className={cn(
                "overflow-auto p-4 min-h-[200px] max-h-[600px]",
                theme === "dark" ? "bg-zinc-900" : "bg-white",
              )}
              ref={editorRef}
            >
              <div className="flex">
                {showLineNumbers && (
                  <div
                    className={cn("select-none pr-4 text-right", theme === "dark" ? "text-zinc-600" : "text-zinc-400")}
                  >
                    {lineNumbers.map((num) => (
                      <div key={num} className="h-6">
                        {num}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex-1 overflow-hidden">
                  <div className="relative">
                    <pre className="h-full">
                      <code className={`language-${language}`}>{displayedCode}</code>
                    </pre>

                    {!readOnly && (
                      <textarea
                        ref={textareaRef}
                        value={displayedCode}
                        onChange={handleCodeChange}
                        className={cn(
                          "absolute top-0 left-0 w-full h-full font-mono resize-none outline-none border-0 p-0 bg-transparent",
                          theme === "dark" ? "text-zinc-100 caret-zinc-100" : "text-zinc-800 caret-zinc-800",
                        )}
                        spellCheck="false"
                      />
                    )}
                  </div>
                </div>
              </div>

              {isAnimating && (
                <div
                  className={cn(
                    "absolute bottom-4 right-4 px-2 py-1 rounded text-xs",
                    theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-zinc-200 text-zinc-700",
                  )}
                >
                  Typing...
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div
            className={cn(
              "min-h-[200px] max-h-[600px] overflow-auto p-4",
              theme === "dark" ? "bg-zinc-900" : "bg-white",
            )}
          >
            <iframe
              srcDoc={`
                <html>
                  <head>
                    <style>
                      body {
                        font-family: system-ui, sans-serif;
                        margin: 0;
                        padding: 0;
                        ${theme === "dark" ? "background: #18181b; color: #f4f4f5;" : "background: white; color: #27272a;"}
                      }
                    </style>
                  </head>
                  <body>
                    ${language === "html" ? displayedCode : ""}
                    ${language === "javascript" ? `<script>${displayedCode}</script>` : ""}
                  </body>
                </html>
              `}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts"
            />
          </div>
        </TabsContent>
      </div>
    </Card>
  )
}
