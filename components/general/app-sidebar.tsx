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
    IconUsersGroup,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { theme } = useTheme()
    const pathname = usePathname()
    const { data: session } = useSession()

    // Check if a nav item is active
    const isActive = (url: string) => {
        return pathname === url || pathname?.startsWith(url + "/")
    }

    // Filter navigation items based on user role
    const getNavItems = () => {
        const baseItems = [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: IconDashboard,
            },
            {
                title: "API Keys",
                url: "/api-keys",
                icon: IconKey,
            },
            {
                title: "Account Billing",
                url: "/billing",
                icon: IconCreditCard,
            },
            {
                title: "Profile",
                url: "/profile",
                icon: IconUser,
            },
            {
                title: "Documentation",
                url: "/docs",
                icon: IconFileText,
            },
        ];

        // Add Users item only for admin users
        if (session?.user?.role === "admin") {
            return [
                ...baseItems.slice(0, 1),
                {
                    title: "Users",
                    url: "/users",
                    icon: IconUsersGroup,
                },
                ...baseItems.slice(1)
            ];
        }

        return baseItems;
    };

    const navItems = getNavItems();

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
                            {navItems.map((item) => (
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