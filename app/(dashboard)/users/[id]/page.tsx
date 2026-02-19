"use client"
// app/(dashboard)/users/[id]/page.tsx  (admin only)
import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
    IconArrowLeft,
    IconShield,
    IconUser,
    IconTrash,
    IconMessage,
    IconKey,
    IconCreditCard,
    IconPlus,
    IconCalendar,
    IconCoin,
    IconCash,
    IconDeviceMobile,
    IconReceipt,
    IconTrendingUp,
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
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"

interface UserDetail {
    user: {
        id: string
        name: string
        email: string
        role: string
        createdAt: number
    }
    credits: {
        total_purchased: number
        total_used: number
        remaining: number
    }
    creditTransactions: {
        id: string
        credits: number
        amount: number
        payment_mode: string
        transaction_date: string
        created_at: number
    }[]
    messages: {
        id: string
        recipient: string
        body: string
        status: string
        created_at: number
    }[]
    apiKeys: {
        id: string
        name: string
        last_used_at: number | null
        created_at: number
    }[]
}

interface CreditForm {
    credits: string
    amount: string
    paymentMode: string
    transactionDate: string
}

const PAYMENT_MODES = ["Cash", "Card", "Bank Transfer", "Mobile Money", "Cheque", "Other"]

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

function formatDateStr(str: string) {
    return new Date(str).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { data: session } = useSession()

    const [data, setData] = React.useState<UserDetail | null>(null)
    const [loading, setLoading] = React.useState(true)

    const [creditsOpen, setCreditsOpen] = React.useState(false)
    const [creditForm, setCreditForm] = React.useState<CreditForm>({
        credits: "",
        amount: "",
        paymentMode: "",
        transactionDate: new Date().toISOString().split("T")[0],
    })
    const [submittingCredits, setSubmittingCredits] = React.useState(false)

    const fetchUser = React.useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/users/${id}`)
            const json = await res.json()
            setData(json)
        } finally {
            setLoading(false)
        }
    }, [id])

    React.useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const updateRole = async (role: string) => {
        try {
            await fetch(`/api/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            })
            toast.success("Role updated")
            setData((prev) => prev ? { ...prev, user: { ...prev.user, role } } : null)
        } catch {
            toast.error("Failed to update role")
        }
    }

    const deleteUser = async () => {
        await fetch(`/api/users/${id}`, { method: "DELETE" })
        toast.success("User deleted")
        router.push("/users")
    }

    const openCreditsForm = () => {
        setCreditForm({
            credits: "",
            amount: "",
            paymentMode: "",
            transactionDate: new Date().toISOString().split("T")[0],
        })
        setCreditsOpen(true)
    }

    const handleAddCredits = async () => {
        if (!creditForm.credits || !creditForm.amount || !creditForm.paymentMode || !creditForm.transactionDate) {
            toast.error("Please fill in all fields")
            return
        }
        setSubmittingCredits(true)
        try {
            await fetch(`/api/users/${id}/credits`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    credits: Number(creditForm.credits),
                    amount: Number(creditForm.amount),
                    paymentMode: creditForm.paymentMode,
                    transactionDate: creditForm.transactionDate,
                }),
            })
            toast.success(`${Number(creditForm.credits).toLocaleString()} SMS credits added`)
            setCreditsOpen(false)
            fetchUser()
        } catch {
            toast.error("Failed to add credits")
        } finally {
            setSubmittingCredits(false)
        }
    }

    const isSelf = data?.user.id === session?.user?.id

    if (loading) {
        return (
            <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
                <Skeleton className="h-8 w-32" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
                </div>
                <Skeleton className="h-48 rounded-xl" />
            </div>
        )
    }

    if (!data) return null

    const { user, credits, creditTransactions, messages, apiKeys } = data
    const usedPct = credits.total_purchased > 0
        ? Math.round((credits.total_used / credits.total_purchased) * 100)
        : 0

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">

            {/* Back button */}
            <Button
                variant="ghost"
                size="sm"
                className="w-fit -ml-2 gap-1.5 text-muted-foreground"
                onClick={() => router.push("/users")}
            >
                <IconArrowLeft className="h-4 w-4" />
                All Users
            </Button>

            {/* Profile header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg font-semibold">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"} className="flex items-center gap-1">
                                {user.role === "admin" ? <IconShield className="h-3 w-3" /> : <IconUser className="h-3 w-3" />}
                                {user.role}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Joined {formatDate(user.createdAt)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Role switcher */}
                    {!isSelf && (
                        <Select value={user.role} onValueChange={updateRole}>
                            <SelectTrigger className="w-32 h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    )}

                    <Button size="sm" className="gap-1.5 bg-neutral-700" onClick={openCreditsForm}>
                        <IconPlus className="h-3.5 w-3.5" />
                        Add Credits
                    </Button>

                    {!isSelf && (
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
                                        This will permanently delete <strong>{user.name}</strong> and all their messages, API keys, and usage data. This cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={deleteUser}
                                    >
                                        Delete Permanently
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>

            {/* Credit summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Total Purchased</p>
                            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-3xl font-bold">{credits.total_purchased.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">SMS credits</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Credits Used</p>
                            <IconMessage className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-3xl font-bold">{credits.total_used.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{usedPct}% of total</p>
                    </CardContent>
                </Card>

                <Card className={credits.remaining < 50 && credits.total_purchased > 0 ? "border-orange-400/60" : ""}>
                    <CardContent className="pt-5">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-muted-foreground">Credits Remaining</p>
                            <IconCoin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className={`text-3xl font-bold ${credits.remaining < 50 && credits.total_purchased > 0 ? "text-orange-500" : ""}`}>
                            {credits.remaining.toLocaleString()}
                        </p>
                        {credits.remaining < 50 && credits.total_purchased > 0 && (
                            <p className="text-xs text-orange-500 mt-0.5 font-medium">Low balance</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Usage bar */}
            {credits.total_purchased > 0 && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Usage</span>
                        <span>{credits.total_used.toLocaleString()} / {credits.total_purchased.toLocaleString()} SMS</span>
                    </div>
                    <Progress value={usedPct} className="h-2" />
                </div>
            )}

            {/* Credit transaction history */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <IconReceipt className="h-4 w-4" />
                        Credit Transactions
                    </CardTitle>
                    <CardDescription>{creditTransactions.length} transaction{creditTransactions.length !== 1 ? "s" : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                    {creditTransactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <IconCreditCard className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No credit transactions yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Credits</TableHead>
                                    <TableHead className="text-right">Amount Paid</TableHead>
                                    <TableHead>Payment Mode</TableHead>
                                    <TableHead className="text-right">Cost/SMS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {creditTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="text-sm">{formatDateStr(tx.transaction_date)}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            +{tx.credits.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right">R{Number(tx.amount).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {tx.payment_mode}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground text-xs">
                                            R{(tx.amount / tx.credits).toFixed(4)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Messages */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <IconMessage className="h-4 w-4" />
                            Recent Messages
                        </CardTitle>
                        <CardDescription>{messages.length} message{messages.length !== 1 ? "s" : ""}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {messages.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">No messages yet.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="flex items-start justify-between gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
                                        <div className="min-w-0">
                                            <p className="font-medium text-xs">{msg.recipient}</p>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.body}</p>
                                        </div>
                                        <Badge
                                            variant={msg.status === "sent" ? "default" : msg.status === "failed" ? "destructive" : "secondary"}
                                            className="text-xs shrink-0"
                                        >
                                            {msg.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* API Keys */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <IconKey className="h-4 w-4" />
                            API Keys
                        </CardTitle>
                        <CardDescription>{apiKeys.length} key{apiKeys.length !== 1 ? "s" : ""}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {apiKeys.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">No API keys.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {apiKeys.map((key) => (
                                    <div key={key.id} className="flex items-center justify-between text-sm bg-muted/50 rounded-lg px-3 py-2">
                                        <span className="font-medium text-xs">{key.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {key.last_used_at ? `Used ${formatDate(key.last_used_at)}` : "Never used"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Add Credits Dialog ── */}
            <Dialog open={creditsOpen} onOpenChange={setCreditsOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <IconCreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Add Credits</DialogTitle>
                                <DialogDescription className="text-xs">
                                    Top up SMS credits for {user.name}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-1">

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="credits" className="flex items-center gap-1.5 text-sm">
                                <IconDeviceMobile className="h-3.5 w-3.5 text-muted-foreground" />
                                Credits Loaded
                                <span className="text-muted-foreground font-normal text-xs">(SMS units)</span>
                            </Label>
                            <Input
                                id="credits"
                                type="number"
                                min={1}
                                placeholder="e.g. 500"
                                value={creditForm.credits}
                                onChange={(e) => setCreditForm((p) => ({ ...p, credits: e.target.value }))}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="amount" className="flex items-center gap-1.5 text-sm">
                                <IconCash className="h-3.5 w-3.5 text-muted-foreground" />
                                Cash Amount Paid
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">R</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-7"
                                    value={creditForm.amount}
                                    onChange={(e) => setCreditForm((p) => ({ ...p, amount: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="flex items-center gap-1.5 text-sm">
                                <IconCoin className="h-3.5 w-3.5 text-muted-foreground" />
                                Mode of Payment
                            </Label>
                            <Select
                                value={creditForm.paymentMode}
                                onValueChange={(v) => setCreditForm((p) => ({ ...p, paymentMode: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_MODES.map((mode) => (
                                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="txDate" className="flex items-center gap-1.5 text-sm">
                                <IconCalendar className="h-3.5 w-3.5 text-muted-foreground" />
                                Transaction Date
                            </Label>
                            <Input
                                id="txDate"
                                type="date"
                                value={creditForm.transactionDate}
                                onChange={(e) => setCreditForm((p) => ({ ...p, transactionDate: e.target.value }))}
                            />
                        </div>

                        {creditForm.credits && creditForm.amount && Number(creditForm.credits) > 0 && (
                            <div className="bg-muted/60 rounded-lg px-3 py-2.5 text-xs text-muted-foreground flex items-center justify-between">
                                <span>
                                    <span className="font-semibold text-foreground">{Number(creditForm.credits).toLocaleString()} SMS</span>
                                    {" "}for{" "}
                                    <span className="font-semibold text-foreground">R{Number(creditForm.amount).toFixed(2)}</span>
                                </span>
                                <span className="font-medium text-foreground">
                                    R{(Number(creditForm.amount) / Number(creditForm.credits)).toFixed(4)}/SMS
                                </span>
                            </div>
                        )}

                        <div className="flex gap-2 pt-1">
                            <Button variant="outline" className="flex-1" onClick={() => setCreditsOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1 gap-1.5" onClick={handleAddCredits} disabled={submittingCredits}>
                                <IconPlus className="h-3.5 w-3.5" />
                                {submittingCredits ? "Adding..." : "Add Credits"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}