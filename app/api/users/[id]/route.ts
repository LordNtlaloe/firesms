// app/api/users/[id]/route.ts  (admin only)
import { db } from "@/db/database";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    if (session.user.role !== "admin") return null;
    return session;
}

export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const [user, messages, keys] = await Promise.all([
        db.execute({
            sql: "SELECT id, name, email, role, created_at FROM user WHERE id = ?",
            args: [params.id],
        }),
        db.execute({
            sql: "SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
            args: [params.id],
        }),
        db.execute({
            sql: "SELECT id, name, last_used_at, created_at FROM api_keys WHERE user_id = ?",
            args: [params.id],
        }),
    ]);

    if (!user.rows[0]) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({
        user: user.rows[0],
        messages: messages.rows,
        apiKeys: keys.rows,
    });
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const { role } = await request.json();
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
        return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    // Prevent admin from demoting themselves
    if (params.id === session.user.id && role !== "admin") {
        return Response.json({ error: "Cannot demote yourself" }, { status: 400 });
    }

    await db.execute({
        sql: "UPDATE user SET role = ? WHERE id = ?",
        args: [role, params.id],
    });

    return Response.json({ success: true });
}

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    if (params.id === session.user.id) {
        return Response.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    // Cascade deletes messages and api_keys via FK constraints
    await db.execute({
        sql: "DELETE FROM user WHERE id = ?",
        args: [params.id],
    });

    return Response.json({ success: true });
}