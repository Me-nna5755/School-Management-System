import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Clock,
  School,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsData {
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  activeExams?: number;
  totalExams?: number;

  myClassesCount?: number;
  totalSubmissions?: number;

  submittedExams?: number;
  pendingExams?: number;
  upcomingExams?: number;
}

interface StatsProps {
  role: string;
  data: StatsData;
}

export function DashboardStats({ role, data }: StatsProps) {
  const adminStats = [
    {
      title: "Total Students",
      value: data.totalStudents ?? 0,
      icon: Users,
      description: "Registered students",
    },
    {
      title: "Total Teachers",
      value: data.totalTeachers ?? 0,
      icon: GraduationCap,
      description: "Registered teachers",
    },
    {
      title: "Total Classes",
      value: data.totalClasses ?? 0,
      icon: School,
      description: "Available classes",
    },
    {
      title: "Active Exams",
      value: data.activeExams ?? 0,
      icon: BookOpen,
      description: "Currently active exams",
    },
  ];

  const teacherStats = [
    {
      title: "My Classes",
      value: data.myClassesCount ?? 0,
      icon: School,
      description: "Assigned classes",
    },
    {
      title: "Total Exams",
      value: data.totalExams ?? 0,
      icon: FileText,
      description: "Exams in your workspace",
    },
    {
      title: "Active Exams",
      value: data.activeExams ?? 0,
      icon: BookOpen,
      description: "Currently active exams",
    },
    {
      title: "Total Submissions",
      value: data.totalSubmissions ?? 0,
      icon: ClipboardCheck,
      description: "Student submissions",
    },
  ];

  const studentStats = [
    {
      title: "Total Exams",
      value: data.totalExams ?? 0,
      icon: BookOpen,
      description: "Available exams",
    },
    {
      title: "Submitted Exams",
      value: data.submittedExams ?? 0,
      icon: ClipboardCheck,
      description: "Exams you submitted",
    },
    {
      title: "Pending Exams",
      value: data.pendingExams ?? 0,
      icon: Clock,
      description: "Exams awaiting submission",
    },
    {
      title: "Upcoming Exams",
      value: data.upcomingExams ?? 0,
      icon: CalendarDays,
      description: "Upcoming exams",
    },
  ];

  const stats =
    role === "admin"
      ? adminStats
      : role === "teacher"
        ? teacherStats
        : studentStats;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className={`border-border border-t-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${["border-t-violet-500 bg-violet-50/70 dark:bg-violet-950/30","border-t-teal-500 bg-teal-50/70 dark:bg-teal-950/30","border-t-pink-500 bg-pink-50/70 dark:bg-pink-950/30","border-t-orange-500 bg-orange-50/70 dark:bg-orange-950/30"][index % 4]}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>

              <div className={`flex size-11 items-center justify-center rounded-xl shadow-sm ${["bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300","bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300","bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300","bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"][index % 4]}`}>
                <Icon className="size-5" />
              </div>
            </CardHeader>

            <CardContent>
              <div className={`text-3xl font-extrabold tracking-tight ${["text-violet-700 dark:text-violet-300","text-teal-700 dark:text-teal-300","text-pink-700 dark:text-pink-300","text-orange-700 dark:text-orange-300"][index % 4]}`}>
                {stat.value}
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

