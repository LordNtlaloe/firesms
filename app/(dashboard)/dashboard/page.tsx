"use client"
// app/(dashboard)/dashboard/page.tsx
import * as React from "react"
import { useSession } from "@/lib/auth-client"
import {
  IconMessage,
  IconSend,
  IconAlertCircle,
  IconKey,
  IconTrendingUp,
  IconActivity,
} from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStats {
  totalMessages: number
  sentMessages: number
  failedMessages: number
  apiKeys: number
  currentPeriodUsage: number
  recentActivity: { date: string; count: number }[]
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
  badge,
}: {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  loading: boolean
  badge?: { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-muted-foreground">{description}</p>
          {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityBar({
  date,
  count,
  max,
}: {
  date: string
  count: number
  max: number
}) {
  const height = max > 0 ? (count / max) * 100 : 0
  const label = new Date(date).toLocaleDateString("en-US", { weekday: "short" })

  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-xs text-muted-foreground">{count}</span>
      <div className="w-full bg-muted rounded-sm flex items-end" style={{ height: 60 }}>
        <div
          className="w-full bg-primary rounded-sm transition-all duration-500"
          style={{ height: `${height}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = React.useState<DashboardStats | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const maxActivity = stats
    ? Math.max(...stats.recentActivity.map((a) => Number(a.count)), 1)
    : 1

  const successRate =
    stats && Number(stats.totalMessages) > 0
      ? Math.round((Number(stats.sentMessages) / Number(stats.totalMessages)) * 100)
      : 0

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening with your SMS account.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Messages"
          value={Number(stats?.totalMessages ?? 0)}
          description="All time"
          icon={IconMessage}
          loading={loading}
        />
        <StatCard
          title="Sent"
          value={Number(stats?.sentMessages ?? 0)}
          description={`${successRate}% success rate`}
          icon={IconSend}
          loading={loading}
          badge={{ label: `${successRate}%`, variant: successRate > 90 ? "default" : "secondary" }}
        />
        <StatCard
          title="Failed"
          value={Number(stats?.failedMessages ?? 0)}
          description="Delivery failures"
          icon={IconAlertCircle}
          loading={loading}
        />
        <StatCard
          title="API Keys"
          value={Number(stats?.apiKeys ?? 0)}
          description="Active keys"
          icon={IconKey}
          loading={loading}
        />
      </div>

      {/* Activity + Usage */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconActivity className="h-4 w-4" />
              Last 7 Days
            </CardTitle>
            <CardDescription>Messages sent per day</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex gap-2 items-end h-20">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="flex-1 h-full rounded-sm" />
                ))}
              </div>
            ) : stats?.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No messages yet this week.
              </p>
            ) : (
              <div className="flex gap-2 items-end">
                {stats?.recentActivity.map((a) => (
                  <ActivityBar
                    key={a.date}
                    date={a.date}
                    count={Number(a.count)}
                    max={maxActivity}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage This Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTrendingUp className="h-4 w-4" />
              Current Period Usage
            </CardTitle>
            <CardDescription>Messages sent this billing cycle</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex flex-col gap-3">
                <span className="text-4xl font-bold">
                  {Number(stats?.currentPeriodUsage ?? 0).toLocaleString()}
                </span>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        (Number(stats?.currentPeriodUsage ?? 0) / 1000) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  of 1,000 message limit
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}