"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, UserMinus, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface UserDiscoveryProps {
  users: any[]
  followingIds: Set<string>
  currentUserId: string
}

export default function UserDiscovery({ users, followingIds, currentUserId }: UserDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [following, setFollowing] = useState<Set<string>>(followingIds)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const supabase = getSupabaseBrowserClient()

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim().toLowerCase()
    const query = searchQuery.toLowerCase()
    return (
      user.username?.toLowerCase().includes(query) ||
      fullName.includes(query) ||
      user.bio?.toLowerCase().includes(query)
    )
  })

  const handleFollow = async (userId: string) => {
    setIsLoading((prev) => ({ ...prev, [userId]: true }))

    try {
      if (following.has(userId)) {
        // Unfollow
        const { error } = await supabase
          .from("user_follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", userId)

        if (error) throw error

        setFollowing((prev) => {
          const newFollowing = new Set(prev)
          newFollowing.delete(userId)
          return newFollowing
        })
      } else {
        // Follow
        const { error } = await supabase.from("user_follows").insert({
          follower_id: currentUserId,
          following_id: userId,
        })

        if (error) throw error

        setFollowing((prev) => new Set([...prev, userId]))
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Discover Users</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username, name, or bio"
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-8">No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.user_id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url} alt={user.username} />
                      <AvatarFallback>
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <Button
                    variant={following.has(user.user_id) ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFollow(user.user_id)}
                    disabled={isLoading[user.user_id]}
                    className="flex items-center gap-1"
                  >
                    {following.has(user.user_id) ? (
                      <>
                        <UserMinus className="h-4 w-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
                {user.bio && <p className="mt-4 text-sm text-gray-600">{user.bio}</p>}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
