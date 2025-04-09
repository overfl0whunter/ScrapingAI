"use client"

import { FolderIcon, FileIcon } from "lucide-react"
import type { ProjectFile } from "@/types/database-types"

interface FileExplorerProps {
  files: ProjectFile[]
  selectedFile: ProjectFile | null
  onSelectFile: (file: ProjectFile) => void
}

export default function FileExplorer({ files, selectedFile, onSelectFile }: FileExplorerProps) {
  // Group files by directory
  const fileStructure: Record<string, ProjectFile[]> = {}

  files.forEach((file) => {
    const parts = file.path.split("/")
    const fileName = parts.pop() || ""
    const directory = parts.join("/") || "root"

    if (!fileStructure[directory]) {
      fileStructure[directory] = []
    }

    fileStructure[directory].push({
      ...file,
      path: file.path, // Keep the full path
    })
  })

  // Sort directories
  const sortedDirectories = Object.keys(fileStructure).sort((a, b) => {
    if (a === "root") return -1
    if (b === "root") return 1
    return a.localeCompare(b)
  })

  return (
    <div className="h-full">
      <div className="p-3 border-b">
        <h3 className="font-medium">Project Files</h3>
      </div>

      <div className="p-2">
        {files.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No files in this project</p>
        ) : (
          sortedDirectories.map((directory) => (
            <div key={directory} className="mb-3">
              {directory !== "root" && (
                <div className="flex items-center text-sm font-medium text-gray-500 mb-1 pl-2">
                  <FolderIcon className="h-4 w-4 mr-1" />
                  {directory}
                </div>
              )}

              <div className="space-y-1 pl-2">
                {fileStructure[directory].map((file) => {
                  // Extract just the filename from the path
                  const fileName = file.path.split("/").pop() || file.path

                  return (
                    <div
                      key={file.id}
                      className={`flex items-center p-2 rounded text-sm cursor-pointer hover:bg-gray-100 ${
                        selectedFile?.id === file.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => onSelectFile(file)}
                    >
                      <FileIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="truncate">{fileName}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
