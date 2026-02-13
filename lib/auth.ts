import { betterAuth } from "better-auth";
import { Kysely } from "kysely";
import { LibsqlDialect } from "@libsql/kysely-libsql";

const db = new Kysely({
    dialect: new LibsqlDialect({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    }),
});

export const auth = betterAuth({
    database: {
        provider: "sqlite",
        db: db,
        type: "sqlite",
    },
    emailAndPassword: {
        enabled: true,
    },
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL!,
});