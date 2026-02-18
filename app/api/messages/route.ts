// app/api/messages/route.ts
import { getMessagesByUser, createMessage } from "@/db/queries/message";
import { incrementMessageCount } from "@/db/queries/useage";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const messages = await getMessagesByUser(session.user.id);
    return Response.json(messages);
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { recipient, body } = await request.json();

    if (!recipient || !body) {
        return Response.json({ error: "recipient and body are required" }, { status: 400 });
    }

    const id = await createMessage({
        userId: session.user.id,
        recipient,
        body,
    });

    // Track usage
    await incrementMessageCount(session.user.id);

    return Response.json({ id }, { status: 201 });
}