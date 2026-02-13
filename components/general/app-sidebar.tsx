"use client"
import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    IconDashboard,
    IconKey,
    IconCreditCard,
    IconUser,
    IconFileText,
    IconInnerShadowTop,
} from "@tabler/icons-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { NavUser } from "./nav-user"
import { useSession } from "@/lib/auth-client"

// Simplified navigation items
const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "API Keys",
            url: "/dashboard/api-keys",
            icon: IconKey,
        },
        {
            title: "Account Billing",
            url: "/dashboard/billing",
            icon: IconCreditCard,
        },
        {
            title: "Profile",
            url: "/dashboard/profile",
            icon: IconUser,
        },
        {
            title: "Documentation",
            url: "/dashboard/docs",
            icon: IconFileText,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { theme } = useTheme()
    const pathname = usePathname()
    const { data: session } = useSession()

    // Check if a nav item is active
    const isActive = (url: string) => {
        return pathname === url || pathname?.startsWith(url + "/")
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                            size="lg"
                        >
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <IconInnerShadowTop className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Fire SMS </span>
                                    <span className="truncate text-xs text-sidebar-foreground/60">
                                        {session?.user?.name}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            
            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                        asChild 
                                        tooltip={item.title}
                                        isActive={isActive(item.url)}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}