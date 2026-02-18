// app/api/api-keys/[id]/route.ts
import { deleteApiKey } from "@/db/queries/api-keys";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await deleteApiKey(params.id, session.user.id);
    return Response.json({ success: true });
}
