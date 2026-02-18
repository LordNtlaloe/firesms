// app/api/messages/[id]/route.ts
import { getMessageById, updateMessageStatus, deleteMessage } from "@/db/queries/message";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const message = await getMessageById(id);
    if (!message) return Response.json({ error: "Not found" }, { status: 404 });

    if (message.user_id !== session.user.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(message);
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const message = await getMessageById(id);
    if (!message) return Response.json({ error: "Not found" }, { status: 404 });
    if (message.user_id !== session.user.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await request.json();
    const validStatuses = ["pending", "sent", "failed"];
    if (!validStatuses.includes(status)) {
        return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    await updateMessageStatus(id, status);
    return Response.json({ success: true });
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await deleteMessage(id, session.user.id);
    return Response.json({ success: true });
}