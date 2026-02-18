// app/api/api-keys/[id]/route.ts
import { deleteApiKey } from "@/db/queries/api-keys";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await deleteApiKey(id, session.user.id);
    return Response.json({ success: true });
}