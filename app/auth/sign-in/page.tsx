"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginFormValues) {
        setIsLoading(true);
        try {
            await signIn.email({
                email: values.email,
                password: values.password,
            });

            toast.success("Welcome back!", {
                description: "You've been logged in successfully.",
            });

            router.push("/dashboard");
        } catch (error: any) {
            toast.error("Authentication failed", {
                description: error?.message || "Invalid email or password",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="dark:bg-neutral-900 border-0 shadow-neutral-700">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold tracking-tight dark:text-neutral-200 border-0">
                    Sign In
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Enter your email and password to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="name@example.com"
                                            type="email"
                                            disabled={isLoading}
                                            className="dark:bg-neutral-900 dark:border-neutral-800 border-neutral-100"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500"/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            type="password"
                                            disabled={isLoading}
                                            className="dark:bg-neutral-900 dark:border-neutral-800 border-neutral-100"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-slate-900 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-6">
                <div className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        href="/auth/sign-up"
                        className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                    >
                        Sign up
                    </Link>
                </div>
                <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                    Forgot password?
                </Link>
            </CardFooter>
        </Card>
    );
}