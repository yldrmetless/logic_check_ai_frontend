"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/features/authSlice";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        const expirationTimestamp = localStorage.getItem("expirationTimestamp");

        if (!accessToken || !expirationTimestamp) {
            dispatch(logout());
            toast.error("Please login to continue.");
            router.push("/login");
            return;
        }

        if (Date.now() > Number(expirationTimestamp)) {
            dispatch(logout());
            toast.error("Session expired, please login again.");
            router.push("/login");
            return;
        }

        setIsAuthorized(true);
    }, [dispatch, router]);

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
