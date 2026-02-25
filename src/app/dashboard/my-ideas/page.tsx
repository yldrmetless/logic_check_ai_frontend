"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { FileText, Trash2, Search, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, Loader2 } from "lucide-react";
import { useGetMyValidationsQuery, useDeleteIdeaMutation } from "@/store/api/ideasApi";
import toast from "react-hot-toast";

function getScoreColor(score: number) {
    if (score >= 90) return { ring: "border-blue-500", text: "text-blue-600" };
    if (score >= 80) return { ring: "border-green-500", text: "text-green-600" };
    if (score >= 60) return { ring: "border-orange-400", text: "text-orange-500" };
    return { ring: "border-red-500", text: "text-red-600" };
}

function SortDropdown({ currentSort, onSortChange }: { currentSort: string, onSortChange: (sort: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sortOptions = ["Newest First", "Oldest First", "Highest Score", "Lowest Score"];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onSortChange(option);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative z-20">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer min-w-[180px]"
            >
                Sort by: {currentSort}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-full min-w-[180px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {sortOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors block ${currentSort === option
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            Sort by: {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function MyValidationsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Newest First");

    let ordering = "-created_at";
    if (sortBy === "Oldest First") ordering = "created_at";
    else if (sortBy === "Highest Score") ordering = "-score";
    else if (sortBy === "Lowest Score") ordering = "score";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIdeaId, setSelectedIdeaId] = useState<number | null>(null);

    const { data, isLoading, isError } = useGetMyValidationsQuery({
        page,
        search,
        ordering,
    });
    const [deleteIdea, { isLoading: isDeleting }] = useDeleteIdeaMutation();

    const handleDelete = async () => {
        if (!selectedIdeaId) return;
        try {
            await deleteIdea(selectedIdeaId).unwrap();
            toast.success("Validation deleted successfully");
            setIsModalOpen(false);
            setSelectedIdeaId(null);
        } catch (error) {
            toast.error("Failed to delete validation");
        }
    };

    const resultsPerPage = data?.results?.length ?? 0;
    const startIndex = (page - 1) * 10 + 1;
    const endIndex = startIndex + resultsPerPage - 1;

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        My Validations
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Review, search, and manage your previously analyzed startup ideas.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search ideas..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full md:w-52 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    {/* Sort */}
                    <SortDropdown
                        currentSort={sortBy}
                        onSortChange={(val) => {
                            setSortBy(val);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* List Container */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                {isLoading ? (
                    /* Skeleton */
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-5 animate-pulse p-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded-full w-56" />
                                    <div className="h-3 bg-slate-100 rounded-full w-96" />
                                    <div className="h-5 bg-slate-100 rounded-full w-24 mt-2" />
                                </div>
                                <div className="w-12 h-12 rounded-full bg-slate-200" />
                                <div className="w-20 h-4 bg-slate-200 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <p className="text-center text-slate-500 py-12">
                        Failed to load validations. Please try again.
                    </p>
                ) : data?.results && data.results.length > 0 ? (
                    <>
                        <div className="flex flex-col divide-y divide-slate-100">
                            {data.results.map((idea) => {
                                const scoreColor = getScoreColor(idea.score);
                                return (
                                    <div
                                        key={idea.id}
                                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-5 group hover:bg-slate-50 transition-colors rounded-2xl"
                                    >
                                        {/* Left: Icon + Text */}
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-bold text-slate-900 truncate">
                                                    {idea.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl mt-0.5">
                                                    {idea.description}
                                                </p>
                                                <span className="inline-block bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-medium mt-3">
                                                    {format(new Date(idea.created_at), "MMM dd, yyyy")}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: Score + Actions */}
                                        <div className="flex items-center gap-6 md:gap-10 shrink-0">
                                            {/* Score Ring */}
                                            <div className="flex flex-col items-center gap-1">
                                                <div
                                                    className={`w-12 h-12 rounded-full border-2 ${scoreColor.ring} flex items-center justify-center`}
                                                >
                                                    <span className={`text-base font-bold ${scoreColor.text}`}>
                                                        {idea.score}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                    Score
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <Link
                                                href={`/dashboard/my-ideas/${idea.id}`}
                                                className="text-sm text-blue-600 font-bold hover:underline whitespace-nowrap"
                                            >
                                                View Report
                                            </Link>
                                            <button
                                                onClick={() => { setSelectedIdeaId(idea.id); setIsModalOpen(true); }}
                                                className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Footer */}
                        <div className="flex justify-between items-center pt-6 mt-4 border-t border-slate-100 text-sm text-slate-500">
                            <p>
                                Showing <span className="font-semibold text-slate-700">{startIndex}-{endIndex}</span> of{" "}
                                <span className="font-semibold text-slate-700">{data.count}</span>
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={!data.previous}
                                    className={`flex items-center gap-1 font-medium transition-colors cursor-pointer ${data.previous
                                        ? "text-slate-600 hover:text-slate-900"
                                        : "text-slate-300 cursor-not-allowed"
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={!data.next}
                                    className={`flex items-center gap-1 font-medium transition-colors cursor-pointer ${data.next
                                        ? "text-blue-600 hover:text-blue-700"
                                        : "text-slate-300 cursor-not-allowed"
                                        }`}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">
                            {search
                                ? "No ideas match your search."
                                : "No validations yet. Start by analyzing your first idea!"}
                        </p>
                    </div>
                )}
            </div>

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
                                onClick={() => { setIsModalOpen(false); setSelectedIdeaId(null); }}
                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl flex items-center justify-center cursor-pointer transition-colors"
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
