import { db } from "../database";

export type MessageStatus = "pending" | "sent" | "failed";

export async function getMessagesByUser(userId: string) {
    const result = await db.execute({
        sql: "SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC",
        args: [userId],
    });
    return result.rows;
}

export async function getMessageById(id: string) {
    const result = await db.execute({
        sql: "SELECT * FROM messages WHERE id = ?",
        args: [id],
    });
    return result.rows[0] ?? null;
}

export async function createMessage(data: {
    userId: string;
    recipient: string;
    body: string;
}) {
    const id = crypto.randomUUID();
    await db.execute({
        sql: `INSERT INTO messages (id, user_id, recipient, body, status)
              VALUES (?, ?, ?, ?, 'pending')`,
        args: [id, data.userId, data.recipient, data.body],
    });
    return id;
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
    await db.execute({
        sql: `UPDATE messages 
              SET status = ?, updated_at = unixepoch() 
              WHERE id = ?`,
        args: [status, id],
    });
}

export async function deleteMessage(id: string, userId: string) {
    await db.execute({
        sql: "DELETE FROM messages WHERE id = ? AND user_id = ?",
        args: [id, userId],
    });
}