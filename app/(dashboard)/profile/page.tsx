"use client"
// app/(dashboard)/profile/page.tsx
import * as React from "react"
import { useSession, signOut } from "@/lib/auth-client"
import {
    IconUser,
    IconMail,
    IconShield,
    IconLogout,
    IconPencil,
    IconCheck,
    IconX,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function ProfilePage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [editingName, setEditingName] = React.useState(false)
    const [nameValue, setNameValue] = React.useState("")

    React.useEffect(() => {
        if (session?.user?.name) {
            setNameValue(session.user.name)
        }
    }, [session])

    const saveName = async () => {
        // Wire up to your user update endpoint or better-auth's update user
        try {
            await fetch("/api/auth/update-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nameValue }),
            })
            toast.success("Name updated")
            setEditingName(false)
        } catch {
            toast.error("Failed to update name")
        }
    }

    const handleSignOut = async () => {
        await signOut()
        router.push("/auth/sign-in")
    }

    const user = session?.user

    return (
        <div className="flex flex-col gap-6 p-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage your account details.
                </p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IconUser className="h-4 w-4" />
                        Account Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg">
                                {user?.name ? getInitials(user.name) : "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold text-lg">{user?.name}</span>
                            <Badge
                                variant={user?.role === "admin" ? "default" : "secondary"}
                                className="flex items-center gap-1 w-fit"
                            >
                                <IconShield className="h-3 w-3" />
                                {user?.role ?? "user"}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Name field */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Display Name</Label>
                        <div className="flex gap-2">
                            {editingName ? (
                                <>
                                    <Input
                                        id="name"
                                        value={nameValue}
                                        onChange={(e) => setNameValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && saveName()}
                                        autoFocus
                                    />
                                    <Button size="icon" variant="ghost" onClick={saveName}>
                                        <IconCheck className="h-4 w-4 text-green-500" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                            setEditingName(false)
                                            setNameValue(user?.name ?? "")
                                        }}
                                    >
                                        <IconX className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Input id="name" value={user?.name ?? ""} readOnly className="bg-muted" />
                                    <Button size="icon" variant="ghost" onClick={() => setEditingName(true)}>
                                        <IconPencil className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Email field (read-only) */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="flex items-center gap-1.5">
                            <IconMail className="h-3.5 w-3.5" />
                            Email
                        </Label>
                        <Input id="email" value={user?.email ?? ""} readOnly className="bg-muted" />
                        <p className="text-xs text-muted-foreground">
                            Email cannot be changed here. Contact support if needed.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Actions here cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Sign Out</p>
                            <p className="text-xs text-muted-foreground">
                                You'll be redirected to the sign-in page.
                            </p>
                        </div>
                        <Button variant="destructive" onClick={handleSignOut}>
                            <IconLogout className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}