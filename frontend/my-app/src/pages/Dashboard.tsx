import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthProvider";
import { api } from "@/lib/api";
import { useNavigate } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  School,
  FileText,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setLoadError(false);

        const { data } = await api.get("/dashboard/getDashboard");

        setStatsData(data.data ?? {});
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 p-6 md:p-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32 rounded-xl" />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const recentActivity = Array.isArray(statsData.recentActivity)
    ? statsData.recentActivity
    : [];

  return (
    <div className="flex-1 space-y-6 p-6 pt-6 md:p-8">
      {/* Dashboard Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {user?.name || "User"}! Here is your academic overview.
          </p>
        </div>

        {user?.role === "admin" && (
          <Button onClick={() => navigate("/users/students")}>
            <Users className="mr-2 h-4 w-4" />
            Manage Students
          </Button>
        )}

        {user?.role === "teacher" && (
          <Button onClick={() => navigate("/lms/exams")}>
            <FileText className="mr-2 h-4 w-4" />
            Manage Exams
          </Button>
        )}
      </div>

      {/* API Error */}
      {loadError && (
        <Card className="border-destructive/40">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Unable to load dashboard data</p>
              <p className="text-sm text-muted-foreground">
                Please check your connection and try again.
              </p>
            </div>

            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {!loadError && (
        <DashboardStats
          role={user?.role || ""}
          data={statsData}
        />
      )}

      {/* Main Dashboard Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>

              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest activity available from the system.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loadError ? (
              <p className="text-sm text-muted-foreground">
                Activity is unavailable because dashboard data could not be loaded.
              </p>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity: any, index: number) => (
                  <div
                    key={`${index}-${activity.time}`}
                    className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.userName}</p>
                      <p className="text-sm leading-relaxed">{activity.action}</p>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {activity.time ? new Date(activity.time).toLocaleString() : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <ClipboardList className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />

                <p className="font-medium">No recent activity</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  There are no activity records available to display.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Navigate to important sections.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3">
            <Button
              variant="outline"
              className="h-11 justify-start"
              onClick={() => navigate("/timetable")}
            >
              <Calendar className="mr-3 h-4 w-4 text-primary" />
              View Timetable
            </Button>

            <Button
              variant="outline"
              className="h-11 justify-start"
              onClick={() => navigate("/lms/exams")}
            >
              <BookOpen className="mr-3 h-4 w-4 text-primary" />
              Exams
            </Button>

            {user?.role === "admin" && (
              <>
                <Button
                  variant="outline"
                  className="h-11 justify-start"
                  onClick={() => navigate("/users/teachers")}
                >
                  <GraduationCap className="mr-3 h-4 w-4 text-primary" />
                  Manage Teachers
                </Button>

                <Button
                  variant="outline"
                  className="h-11 justify-start"
                  onClick={() => navigate("/classes")}
                >
                  <School className="mr-3 h-4 w-4 text-primary" />
                  Manage Classes
                </Button>

                <Button
                  variant="outline"
                  className="h-11 justify-start"
                  onClick={() => navigate("/subjects")}
                >
                  <BookOpen className="mr-3 h-4 w-4 text-primary" />
                  Manage Subjects
                </Button>

                <Button
                  variant="outline"
                  className="h-11 justify-start"
                  onClick={() => navigate("/settings/academic-years")}
                >
                  <Calendar className="mr-3 h-4 w-4 text-primary" />
                  Academic Settings
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




