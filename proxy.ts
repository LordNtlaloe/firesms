import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    }) as Session | null;

    const { pathname } = request.nextUrl;

    const isPublicRoute = pathname.startsWith("/auth") || pathname === "/";

    const isProtectedRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/api-keys") ||
        pathname.startsWith("/billing") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/docs");

    const isAdminRoute =
        pathname.startsWith("/users") ||
        pathname.startsWith("/admin");

    if (isPublicRoute) {
        if (session && pathname.startsWith("/auth")) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    if (isAdminRoute) {
        if (!session) {
            return NextResponse.redirect(new URL("/auth/sign-in", request.url));
        }
        if (session.user.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    if (isProtectedRoute) {
        if (!session) {
            return NextResponse.redirect(new URL("/auth/sign-in", request.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api-keys/:path*",
        "/billing/:path*",
        "/profile/:path*",
        "/docs/:path*",
        "/users/:path*",
        "/admin/:path*",
        "/auth/:path*",
    ],
};