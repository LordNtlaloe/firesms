"use client"
// app/(dashboard)/users/page.tsx  (admin only)
import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconUsersGroup,
    IconSearch,
    IconShield,
    IconUser,
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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface User {
    id: string
    name: string
    email: string
    role: string
    createdAt: number
    total_messages: number
    total_api_keys: number
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export default function UsersPage() {
    const router = useRouter()
    const [users, setUsers] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)
    const [search, setSearch] = React.useState("")

    React.useEffect(() => {
        fetch("/api/users")
            .then((r) => r.json())
            .then((data) => {
                setUsers(data)
                setLoading(false)
            })
    }, [])

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
                    <CardDescription>
                        {filtered.length} user{filtered.length !== 1 ? "s" : ""}
                    </CardDescription>
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
                                    onClick={() => router.push(`/users/${user.id}`)}
                                >
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className="text-xs">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm truncate">{user.name}</span>
                                            <Badge
                                                variant={user.role === "admin" ? "default" : "secondary"}
                                                className="flex items-center gap-1 shrink-0"
                                            >
                                                {user.role === "admin" ? (
                                                    <IconShield className="h-3 w-3" />
                                                ) : (
                                                    <IconUser className="h-3 w-3" />
                                                )}
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
        </div>
    )
}