"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sparkles, Zap, Cpu, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample AI models
const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Most powerful model for complex tasks",
    provider: "OpenAI",
    type: "premium",
    speed: "medium",
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "Advanced reasoning and code generation",
    provider: "Anthropic",
    type: "premium",
    speed: "medium",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and cost-effective for most tasks",
    provider: "OpenAI",
    type: "standard",
    speed: "fast",
  },
  {
    id: "llama-3",
    name: "Llama 3",
    description: "Open-source model with good performance",
    provider: "Meta",
    type: "standard",
    speed: "fast",
  },
]

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o")

  return (
    <Card>
      <CardContent className="p-4">
        <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-3">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <div
                className={`flex items-center space-x-2 rounded-md border p-3 transition-all ${
                  selectedModel === model.id ? "border-primary bg-primary/5" : ""
                }`}
              >
                <RadioGroupItem value={model.id} id={model.id} />
                <Label htmlFor={model.id} className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{model.name}</div>
                    <div className="flex items-center gap-2">
                      {model.type === "premium" && (
                        <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-blue-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {model.speed === "fast" && (
                        <Badge
                          variant="outline"
                          className="text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Fast
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{model.description}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Cpu className="h-3 w-3" />
                    <span>{model.provider}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                            <Info className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {model.provider} {model.name} - {model.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </Label>
              </div>
            </motion.div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
