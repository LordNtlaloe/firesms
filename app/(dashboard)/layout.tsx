"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/general/app-sidebar"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/auth/sign-in")
        }
    }, [session, isPending, router])

    if (isPending) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
                <div className="flex items-center gap-2 p-4 border-b">
                    <SidebarTrigger />
                    <div className="ml-auto flex items-center gap-4">
                    </div>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}