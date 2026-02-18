"use client"
// app/(dashboard)/billing/page.tsx
import * as React from "react"
import {
    IconCreditCard,
    IconTrendingUp,
    IconCalendar,
    IconMessage,
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
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface UsagePeriod {
    id: string
    messages_sent: number
    period_start: number
    period_end: number
    created_at: number
}

interface BillingData {
    allUsage: UsagePeriod[]
    currentPeriod: UsagePeriod | null
}

const PLAN_LIMIT = 1000

function formatDate(ts: number) {
    return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function UsageBar({ used, limit }: { used: number; limit: number }) {
    const pct = Math.min((used / limit) * 100, 100)
    const color =
        pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-yellow-500" : "bg-primary"
    return (
        <div className="flex flex-col gap-1.5">
            <div className="w-full bg-muted rounded-full h-2.5">
                <div
                    className={`${color} h-2.5 rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{used.toLocaleString()} used</span>
                <span>{limit.toLocaleString()} limit</span>
            </div>
        </div>
    )
}

export default function BillingPage() {
    const [data, setData] = React.useState<BillingData | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [starting, setStarting] = React.useState(false)

    const fetchBilling = React.useCallback(() => {
        fetch("/api/billing")
            .then((r) => r.json())
            .then((d) => {
                setData(d)
                setLoading(false)
            })
    }, [])

    React.useEffect(() => {
        fetchBilling()
    }, [fetchBilling])

    const startNewPeriod = async () => {
        setStarting(true)
        try {
            const res = await fetch("/api/billing", { method: "POST" })
            if (!res.ok) throw new Error()
            toast.success("New billing period started")
            fetchBilling()
        } catch {
            toast.error("Failed to start new period")
        } finally {
            setStarting(false)
        }
    }

    const current = data?.currentPeriod
    const history = data?.allUsage?.filter((u) => u.id !== current?.id) ?? []
    const used = Number(current?.messages_sent ?? 0)
    const pct = Math.round((used / PLAN_LIMIT) * 100)

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Billing & Usage</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track your message usage and billing periods.
                    </p>
                </div>
            </div>

            {/* Current Period */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <IconCreditCard className="h-4 w-4" />
                                Current Period
                            </CardTitle>
                            <CardDescription>
                                {loading ? "Loading..." : current
                                    ? `${formatDate(current.period_start)} – ${formatDate(current.period_end)}`
                                    : "No active period"}
                            </CardDescription>
                        </div>
                        {!loading && !current && (
                            <Button onClick={startNewPeriod} disabled={starting} size="sm">
                                {starting ? "Starting..." : "Start Period"}
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-2.5 w-full" />
                        </div>
                    ) : current ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold">{used.toLocaleString()}</span>
                                <span className="text-muted-foreground mb-1 text-sm">
                                    / {PLAN_LIMIT.toLocaleString()} messages
                                </span>
                                <Badge
                                    variant={pct >= 90 ? "destructive" : pct >= 70 ? "secondary" : "outline"}
                                    className="mb-1"
                                >
                                    {pct}% used
                                </Badge>
                            </div>
                            <UsageBar used={used} limit={PLAN_LIMIT} />
                            {pct >= 90 && (
                                <p className="text-sm text-destructive font-medium">
                                    ⚠️ You're approaching your message limit.
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No active billing period. Start one to track usage.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Usage History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconTrendingUp className="h-4 w-4" />
                        Usage History
                    </CardTitle>
                    <CardDescription>Past billing periods</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <IconCalendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No billing history yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y">
                            {history.map((period) => {
                                const periodPct = Math.round(
                                    (Number(period.messages_sent) / PLAN_LIMIT) * 100
                                )
                                return (
                                    <div key={period.id} className="flex items-center justify-between py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium">
                                                {formatDate(period.period_start)} – {formatDate(period.period_end)}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <IconMessage className="h-3 w-3" />
                                                {Number(period.messages_sent).toLocaleString()} messages sent
                                            </div>
                                        </div>
                                        <Badge variant={periodPct >= 90 ? "destructive" : "secondary"}>
                                            {periodPct}%
                                        </Badge>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}