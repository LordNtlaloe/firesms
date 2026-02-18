import { db } from "../database";

export async function getUsageByUser(userId: string) {
    const result = await db.execute({
        sql: "SELECT * FROM usage WHERE user_id = ? ORDER BY period_start DESC",
        args: [userId],
    });
    return result.rows;
}

export async function getCurrentPeriodUsage(userId: string) {
    const now = Math.floor(Date.now() / 1000);
    const result = await db.execute({
        sql: `SELECT * FROM usage 
              WHERE user_id = ? AND period_start <= ? AND period_end >= ?`,
        args: [userId, now, now],
    });
    return result.rows[0] ?? null;
}

export async function createUsagePeriod(data: {
    userId: string;
    periodStart: number;
    periodEnd: number;
}) {
    const id = crypto.randomUUID();
    await db.execute({
        sql: `INSERT INTO usage (id, user_id, messages_sent, period_start, period_end)
              VALUES (?, ?, 0, ?, ?)`,
        args: [id, data.userId, data.periodStart, data.periodEnd],
    });
    return id;
}

export async function incrementMessageCount(userId: string) {
    const now = Math.floor(Date.now() / 1000);
    await db.execute({
        sql: `UPDATE usage 
              SET messages_sent = messages_sent + 1 
              WHERE user_id = ? AND period_start <= ? AND period_end >= ?`,
        args: [userId, now, now],
    });
}