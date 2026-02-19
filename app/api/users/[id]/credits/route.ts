// app/api/users/[id]/credits/route.ts
import { db } from "@/db/database"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { randomUUID } from "crypto"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || session.user.role !== "admin")
        return Response.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await params   // ← await here
    const { credits, amount, paymentMode, transactionDate } = await req.json()

    await db.execute({
        sql: `INSERT INTO credit_transactions (id, user_id, credits, amount, payment_mode, transaction_date)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [randomUUID(), id, credits, amount, paymentMode, transactionDate],
    })

    return Response.json({ ok: true })
}