"use client"

import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Code, MessageSquare, FileText, GitBranch } from "lucide-react"

interface ActivityFeedProps {
  activities: any[]
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-500">No activity to display yet.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </Card>
  )
}

function ActivityItem({ activity }: { activity: any }) {
  // Determine icon based on activity type
  const getActivityIcon = () => {
    switch (activity.type) {
      case "code":
        return <Code className="h-5 w-5 text-blue-500" />
      case "comment":
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case "document":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "project":
        return <GitBranch className="h-5 w-5 text-orange-500" />
      default:
        return <Code className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">{getActivityIcon()}</div>
      <div className="flex-1">
        <p className="font-medium">{activity.title}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{activity.description}</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
