// app/api/dashboard/route.ts
import { db } from "@/db/database";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const now = Math.floor(Date.now() / 1000);

    const [totalMessages, sentMessages, failedMessages, apiKeys, currentUsage] =
        await Promise.all([
            db.execute({
                sql: "SELECT COUNT(*) as count FROM messages WHERE user_id = ?",
                args: [userId],
            }),
            db.execute({
                sql: "SELECT COUNT(*) as count FROM messages WHERE user_id = ? AND status = 'sent'",
                args: [userId],
            }),
            db.execute({
                sql: "SELECT COUNT(*) as count FROM messages WHERE user_id = ? AND status = 'failed'",
                args: [userId],
            }),
            db.execute({
                sql: "SELECT COUNT(*) as count FROM api_keys WHERE user_id = ?",
                args: [userId],
            }),
            db.execute({
                sql: "SELECT messages_sent FROM usage WHERE user_id = ? AND period_start <= ? AND period_end >= ?",
                args: [userId, now, now],
            }),
        ]);

    // Recent messages (last 7 days)
    const recentMessages = await db.execute({
        sql: `SELECT DATE(created_at, 'unixepoch') as date, COUNT(*) as count
              FROM messages
              WHERE user_id = ? AND created_at >= ?
              GROUP BY DATE(created_at, 'unixepoch')
              ORDER BY date ASC`,
        args: [userId, now - 7 * 24 * 60 * 60],
    });

    return Response.json({
        totalMessages: totalMessages.rows[0]?.count ?? 0,
        sentMessages: sentMessages.rows[0]?.count ?? 0,
        failedMessages: failedMessages.rows[0]?.count ?? 0,
        apiKeys: apiKeys.rows[0]?.count ?? 0,
        currentPeriodUsage: currentUsage.rows[0]?.messages_sent ?? 0,
        recentActivity: recentMessages.rows,
    });
}