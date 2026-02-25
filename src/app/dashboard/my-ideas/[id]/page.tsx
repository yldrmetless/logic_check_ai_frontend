"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import {
    ArrowLeft,
    Trash2,
    Shield,
    Globe,
    ExternalLink,
    CheckCircle,
    BarChart3,
    FileText,
    Sparkles,
    ChevronDown,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { useGetIdeaByIdQuery, useGenerateBusinessPlanMutation, useDeleteIdeaMutation, useUpdateReportStepsMutation } from "@/store/api/ideasApi";
import toast from "react-hot-toast";

/* ─── StatusDropdown Component ─── */
interface StatusDropdownProps {
    initialStatus: string;
    onStatusChange?: (status: string) => void;
}

function StatusDropdown({ initialStatus, onStatusChange }: StatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(
        initialStatus?.toLowerCase() || "pending"
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (status: string) => {
        setCurrentStatus(status);
        setIsOpen(false);
        onStatusChange?.(status);
    };

    const isComplete = currentStatus === "success";

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider cursor-pointer hover:opacity-80 transition-opacity ${isComplete
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                    }`}
            >
                {currentStatus.toUpperCase()}
                <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                    <button
                        type="button"
                        onClick={() => handleSelect("pending")}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold tracking-wider cursor-pointer transition-colors ${currentStatus === "pending"
                            ? "bg-slate-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        PENDING
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSelect("success")}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold tracking-wider cursor-pointer transition-colors ${currentStatus === "success"
                            ? "bg-green-50 text-green-700"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        SUCCESS
                    </button>
                </div>
            )}
        </div>
    );
}

function getScoreBg(score: number) {
    if (score >= 90) return "from-blue-500 to-blue-600";
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-orange-400 to-orange-500";
    return "from-red-500 to-red-600";
}

function getScoreLabel(score: number) {
    if (score >= 90) return "Exceptional Potential";
    if (score >= 80) return "Strong Market Potential";
    if (score >= 60) return "Moderate Potential";
    return "Needs Improvement";
}

/* ─── StepRow Component ─── */
function StepRow({ step, onStatusChange }: { step: { task: string; status: string }, onStatusChange?: (status: string) => void }) {
    const [isComplete, setIsComplete] = useState(
        step.status?.toLowerCase() === "success"
    );

    useEffect(() => {
        setIsComplete(step.status?.toLowerCase() === "success");
    }, [step.status]);

    return (
        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <CheckCircle
                    className={`w-5 h-5 shrink-0 ${isComplete ? "text-green-500" : "text-slate-300"
                        }`}
                />
                <span
                    className={`text-sm font-medium truncate ${isComplete
                        ? "text-slate-400 line-through"
                        : "text-slate-700"
                        }`}
                >
                    {step.task}
                </span>
            </div>
            <StatusDropdown
                initialStatus={step.status}
                onStatusChange={(status) => {
                    setIsComplete(status === "success");
                    onStatusChange?.(status);
                }}
            />
        </div>
    );
}

export default function IdeaDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { data: idea, isLoading, isError } = useGetIdeaByIdQuery(id);
    const [generatePlan, { isLoading: isGenerating }] = useGenerateBusinessPlanMutation();
    const [deleteIdea, { isLoading: isDeleting }] = useDeleteIdeaMutation();
    const [updateSteps] = useUpdateReportStepsMutation();
    const [progress, setProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStatusChange = async (stepIndex: number, newStatus: string) => {
        const report = idea?.reports?.[0];
        if (!report || !report.steps) return;

        const currentSteps = report.steps;
        const updatedSteps = [...currentSteps];
        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], status: newStatus };

        try {
            await updateSteps({ id: report.id, steps: updatedSteps }).unwrap();
            toast.success("Step status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteIdea(Number(id)).unwrap();
            toast.success('Validation deleted successfully');
            setIsModalOpen(false);
            router.push('/dashboard/my-ideas');
        } catch (error) {
            toast.error('Failed to delete validation');
        }
    };

    /* ─── Generate Business Plan Logic ─── */
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isGenerating) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 90 ? 90 : prev + 5));
            }, 1000);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    const handleGenerateBusinessPlan = async () => {
        try {
            const response = await generatePlan(id).unwrap();
            toast.success('Business plan generated successfully!');
            router.push(`/dashboard/business-plans/${response.business_plan_id}`);
        } catch (error) {
            toast.error('Failed to generate business plan.');
        }
    };
    /* ─── Loading ─── */
    if (isLoading) {
        return (
            <div className="p-6 md:p-10 max-w-5xl mx-auto animate-pulse">
                <div className="h-4 bg-slate-200 rounded-full w-40 mb-8" />
                <div className="h-10 bg-slate-200 rounded-full w-96 mb-4" />
                <div className="h-4 bg-slate-100 rounded-full w-full mb-2" />
                <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="h-64 bg-slate-200 rounded-2xl" />
                    <div className="h-64 bg-slate-200 rounded-2xl lg:col-span-2" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="h-48 bg-slate-200 rounded-2xl lg:col-span-2" />
                    <div className="h-48 bg-slate-200 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-sm border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                    <Sparkles className="text-blue-600 w-10 h-10 mb-6" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Creating your business plan...</h2>
                    <p className="text-sm text-slate-500 mb-8 max-w-sm">
                        Synthesizing market data and structuring your 12-month roadmap...
                    </p>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-6">
                        THIS USUALLY TAKES ABOUT 15-20 SECONDS.
                    </span>

                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                </div>
            </div>
        );
    }

    /* ─── Error ─── */
    if (isError || !idea) {
        return (
            <div className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-slate-500 text-lg">Failed to load idea details.</p>
                <Link href="/dashboard" className="text-blue-500 hover:underline mt-4 text-sm font-medium">
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    const report = idea.reports?.[0];
    const analysis = report?.ai_analysis;
    const score = report?.score || 0;

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-20">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Validations
                </Link>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Header */}
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
                {idea.title}
            </h1>

            {/* Full Report Markdown */}
            {analysis?.full_report_markdown && (
                <div className="prose prose-sm text-slate-500 max-w-none mb-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {analysis.full_report_markdown}
                    </ReactMarkdown>
                </div>
            )}

            {/* Analysis Date */}
            <p className="text-xs text-slate-400 mb-8">
                Analysis completed on {format(new Date(idea.created_at), "MMM dd, yyyy")}
            </p>

            {/* ─── Score & SWOT Bento Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Card */}
                <div
                    className={`bg-gradient-to-br ${getScoreBg(score)} rounded-2xl p-8 flex flex-col items-center justify-center text-white col-span-1`}
                >
                    <p className="text-xs font-semibold uppercase tracking-widest mb-6 opacity-90">
                        LogicCheck Score
                    </p>
                    <div className="w-36 h-36 rounded-full border-[6px] border-white/30 flex items-center justify-center mb-6">
                        <span className="text-5xl font-bold">{score}</span>
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-5 py-2 rounded-full">
                        {getScoreLabel(score)}
                    </span>
                </div>

                {/* SWOT Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-5">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-bold text-slate-900">SWOT Analysis</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Strengths */}
                        <div className="bg-green-50 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">
                                Strengths
                            </h3>
                            <ul className="space-y-1">
                                {analysis?.swot?.strengths?.map((item, i) => (
                                    <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Weaknesses */}
                        <div className="bg-red-50 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                                Weaknesses
                            </h3>
                            <ul className="space-y-1">
                                {analysis?.swot?.weaknesses?.map((item, i) => (
                                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Opportunities */}
                        <div className="bg-blue-50 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                                Opportunities
                            </h3>
                            <ul className="space-y-1">
                                {analysis?.swot?.opportunities?.map((item, i) => (
                                    <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Threats */}
                        <div className="bg-orange-50 rounded-xl p-4">
                            <h3 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">
                                Threats
                            </h3>
                            <ul className="space-y-1">
                                {analysis?.swot?.threats?.map((item, i) => (
                                    <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Market Gap & Investor Report ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Market Gap Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-bold text-slate-900">Market Gap Analysis</h2>
                    </div>
                    {analysis?.market_gap ? (
                        <p className="text-slate-600 text-base leading-relaxed">
                            {analysis.market_gap}
                        </p>
                    ) : (
                        <p className="text-slate-400 text-sm">No market gap data available.</p>
                    )}
                </div>

                {/* Investor Report Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">
                        Investor-Ready Report
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                        Generate a comprehensive 12-month roadmap, financial projections, and executive summary for venture outreach.
                    </p>
                    <button
                        onClick={handleGenerateBusinessPlan}
                        disabled={isGenerating}
                        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl w-full py-3 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {isGenerating ? "Generating..." : "Generate Business Plan"}
                    </button>
                </div>
            </div>

            {/* ─── Competitors ─── */}
            {analysis?.competitors && analysis.competitors.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                        Competitor Landscape
                    </h2>
                    <p className="text-sm text-slate-500 mb-5">
                        Deep dive into existing platforms and direct market rivals.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {analysis.competitors.map((competitor, i) => (
                            <div
                                key={i}
                                className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3"
                            >
                                <Globe className="w-5 h-5 text-slate-400 shrink-0" />
                                <span className="text-sm font-semibold text-slate-800 truncate flex-1">
                                    {competitor || "Unknown"}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── Recommended Next Steps ─── */}
            {report?.steps && report.steps.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-5">
                        Recommended Next Steps
                    </h2>
                    <div className="space-y-3">
                        {report.steps.map((step, i) => (
                            <StepRow
                                key={i}
                                step={step}
                                onStatusChange={(newStatus) => handleStatusChange(i, newStatus)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Validation?</h3>
                        <p className="text-sm text-slate-500 text-center mb-8">
                            Are you sure you want to delete this validation? This action cannot be undone.
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                            >
                                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
