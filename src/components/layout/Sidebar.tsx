"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Boxes,
    Home,
    FolderOpen,
    FileBarChart,
    User,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/store/api/ideasApi";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/features/authSlice";
import toast from "react-hot-toast";

const navLinks = [
    { href: "/dashboard", label: "Dashboard (Idea Hub)", icon: Home },
    { href: "/dashboard/my-ideas", label: "My Business Ideas", icon: FolderOpen },
    { href: "/dashboard/business-plans", label: "Business Plans", icon: FileBarChart },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: profileData, isLoading: profileLoading } = useGetUserProfileQuery();

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        router.push("/login");
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-6 flex items-center gap-2.5">
                <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Boxes className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                    LogicCheck AI
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 mt-2">
                <ul className="space-y-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon className="w-4.5 h-4.5" />
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User profile + Logout */}
            <div className="px-4 pb-6 mt-auto">
                <div className="border-t border-slate-100 pt-4">
                    {profileLoading ? (
                        <div className="flex items-center gap-3 px-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 bg-slate-200 rounded-full w-24 animate-pulse" />
                                <div className="h-2.5 bg-slate-100 rounded-full w-16 animate-pulse" />
                            </div>
                        </div>
                    ) : profileData ? (
                        <div className="flex items-center gap-3 px-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-4.5 h-4.5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                    {profileData.results.first_name} {profileData.results.last_name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    @{profileData.results.username}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 cursor-pointer rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl border border-slate-200 shadow-sm"
            >
                <Menu className="w-5 h-5 text-slate-700" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile slide-over */}
            <aside
                className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-5 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                {sidebarContent}
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 flex-col">
                {sidebarContent}
            </aside>
        </>
    );
}
