"use client"
// app/(dashboard)/users/page.tsx  (admin only)
import * as React from "react"
import {
    IconUsersGroup,
    IconSearch,
    IconShield,
    IconUser,
    IconTrash,
    IconChevronRight,
    IconMessage,
    IconKey,
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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"

interface User {
    id: string
    name: string
    email: string
    role: string
    created_at: number
    total_messages: number
    total_api_keys: number
}

interface UserDetail {
    user: User
    messages: { id: string; recipient: string; body: string; status: string; created_at: number }[]
    apiKeys: { id: string; name: string; last_used_at: number | null; created_at: number }[]
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

function formatDate(ts: number) {
    return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default function UsersPage() {
    const { data: session } = useSession()
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)
    const [search, setSearch] = React.useState("")
    const [selectedUser, setSelectedUser] = React.useState<UserDetail | null>(null)
    const [detailOpen, setDetailOpen] = React.useState(false)
    const [loadingDetail, setLoadingDetail] = React.useState(false)

    const fetchUsers = React.useCallback(() => {
        fetch("/api/users")
            .then((r) => r.json())
            .then((data) => {
                setUsers(data)
                setLoading(false)
            })
    }, [])

    React.useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const openUserDetail = async (userId: string) => {
        setDetailOpen(true)
        setLoadingDetail(true)
        try {
            const res = await fetch(`/api/users/${userId}`)
            const data = await res.json()
            setSelectedUser(data)
        } finally {
            setLoadingDetail(false)
        }
    }

    const updateRole = async (userId: string, role: string) => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            })
            toast.success("Role updated")
            fetchUsers()
            if (selectedUser?.user.id === userId) {
                setSelectedUser((prev) =>
                    prev ? { ...prev, user: { ...prev.user, role } } : null
                )
            }
        } catch {
            toast.error("Failed to update role")
        }
    }

    const deleteUser = async (userId: string) => {
        await fetch(`/api/users/${userId}`, { method: "DELETE" })
        setUsers((prev) => prev.filter((u) => u.id !== userId))
        setDetailOpen(false)
        toast.success("User deleted")
    }

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage all users and their roles.
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: users.length },
                    { label: "Admins", value: users.filter((u) => u.role === "admin").length },
                    {
                        label: "Total Messages",
                        value: users.reduce((acc, u) => acc + Number(u.total_messages), 0),
                    },
                    {
                        label: "Total API Keys",
                        value: users.reduce((acc, u) => acc + Number(u.total_api_keys), 0),
                    },
                ].map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="pt-4">
                            <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconUsersGroup className="h-4 w-4" />
                        All Users
                    </CardTitle>
                    <CardDescription>{filtered.length} user{filtered.length !== 1 ? "s" : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <IconUsersGroup className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No users found.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y">
                            {filtered.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 py-3 cursor-pointer hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors"
                                    onClick={() => openUserDetail(user.id)}
                                >
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className="text-xs">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm truncate">{user.name}</span>
                                            <Badge variant={user.role === "admin" ? "default" : "secondary"} className="flex items-center gap-1 shrink-0">
                                                {user.role === "admin" ? <IconShield className="h-3 w-3" /> : <IconUser className="h-3 w-3" />}
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>{user.email}</span>
                                            <span>·</span>
                                            <span className="flex items-center gap-1">
                                                <IconMessage className="h-3 w-3" />
                                                {Number(user.total_messages)} msgs
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <IconKey className="h-3 w-3" />
                                                {Number(user.total_api_keys)} keys
                                            </span>
                                        </div>
                                    </div>
                                    <IconChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Detail Dialog */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    {loadingDetail ? (
                        <div className="flex flex-col gap-4 py-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ) : selectedUser ? (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>
                                            {getInitials(selectedUser.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <DialogTitle>{selectedUser.user.name}</DialogTitle>
                                        <DialogDescription>{selectedUser.user.email}</DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="flex flex-col gap-4 mt-2">
                                {/* Role control */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Role</span>
                                    <Select
                                        value={selectedUser.user.role}
                                        onValueChange={(v: string) => updateRole(selectedUser.user.id, v)}
                                        disabled={selectedUser.user.id === session?.user?.id}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span>{formatDate(selectedUser.user.created_at)}</span>
                                </div>

                                {/* Recent Messages */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium flex items-center gap-1.5">
                                        <IconMessage className="h-3.5 w-3.5" />
                                        Recent Messages ({selectedUser.messages.length})
                                    </span>
                                    {selectedUser.messages.length === 0 ? (
                                        <p className="text-xs text-muted-foreground">No messages yet.</p>
                                    ) : (
                                        <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                                            {selectedUser.messages.map((msg) => (
                                                <div key={msg.id} className="flex items-center justify-between text-xs bg-muted rounded px-2 py-1.5">
                                                    <span className="font-medium">{msg.recipient}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground truncate max-w-25">{msg.body}</span>
                                                        <Badge variant={msg.status === "sent" ? "default" : msg.status === "failed" ? "destructive" : "secondary"} className="text-xs">
                                                            {msg.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* API Keys */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium flex items-center gap-1.5">
                                        <IconKey className="h-3.5 w-3.5" />
                                        API Keys ({selectedUser.apiKeys.length})
                                    </span>
                                    {selectedUser.apiKeys.length === 0 ? (
                                        <p className="text-xs text-muted-foreground">No API keys.</p>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            {selectedUser.apiKeys.map((key) => (
                                                <div key={key.id} className="flex items-center justify-between text-xs bg-muted rounded px-2 py-1.5">
                                                    <span className="font-medium">{key.name}</span>
                                                    <span className="text-muted-foreground">
                                                        Last used: {key.last_used_at ? formatDate(key.last_used_at) : "Never"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Danger zone */}
                                {selectedUser.user.id !== session?.user?.id && (
                                    <div className="border border-destructive/30 rounded-md p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-destructive">Delete User</p>
                                            <p className="text-xs text-muted-foreground">
                                                Permanently removes user and all their data.
                                            </p>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive">
                                                    <IconTrash className="h-3.5 w-3.5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete <strong>{selectedUser.user.name}</strong> and all their messages, API keys, and usage data.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        onClick={() => deleteUser(selectedUser.user.id)}
                                                    >
                                                        Delete Permanently
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    )
}