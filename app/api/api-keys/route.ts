// app/api/api-keys/route.ts
import { getApiKeysByUser, createApiKey } from "@/db/queries/api-keys";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const keys = await getApiKeysByUser(session.user.id);
    return Response.json(keys);
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await request.json();

    // Generate a real key and store only its hash
    const rawKey = crypto.randomUUID();
    const keyHash = await hashKey(rawKey);

    const id = await createApiKey({
        userId: session.user.id,
        name,
        keyHash,
    });

    // Return the raw key ONCE — you can't recover it later
    return Response.json({ id, key: rawKey });
}

async function hashKey(key: string) {
    const buffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(key)
    );
    return Buffer.from(buffer).toString("hex");
}