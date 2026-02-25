import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 md:ml-72 min-h-screen bg-[#F8FAFC]">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
