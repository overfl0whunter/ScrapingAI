"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [models, setModels] = useState<{ value: string; label: string; provider: string }[]>([])
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchModels = async () => {
      const { data, error } = await supabase.from("ai_models").select("*").order("name", { ascending: true })

      if (!error && data) {
        setModels(
          data.map((model) => ({
            value: model.model_id,
            label: model.name,
            provider: model.provider,
          })),
        )
      }
    }

    fetchModels()
  }, [supabase])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedModel
            ? models.find((model) => model.value === selectedModel)?.label || selectedModel
            : "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={(currentValue) => {
                    onModelChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedModel === model.value ? "opacity-100" : "opacity-0")} />
                  <span>{model.label}</span>
                  <span className="ml-auto text-xs text-gray-500">{model.provider}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
