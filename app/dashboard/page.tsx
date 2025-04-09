import { Suspense } from "react"
import { Header } from "@/components/ui/header"
import { ProjectList } from "@/components/dashboard/project-list"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ModelSelector } from "@/components/dashboard/model-selector"
import { CodeSamples } from "@/components/dashboard/code-samples"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <section>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back</h1>
            <p className="text-muted-foreground">Continue working on your projects or start something new.</p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
                <Suspense fallback={<ProjectListSkeleton />}>
                  <ProjectList />
                </Suspense>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Code Samples</h2>
                <Suspense fallback={<CodeSamplesSkeleton />}>
                  <CodeSamples />
                </Suspense>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">AI Models</h2>
                <Suspense fallback={<ModelSelectorSkeleton />}>
                  <ModelSelector />
                </Suspense>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <Suspense fallback={<ActivityFeedSkeleton />}>
                  <ActivityFeed />
                </Suspense>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ))}
    </div>
  )
}

function CodeSamplesSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="h-[300px] w-full" />
    </div>
  )
}

function ModelSelectorSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

function ActivityFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
    </div>
  )
}
