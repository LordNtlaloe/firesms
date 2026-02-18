import { db } from "../database";

export async function getApiKeysByUser(userId: string) {
    const result = await db.execute({
        sql: "SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC",
        args: [userId],
    });
    return result.rows;
}

export async function getApiKeyById(id: string) {
    const result = await db.execute({
        sql: "SELECT * FROM api_keys WHERE id = ?",
        args: [id],
    });
    return result.rows[0] ?? null;
}

export async function createApiKey(data: {
    userId: string;
    name: string;
    keyHash: string;
    expiresAt?: number;
}) {
    const id = crypto.randomUUID();
    await db.execute({
        sql: `INSERT INTO api_keys (id, user_id, name, key_hash, expires_at)
              VALUES (?, ?, ?, ?, ?)`,
        args: [id, data.userId, data.name, data.keyHash, data.expiresAt ?? null],
    });
    return id;
}

export async function updateApiKeyLastUsed(id: string) {
    await db.execute({
        sql: "UPDATE api_keys SET last_used_at = unixepoch() WHERE id = ?",
        args: [id],
    });
}

export async function deleteApiKey(id: string, userId: string) {
    // userId check prevents users deleting keys that aren't theirs
    await db.execute({
        sql: "DELETE FROM api_keys WHERE id = ? AND user_id = ?",
        args: [id, userId],
    });
}