import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fire SMS - Docs",
    description: "How To Use Our Documentation",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex-1 overflow-hidden justify-center align-middle">
            {children}
        </div>
    )


}