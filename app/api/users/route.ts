// app/api/users/route.ts  (admin only — protected by middleware)
import { db } from "@/db/database";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    if (session.user.role !== "admin") return null;
    return session;
}

export async function GET() {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const result = await db.execute({
        sql: `SELECT 
                u.id,
                u.name,
                u.email,
                u.role,
                u.created_at,
                COUNT(DISTINCT m.id) as total_messages,
                COUNT(DISTINCT k.id) as total_api_keys
              FROM user u
              LEFT JOIN messages m ON m.user_id = u.id
              LEFT JOIN api_keys k ON k.user_id = u.id
              GROUP BY u.id
              ORDER BY u.created_at DESC`,
        args: [],
    });

    return Response.json(result.rows);
}