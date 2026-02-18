"use client"
// app/(dashboard)/api-keys/page.tsx
import * as React from "react"
import {
    IconKey,
    IconPlus,
    IconTrash,
    IconCopy,
    IconCheck,
    IconEye,
    IconEyeOff,
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

interface ApiKey {
    id: string
    name: string
    last_used_at: number | null
    created_at: number
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = React.useState(false)
    const copy = () => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <Button size="icon" variant="ghost" onClick={copy}>
            {copied ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
        </Button>
    )
}

function NewKeyReveal({ rawKey }: { rawKey: string }) {
    const [visible, setVisible] = React.useState(false)
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
                Copy this key now — it won't be shown again.
            </p>
            <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2">
                <code className="flex-1 text-sm font-mono break-all">
                    {visible ? rawKey : "•".repeat(rawKey.length)}
                </code>
                <Button size="icon" variant="ghost" onClick={() => setVisible(!visible)}>
                    {visible ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                </Button>
                <CopyButton value={rawKey} />
            </div>
        </div>
    )
}

export default function ApiKeysPage() {
    const [keys, setKeys] = React.useState<ApiKey[]>([])
    const [loading, setLoading] = React.useState(true)
    const [creating, setCreating] = React.useState(false)
    const [newKeyName, setNewKeyName] = React.useState("")
    const [newRawKey, setNewRawKey] = React.useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    const fetchKeys = React.useCallback(() => {
        fetch("/api/api-keys")
            .then((r) => r.json())
            .then((data) => {
                setKeys(data)
                setLoading(false)
            })
    }, [])

    React.useEffect(() => {
        fetchKeys()
    }, [fetchKeys])

    const createKey = async () => {
        if (!newKeyName.trim()) return
        setCreating(true)
        try {
            const res = await fetch("/api/api-keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newKeyName }),
            })
            const data = await res.json()
            setNewRawKey(data.key)
            setNewKeyName("")
            fetchKeys()
        } catch {
            toast.error("Failed to create API key")
        } finally {
            setCreating(false)
        }
    }

    const deleteKey = async (id: string) => {
        await fetch(`/api/api-keys/${id}`, { method: "DELETE" })
        setKeys((prev) => prev.filter((k) => k.id !== id))
        toast.success("API key deleted")
    }

    const formatDate = (ts: number | null) => {
        if (!ts) return "Never"
        return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage keys for programmatic access to the Fire SMS API.
                    </p>
                </div>

                <Dialog
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open)
                        if (!open) setNewRawKey(null)
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <IconPlus className="h-4 w-4 mr-2" />
                            New Key
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {newRawKey ? "Key Created" : "Create API Key"}
                            </DialogTitle>
                            <DialogDescription>
                                {newRawKey
                                    ? "Store this key somewhere safe."
                                    : "Give this key a descriptive name."}
                            </DialogDescription>
                        </DialogHeader>

                        {newRawKey ? (
                            <NewKeyReveal rawKey={newRawKey} />
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="key-name">Key Name</Label>
                                <Input
                                    id="key-name"
                                    placeholder="e.g. Production, My App"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && createKey()}
                                />
                            </div>
                        )}

                        <DialogFooter>
                            {newRawKey ? (
                                <Button onClick={() => setDialogOpen(false)}>Done</Button>
                            ) : (
                                <Button onClick={createKey} disabled={creating || !newKeyName.trim()}>
                                    {creating ? "Creating..." : "Create"}
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconKey className="h-4 w-4" />
                        Your Keys
                    </CardTitle>
                    <CardDescription>
                        Keys are hashed and cannot be recovered. Delete and recreate if lost.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : keys.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <IconKey className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No API keys yet. Create one to get started.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y">
                            {keys.map((key) => (
                                <div
                                    key={key.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium text-sm">{key.name}</span>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>Created {formatDate(key.created_at)}</span>
                                            <span>·</span>
                                            <span>Last used {formatDate(key.last_used_at)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            ••••••••
                                        </Badge>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                                                    <IconTrash className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Any apps using <strong>{key.name}</strong> will stop working immediately.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        onClick={() => deleteKey(key.id)}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}