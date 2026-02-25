"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FileText, Sparkles } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Link from "next/link";
import { ideaSchema, type IdeaFormValues } from "@/lib/validations/idea";
import {
    useGetRecentIdeasQuery,
    useCreateIdeaAnalysisMutation,
} from "@/store/api/ideasApi";

function getScoreColor(score: number) {
    if (score >= 90) return { border: "border-blue-500", text: "text-blue-600" };
    if (score >= 80) return { border: "border-green-500", text: "text-green-600" };
    if (score >= 60) return { border: "border-orange-500", text: "text-orange-600" };
    return { border: "border-red-500", text: "text-red-600" };
}

export default function DashboardPage() {
    const router = useRouter();
    const { data, isLoading } = useGetRecentIdeasQuery();
    const [createIdea, { isLoading: isAnalyzing }] = useCreateIdeaAnalysisMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IdeaFormValues>({
        resolver: zodResolver(ideaSchema),
    });

    const onSubmit = async (data: IdeaFormValues) => {
        try {
            const response = await createIdea(data).unwrap();
            toast.success("Analysis complete!");
            router.push(`/dashboard/my-ideas/${response.id}`);
        } catch (err: unknown) {
            const error = err as { data?: Record<string, string | string[]> };
            if (error?.data) {
                const firstKey = Object.keys(error.data)[0];
                const message = Array.isArray(error.data[firstKey])
                    ? error.data[firstKey][0]
                    : error.data[firstKey];
                toast.error(typeof message === "string" ? message : "Analysis failed");
            } else {
                toast.error("Analysis failed. Please try again.");
            }
        }
    };

    /* ─── Loading / Analyzing Screen ─── */
    if (isAnalyzing) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 md:p-14 max-w-lg w-full flex flex-col items-center text-center">
                    {/* Spinning icon */}
                    <div className="mb-6">
                        <Sparkles className="w-12 h-12 text-blue-500 animate-spin" style={{ animationDuration: "3s" }} />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Analyzing your startup idea...
                    </h2>
                    <p className="text-sm text-slate-400 animate-pulse mb-8">
                        Scraping real-time market data and competitors...
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                        <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{
                                animation: "progressFill 20s ease-out forwards",
                            }}
                        />
                    </div>

                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-6">
                        This usually takes about 15-20 seconds.
                    </p>

                    {/* Bouncing dots */}
                    <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                </div>

                {/* Keyframes for progress bar */}
                <style jsx>{`
                    @keyframes progressFill {
                        0% { width: 0%; }
                        30% { width: 55%; }
                        60% { width: 75%; }
                        80% { width: 88%; }
                        100% { width: 95%; }
                    }
                `}</style>
            </div>
        );
    }

    /* ─── Main Dashboard ─── */
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Idea Hub
                </h1>
                <p className="text-slate-500 mt-1">
                    Transform your intuition into data-driven decisions.
                </p>
            </div>

            {/* New Idea Card */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-8"
            >
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Ready to test your next big idea?
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                    Our AI will analyze market trends, competition, and potential pitfalls in seconds.
                </p>

                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="ideaTitle"
                            className="text-sm font-semibold text-slate-700 mb-1.5 block"
                        >
                            Idea Title
                        </label>
                        <input
                            id="ideaTitle"
                            type="text"
                            placeholder="e.g., AI-Powered CRM for Exotic Pet Sitters"
                            {...register("title")}
                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-slate-900 ${errors.title
                                ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                : "border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="ideaDescription"
                            className="text-sm font-semibold text-slate-700 mb-1.5 block"
                        >
                            Idea Description
                        </label>
                        <textarea
                            id="ideaDescription"
                            rows={4}
                            placeholder="Describe the problem you're solving, the target audience, and how your solution works..."
                            {...register("description")}
                            className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-slate-900 resize-none ${errors.description
                                ? "border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                : "border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isAnalyzing}
                            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl px-6 py-3 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <Sparkles className="w-4 h-4" />
                            Start Analyzing
                        </button>
                    </div>
                </div>
            </form>

            {/* Recent Validations */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        Recent Validations
                    </h2>
                    <Link
                        href="/dashboard/my-ideas"
                        className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        View All
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-slate-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 bg-slate-200 rounded-full w-48" />
                                    <div className="h-2.5 bg-slate-100 rounded-full w-32" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-200" />
                            </div>
                        ))}
                    </div>
                ) : data?.results && data.results.length > 0 ? (
                    <div className="space-y-3">
                        {data.results.map((idea) => {
                            const score = idea.score || 0;
                            const scoreColor = getScoreColor(score);
                            return (
                                <div
                                    key={idea.id}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <FileText className="w-4.5 h-4.5 text-blue-500" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">
                                            {idea.title}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {format(new Date(idea.created_at), "MMM dd, yyyy")}
                                        </p>
                                    </div>

                                    {/* Score Badge */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                                            Score
                                        </span>
                                        <div
                                            className={`w-10 h-10 rounded-full border-2 ${scoreColor.border} flex items-center justify-center`}
                                        >
                                            <span className={`text-sm font-bold ${scoreColor.text}`}>
                                                {score}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 text-center py-8">
                        No validations yet. Start by analyzing your first idea above!
                    </p>
                )}
            </div>
        </div>
    );
}
