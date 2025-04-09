"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Star, Clock, ArrowRight, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - in a real app, this would come from your database
const projects = [
  {
    id: "1",
    title: "Web Scraper",
    description: "A Python-based web scraper for extracting data from e-commerce sites",
    language: "Python",
    lastUpdated: "2 hours ago",
    starred: true,
  },
  {
    id: "2",
    title: "React Dashboard",
    description: "Admin dashboard with charts and data visualization components",
    language: "TypeScript",
    lastUpdated: "1 day ago",
    starred: false,
  },
  {
    id: "3",
    title: "API Gateway",
    description: "Serverless API gateway with authentication and rate limiting",
    language: "JavaScript",
    lastUpdated: "3 days ago",
    starred: true,
  },
]

export function ProjectList() {
  const [starredProjects, setStarredProjects] = useState(
    projects.reduce(
      (acc, project) => {
        acc[project.id] = project.starred
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )

  const toggleStar = (id: string) => {
    setStarredProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                      {project.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete Project</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs font-normal">
                  {project.language}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{project.lastUpdated}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button variant="ghost" size="sm" className="gap-1 h-8 px-2" onClick={() => toggleStar(project.id)}>
                <Star className={`h-4 w-4 ${starredProjects[project.id] ? "fill-yellow-400 text-yellow-400" : ""}`} />
                <span>{starredProjects[project.id] ? "Starred" : "Star"}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 h-8" asChild>
                <Link href={`/projects/${project.id}`}>
                  <span>Open Project</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: projects.length * 0.1 }}
      >
        <Card className="border-dashed">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Create a new project</h3>
            <p className="text-muted-foreground mb-4">Start from scratch or use a template</p>
            <Button>Create Project</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
