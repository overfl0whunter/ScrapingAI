"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

// Sample activity data
const initialActivities = [
  {
    id: "1",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    action: "created a new project",
    target: "Web Scraper",
    time: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SM",
    },
    action: "updated code in",
    target: "React Dashboard",
    time: "4 hours ago",
  },
  {
    id: "3",
    user: {
      name: "David Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "DC",
    },
    action: "generated new code with",
    target: "GPT-4o",
    time: "Yesterday",
  },
  {
    id: "4",
    user: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EW",
    },
    action: "shared a project",
    target: "API Gateway",
    time: "Yesterday",
  },
  {
    id: "5",
    user: {
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YO",
    },
    action: "starred a project",
    target: "Web Scraper",
    time: "3 days ago",
  },
]

// Additional activities that will be added when refreshing
const newActivities = [
  {
    id: "6",
    user: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    action: "commented on",
    target: "Data Visualization",
    time: "Just now",
  },
  {
    id: "7",
    user: {
      name: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YO",
    },
    action: "generated new code with",
    target: "Claude 3",
    time: "Just now",
  },
]

export function ActivityFeed() {
  const [activities, setActivities] = useState(initialActivities)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshActivities = () => {
    setIsRefreshing(true)

    // Simulate API call delay
    setTimeout(() => {
      setActivities([...newActivities, ...activities].slice(0, 5))
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Recent Activity</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refreshActivities} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                    <span className="font-medium text-primary">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
