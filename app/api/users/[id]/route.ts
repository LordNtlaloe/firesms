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
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const [userResult, messagesResult, keysResult, txResult] = await Promise.all([
        db.execute({
            sql: "SELECT id, name, email, role, createdAt FROM user WHERE id = ?",
            args: [id],
        }),
        db.execute({
            sql: "SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
            args: [id],
        }),
        db.execute({
            sql: "SELECT id, name, last_used_at, created_at FROM api_keys WHERE user_id = ?",
            args: [id],
        }),
        db.execute({
            sql: "SELECT id, credits, amount, payment_mode, transaction_date, created_at FROM credit_transactions WHERE user_id = ? ORDER BY transaction_date DESC",
            args: [id],
        }),
    ]);

    if (!userResult.rows[0]) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    const totalPurchased = txResult.rows.reduce((sum, tx) => sum + Number(tx.credits), 0);
    const totalUsed = messagesResult.rows.filter((m) => m.status === "sent").length;

    return Response.json({
        user: userResult.rows[0],
        credits: {
            total_purchased: totalPurchased,
            total_used: totalUsed,
            remaining: totalPurchased - totalUsed,
        },
        creditTransactions: txResult.rows,
        messages: messagesResult.rows,
        apiKeys: keysResult.rows,
    });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const { role } = await request.json();
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
        return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    if (id === session.user.id && role !== "admin") {
        return Response.json({ error: "Cannot demote yourself" }, { status: 400 });
    }

    await db.execute({
        sql: "UPDATE user SET role = ? WHERE id = ?",
        args: [role, id],
    });

    return Response.json({ success: true });
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await requireAdmin();
    if (!session) return Response.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    if (id === session.user.id) {
        return Response.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    await db.execute({
        sql: "DELETE FROM user WHERE id = ?",
        args: [id],
    });

    return Response.json({ success: true });
}