"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Boxes } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { useRegisterMutation } from "@/store/api/authApi";

export default function RegisterPage() {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await registerUser(data).unwrap();
            toast.success("Account created successfully!");
            router.push("/login");
        } catch (err: unknown) {
            const error = err as { data?: Record<string, string | string[]> };
            if (error?.data) {
                const firstKey = Object.keys(error.data)[0];
                const message = Array.isArray(error.data[firstKey])
                    ? error.data[firstKey][0]
                    : error.data[firstKey];
                toast.error(typeof message === "string" ? message : "Registration failed");
            } else {
                toast.error("Registration failed");
            }
        }
    };

    const inputClassName =
        "w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900";

    const errorInputClassName =
        "w-full px-4 py-3 rounded-xl border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-slate-900";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] relative p-4">
            {/* Register Card */}
            <div className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col items-center">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Boxes className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">
                        LogicCheck AI
                    </span>
                </div>

                {/* Header */}
                <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                    Create your account
                </h1>
                <p className="text-sm text-slate-500 mb-8 text-center">
                    Join hundreds of founders using AI to build smarter.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
                    {/* Name Row */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label
                                htmlFor="first_name"
                                className="text-sm font-semibold text-slate-700 mb-1.5 block"
                            >
                                First Name
                            </label>
                            <input
                                id="first_name"
                                type="text"
                                placeholder="John"
                                {...register("first_name")}
                                className={errors.first_name ? errorInputClassName : inputClassName}
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.first_name.message}
                                </p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label
                                htmlFor="last_name"
                                className="text-sm font-semibold text-slate-700 mb-1.5 block"
                            >
                                Last Name
                            </label>
                            <input
                                id="last_name"
                                type="text"
                                placeholder="Doe"
                                {...register("last_name")}
                                className={errors.last_name ? errorInputClassName : inputClassName}
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.last_name.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="text-sm font-semibold text-slate-700 mb-1.5 block"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Choose a unique username"
                            {...register("username")}
                            className={errors.username ? errorInputClassName : inputClassName}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-slate-700 mb-1.5 block"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            {...register("email")}
                            className={errors.email ? errorInputClassName : inputClassName}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-slate-700 mb-1.5 block"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Min. 8 characters"
                            {...register("password")}
                            className={errors.password ? errorInputClassName : inputClassName}
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
                        className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Log In
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
