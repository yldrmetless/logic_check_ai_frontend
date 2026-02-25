"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Trash2, Download, AlertTriangle, Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useGetBusinessPlanDetailQuery, useDeleteBusinessPlanMutation } from "@/store/api/ideasApi";
import toast from "react-hot-toast";

export default function BusinessPlanDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { data: plan, isLoading, isError } = useGetBusinessPlanDetailQuery(id);
    const [deletePlan, { isLoading: isDeleting }] = useDeleteBusinessPlanMutation();
    const documentRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePrint = useReactToPrint({
        contentRef: documentRef,
        documentTitle: `Business_Plan_${plan?.title?.replace(/\s+/g, '_') || 'Report'}`,
        pageStyle: "@page { margin: 20mm !important; } @media print { body { -webkit-print-color-adjust: exact; } }",
    });

    const handleDelete = async () => {
        try {
            await deletePlan(id).unwrap();
            toast.success("Business plan deleted successfully");
            setIsModalOpen(false);
            router.push("/dashboard/business-plans");
        } catch (error) {
            toast.error("Failed to delete plan");
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 md:p-10 max-w-5xl mx-auto pb-20 animate-pulse">
                {/* Nav Skeleton */}
                <div className="flex items-center justify-between mb-6">
                    <div className="w-40 h-5 bg-slate-200 rounded-full" />
                    <div className="flex gap-4">
                        <div className="w-24 h-10 bg-slate-200 rounded-xl" />
                        <div className="w-32 h-10 bg-slate-200 rounded-xl" />
                    </div>
                </div>

                {/* Doc Skeleton */}
                <div className="bg-white rounded-[2rem] p-10 md:p-14 border border-slate-100 shadow-sm">
                    <div className="w-3/4 h-10 bg-slate-200 rounded-full mb-4" />
                    <div className="w-1/2 h-4 bg-slate-100 rounded-full mb-10 pb-8 border-b border-slate-100" />
                    <div className="space-y-6">
                        <div className="w-1/4 h-6 bg-slate-200 rounded-full mb-4" />
                        <div className="space-y-3">
                            <div className="w-full h-4 bg-slate-100 rounded-full" />
                            <div className="w-full h-4 bg-slate-100 rounded-full" />
                            <div className="w-5/6 h-4 bg-slate-100 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !plan) {
        return (
            <div className="p-6 md:p-10 max-w-5xl mx-auto pb-20 flex flex-col items-center justify-center min-h-[50vh]">
                <p className="text-slate-500 mb-4">Failed to load business plan.</p>
                <Link
                    href="/dashboard/business-plans"
                    className="text-blue-500 hover:underline font-medium flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Business Plans
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 pb-20">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between w-full max-w-5xl mx-auto mb-6">
                <Link
                    href="/dashboard/business-plans"
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Business Plans
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Document Container */}
            <div ref={documentRef} className="w-full max-w-5xl mx-auto bg-white rounded-[2rem] p-10 md:p-14 border border-slate-100 shadow-sm print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none">
                {/* Header */}
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                    {plan.title}
                </h1>
                <p className="text-sm font-medium text-slate-400 mb-10 pb-8 border-b border-slate-100">
                    Generated on {format(new Date(plan.created_at), "MMM dd, yyyy")} • AI Business Plan
                </p>

                {/* Typography Container */}
                <div className="w-full">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight print:break-inside-avoid print:mt-8">Executive Summary</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8 print:break-inside-avoid">{plan?.executive_summary}</p>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight print:break-inside-avoid print:mt-8">Market Analysis &amp; TAM</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8 print:break-inside-avoid">{plan?.market_analysis}</p>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight print:break-inside-avoid print:mt-8">Competitor Positioning</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8 print:break-inside-avoid">{plan?.competitor_positioning}</p>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight print:break-inside-avoid print:mt-8">Target Audience &amp; Personas</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8 print:break-inside-avoid">{plan?.target_audience}</p>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight print:break-inside-avoid print:mt-8">Revenue Model &amp; Pricing</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8 print:break-inside-avoid">{plan?.revenue_model}</p>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight print:break-inside-avoid print:mt-8">Marketing &amp; Acquisition</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8 print:break-inside-avoid">{plan?.marketing_strategy}</p>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight print:break-inside-avoid print:mt-8">Technical Architecture</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8 print:break-inside-avoid">{plan?.tech_architecture}</p>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-6 tracking-tight print:break-before-page print:break-after-avoid">12-Month Roadmap</h2>
                    <div className="flex flex-col gap-4">
                        {plan?.roadmap?.map((phase: any, index: number) => (
                            <div key={index} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm print:break-inside-avoid print:bg-slate-50">
                                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider block mb-1">{phase.month}</span>
                                <span className="text-slate-800 font-semibold text-lg">{phase.focus}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Business Plan?</h3>
                        <p className="text-sm text-slate-500 text-center mb-8">
                            Are you sure you want to delete this business plan? This action will remove it from your active list.
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center"
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
