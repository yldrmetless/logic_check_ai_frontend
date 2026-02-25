"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Boxes } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials, logout } from "@/store/features/authSlice";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();

    // Clear any stale tokens on mount to prevent login blocks
    useEffect(() => {
        dispatch(logout());
    }, [dispatch]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        // Failsafe: ensure clean slate before login request
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expirationTimestamp");
        try {
            const response = await login(data).unwrap();
            dispatch(setCredentials(response));
            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (err: unknown) {
            const error = err as { data?: { detail?: string } };
            toast.error(error?.data?.detail || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] relative p-4">
            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col items-center">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Boxes className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">
                        LogicCheck AI
                    </span>
                </div>

                {/* Header */}
                <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                    Log in to your account
                </h1>
                <p className="text-sm text-slate-500 mb-8 text-center">
                    Enter your credentials to access the dashboard
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                    {/* Email / Username */}
                    <div>
                        <label
                            htmlFor="identifier"
                            className="text-sm font-semibold text-slate-700 mb-1.5 block"
                        >
                            Email or Username
                        </label>
                        <input
                            id="identifier"
                            type="text"
                            placeholder="name@company.com"
                            {...register("username_or_email")}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900"
                        />
                        {errors.username_or_email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.username_or_email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-slate-700"
                            >
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-blue-500 hover:underline font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 text-lg tracking-widest"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Page Footer */}
            <p className="absolute bottom-8 text-center w-full text-xs text-slate-400">
                © 2026 LogicCheck AI. All rights reserved.
            </p>
        </div>
    );
}
