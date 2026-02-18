// app/api/billing/route.ts
import { getUsageByUser, getCurrentPeriodUsage, createUsagePeriod } from "@/db/queries/useage";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const [allUsage, currentPeriod] = await Promise.all([
        getUsageByUser(session.user.id),
        getCurrentPeriodUsage(session.user.id),
    ]);

    return Response.json({ allUsage, currentPeriod });
}

// Called to start a new billing period
export async function POST() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const now = Math.floor(Date.now() / 1000);
    const periodStart = now;
    const periodEnd = now + 30 * 24 * 60 * 60; // 30 days

    const id = await createUsagePeriod({
        userId: session.user.id,
        periodStart,
        periodEnd,
    });

    return Response.json({ id }, { status: 201 });
}