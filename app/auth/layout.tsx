import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fire SMS - Authentication",
    description: "Sign in or create an account to access Fire SMS",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Image (hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2 relative bg-muted">
                <div className="absolute inset-0 dark:bg-zinc-900/10 light:bg-white z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2070&q=80"
                    alt="Authentication"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 dark:bg-neutral-900">
                <div className="w-full max-w-md space-y-8">
                    {/* Fixed: Moved Fire SMS to top-left with proper styling */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Fire SMS
                        </h1>
                    </div>

                    {children}

                    {/* Optional footer with links
                    <p className="text-center text-sm text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </a>
                        .
                    </p> */}
                </div>
            </div>
        </div>
    );
}