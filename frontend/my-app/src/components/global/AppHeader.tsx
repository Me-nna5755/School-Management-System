import { useLocation } from "react-router";
import { Bell, ChevronRight } from "lucide-react";

import { useAuth } from "@/hooks/AuthProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/activities-log": "Activities",
  "/classes": "Classes",
  "/subjects": "Subjects",
  "/timetable": "Timetable",
  "/lms/exams": "Examinations",
  "/users/students": "Students",
  "/users/teachers": "Teachers",
  "/users/parents": "Parents",
  "/users/admins": "Administrators",
  "/settings/academic-years": "Academic Years",
};

export function AppHeader() {
  const { user } = useAuth();
  const location = useLocation();

  const pageTitle =
    pageTitles[location.pathname] || "EduNexus";

  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/85 px-4 shadow-sm backdrop-blur-xl transition-colors duration-300 md:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="size-9 rounded-xl border border-border/70 bg-card text-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary" />

        <Separator orientation="vertical" className="h-7" />

        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden text-xs font-medium tracking-wide text-muted-foreground sm:block">
            Workspace
          </span>

          <ChevronRight className="hidden size-4 text-primary/60 sm:block" />

          <h1 className="truncate text-base font-extrabold tracking-tight text-foreground md:text-lg">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-md"
        >
          <Bell className="size-5" />
        </button>

        <Separator orientation="vertical" className="h-7" />

        <div className="flex items-center gap-2.5 rounded-xl px-2 py-1 transition-colors hover:bg-accent/60">
          <div className="hidden text-right sm:block">
            <p className="max-w-36 truncate text-sm font-bold text-foreground">
              {user?.name || "User"}
            </p>

            <p className="text-xs capitalize text-muted-foreground">
              {user?.role || "Member"}
            </p>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 text-sm font-extrabold text-white shadow-md shadow-violet-500/20 ring-2 ring-background">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
