import { useAuth } from "@/hooks/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router";
import { Loader2 } from "lucide-react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { AppHeader } from "@/components/global/AppHeader";

const PrivateRoutes = () => {
  const { loading, user, year, yearLoading } = useAuth();
  const location = useLocation();

  if (loading || yearLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!year && user.role === "admin") {
    if (location.pathname !== "/settings/academic-years") {
      return (
        <Navigate
          to="/settings/academic-years"
          replace
        />
      );
    }
  }

  if (!year && user.role === "teacher") {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <AppHeader />

        <div className="min-h-[calc(100vh-4rem)] w-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateRoutes;
