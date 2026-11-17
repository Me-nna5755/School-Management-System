"use client";

import {
  School,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  CalendarDays,
  Settings2,
  LogOut,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { ThemeToogle } from "./ThemeToogle";

import type { UserRole } from "@/types";
import { useAuth } from "@/hooks/AuthProvider";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  roles?: UserRole[];
  items?: {
    title: string;
    url: string;
    roles?: UserRole[];
    isActive?: boolean;
  }[];
}

export const sidebardata = {
  teams: [
    {
      name: "EduNexus School",
      logo: School,
    },
  ],

  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          roles: ["admin", "teacher", "student", "parent"],
        },
      ],
    },

    {
      title: "Academics",
      url: "#",
      icon: BookOpen,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        {
          title: "Classes",
          url: "/classes",
          roles: ["admin", "teacher"],
        },
        {
          title: "Subjects",
          url: "/subjects",
          roles: ["admin", "teacher"],
        },
        {
          title: "Timetable",
          url: "/timetable",
          roles: ["admin", "teacher", "student", "parent"],
        },
      ],
    },

    {
      title: "Learning Management",
      url: "#",
      icon: GraduationCap,
      roles: ["admin", "teacher", "student"],
      items: [
        {
          title: "Examinations",
          url: "/lms/exams",
          roles: ["admin", "teacher", "student"],
        },
      ],
    },

    {
      title: "People",
      url: "#",
      icon: Users,
      roles: ["admin", "teacher"],
      items: [
        {
          title: "Students",
          url: "/users/students",
          roles: ["admin", "teacher"],
        },
        {
          title: "Teachers",
          url: "/users/teachers",
          roles: ["admin"],
        },
        {
          title: "Parents",
          url: "/users/parents",
          roles: ["admin"],
        },
        {
          title: "Administrators",
          url: "/users/admins",
          roles: ["admin"],
        },
      ],
    },

    {
      title: "School Management",
      url: "#",
      icon: Settings2,
      roles: ["admin"],
      items: [
        {
          title: "Academic Years",
          url: "/settings/academic-years",
          roles: ["admin"],
        },
      ],
    },

    {
      title: "Activities",
      url: "/activities-log",
      icon: CalendarDays,
      roles: ["admin"],
    },
  ] as NavItem[],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, year, setUser } = useAuth();
  const { state } = useSidebar();

  const location = useLocation();
  const navigate = useNavigate();

  const isCollapsed = state === "collapsed";

  const userRole = (user?.role || "student") as UserRole;

  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: "",
  };

  const filteredNav = useMemo(() => {
    return sidebardata.navMain
      .filter(
        (item) => !item.roles || item.roles.includes(userRole),
      )
      .map((item) => {
        const visibleItems = item.items
          ?.filter(
            (subItem) =>
              !subItem.roles || subItem.roles.includes(userRole),
          )
          .map((subItem) => ({
            ...subItem,
            isActive: location.pathname === subItem.url,
          }));

        const isChildActive = visibleItems?.some(
          (subItem) => subItem.isActive,
        );

        return {
          ...item,
          isActive:
            location.pathname === item.url || Boolean(isChildActive),
          items: visibleItems,
        };
      });
  }, [location.pathname, userRole]);

  const logout = async () => {
    try {
      await api.post("/user/logout");

      setUser(null);
      navigate("/login", { replace: true });

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <TeamSwitcher
          teams={sidebardata.teams}
          yearName={year?.name || "Academic Year"}
        />

        {!isCollapsed && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 p-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground">
                EduNexus
              </p>
              <p className="text-xs text-muted-foreground">
                Smart School Platform
              </p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <NavMain items={filteredNav} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={logout}
            variant="ghost"
            size="icon"
            title="Logout"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
          </Button>

          <ThemeToogle />
        </div>

        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
