"use client"
// app/(dashboard)/messages/page.tsx (add to sidebar as well if needed)
// -- OR use this as app/(dashboard)/dashboard/messages/page.tsx
import * as React from "react"
import {
    IconMessage,
    IconPlus,
    IconTrash,
    IconSend,
    IconAlertCircle,
    IconClock,
    IconSearch,
} from "@tabler/icons-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Message {
    id: string
    recipient: string
    body: string
    status: "pending" | "sent" | "failed"
    created_at: number
}

const statusConfig = {
    sent: { label: "Sent", variant: "default" as const, icon: IconSend },
    pending: { label: "Pending", variant: "secondary" as const, icon: IconClock },
    failed: { label: "Failed", variant: "destructive" as const, icon: IconAlertCircle },
}

function StatusBadge({ status }: { status: Message["status"] }) {
    const cfg = statusConfig[status]
    return (
        <Badge variant={cfg.variant} className="flex items-center gap-1 w-fit">
            <cfg.icon className="h-3 w-3" />
            {cfg.label}
        </Badge>
    )
}

export default function MessagesPage() {
    const [messages, setMessages] = React.useState<Message[]>([])
    const [loading, setLoading] = React.useState(true)
    const [search, setSearch] = React.useState("")
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [sending, setSending] = React.useState(false)
    const [form, setForm] = React.useState({ recipient: "", body: "" })

    const fetchMessages = React.useCallback(() => {
        fetch("/api/messages")
            .then((r) => r.json())
            .then((data) => {
                setMessages(data)
                setLoading(false)
            })
    }, [])

    React.useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    const sendMessage = async () => {
        if (!form.recipient.trim() || !form.body.trim()) return
        setSending(true)
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error()
            toast.success("Message queued successfully")
            setForm({ recipient: "", body: "" })
            setDialogOpen(false)
            fetchMessages()
        } catch {
            toast.error("Failed to send message")
        } finally {
            setSending(false)
        }
    }

    const deleteMessage = async (id: string) => {
        await fetch(`/api/messages/${id}`, { method: "DELETE" })
        setMessages((prev) => prev.filter((m) => m.id !== id))
        toast.success("Message deleted")
    }

    const filtered = messages.filter(
        (m) =>
            m.recipient.toLowerCase().includes(search.toLowerCase()) ||
            m.body.toLowerCase().includes(search.toLowerCase())
    )

    const formatDate = (ts: number) =>
        new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        View and manage all your SMS messages.
                    </p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <IconPlus className="h-4 w-4 mr-2" />
                            New Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send SMS</DialogTitle>
                            <DialogDescription>
                                Send an SMS to a phone number.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="recipient">Recipient</Label>
                                <Input
                                    id="recipient"
                                    placeholder="+27821234567"
                                    value={form.recipient}
                                    onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="body">Message</Label>
                                <Textarea
                                    id="body"
                                    placeholder="Type your message..."
                                    rows={4}
                                    value={form.body}
                                    onChange={(e: { target: { value: any } }) => setForm({ ...form, body: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {form.body.length}/160 characters
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={sendMessage}
                                disabled={sending || !form.recipient.trim() || !form.body.trim()}
                            >
                                <IconSend className="h-4 w-4 mr-2" />
                                {sending ? "Sending..." : "Send Message"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by recipient or message..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconMessage className="h-4 w-4" />
                        All Messages
                    </CardTitle>
                    <CardDescription>
                        {filtered.length} message{filtered.length !== 1 ? "s" : ""}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <IconMessage className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No messages found.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y">
                            {filtered.map((msg) => (
                                <div key={msg.id} className="flex items-start justify-between py-3 gap-4">
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{msg.recipient}</span>
                                            <StatusBadge status={msg.status} />
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{msg.body}</p>
                                        <p className="text-xs text-muted-foreground">{formatDate(msg.created_at)}</p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive shrink-0">
                                                <IconTrash className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete this message record.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    onClick={() => deleteMessage(msg.id)}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}