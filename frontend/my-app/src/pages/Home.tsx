
import { Link } from "react-router";
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarDays,
  ClipboardList,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChartNoAxesCombined,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "User Management",
    description:
      "Manage students, teachers, parents, and administrators from one organized platform.",
  },
  {
    icon: BookOpen,
    title: "Academic Management",
    description:
      "Organize classes, subjects, and academic years with an easy-to-use interface.",
  },
  {
    icon: CalendarDays,
    title: "Smart Timetable",
    description:
      "Access class schedules and keep academic activities organized.",
  },
  {
    icon: ClipboardList,
    title: "Examinations",
    description:
      "Create and manage exams, generate questions, and track student results.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Tools",
    description:
      "Explore AI-assisted educational workflows and exam generation capabilities.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Dashboard & Insights",
    description:
      "View academic information and role-based summaries in one place.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0f172a] dark:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0f172a]/90">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#bd7188] text-white shadow-lg shadow-[#bd7188]/20">
              <GraduationCap className="size-6" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                EduNexus
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                School Management System
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-[#a85f76] dark:text-slate-300"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-[#a85f76] dark:text-slate-300"
            >
              About
            </a>
          </nav>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-[#bd7188] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#bd7188]/20 transition hover:-translate-y-0.5 hover:bg-[#a85f76]"
          >
            Sign In
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#faf6f1] dark:bg-[#211b20]">
          <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-indigo-200/40 blur-3xl dark:bg-[#bd7188]/10" />
          <div className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-600/10" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f0d8df] bg-[#f7e4e9] px-4 py-2 text-sm font-semibold text-[#875466] dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300">
                <Sparkles className="size-4" />
                A Smarter Way to Manage Education
              </div>

              <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Everything Your School Needs,
                <span className="mt-2 block text-[#a85f76] dark:text-indigo-400">
                  In One Place.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                EduNexus brings school management, academic organization,
                examinations, and AI-powered educational tools together in one
                simple platform.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#bd7188] px-7 py-4 font-bold text-white shadow-xl shadow-[#bd7188]/20 transition hover:-translate-y-1 hover:bg-[#a85f76]"
                >
                  Get Started
                  <ArrowRight className="size-5" />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-4 font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-[#f7e4e9] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-indigo-500" />
                  Role-Based Access
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-indigo-500" />
                  Academic Management
                </span>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Welcome to
                    </p>
                    <h3 className="mt-1 text-xl font-bold">EduNexus</h3>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#f7e4e9] text-[#a85f76] dark:bg-indigo-400/10 dark:text-indigo-300">
                    <GraduationCap className="size-6" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#f7e4e9] p-5 dark:bg-indigo-400/10">
                    <Users className="size-6 text-[#a85f76] dark:text-indigo-400" />
                    <p className="mt-4 font-bold">Users</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Students & Staff
                    </p>
                  </div>

                  <div className="rounded-2xl bg-sky-50 p-5 dark:bg-sky-400/10">
                    <BookOpen className="size-6 text-sky-600 dark:text-sky-400" />
                    <p className="mt-4 font-bold">Academics</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Classes & Subjects
                    </p>
                  </div>

                  <div className="rounded-2xl bg-violet-50 p-5 dark:bg-violet-400/10">
                    <ClipboardList className="size-6 text-violet-600 dark:text-violet-400" />
                    <p className="mt-4 font-bold">Examinations</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Exams & Results
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-5 dark:bg-amber-400/10">
                    <BrainCircuit className="size-6 text-amber-600 dark:text-amber-400" />
                    <p className="mt-4 font-bold">AI Tools</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Smart Assistance
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">One Connected Platform</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Organized school operations
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 -z-10 size-40 rounded-full bg-indigo-200/60 blur-2xl dark:bg-[#f7e4e9]0/20" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-[#a85f76] dark:text-indigo-400">
                Platform Features
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Everything Connected. Everything Organized.
              </h2>
              <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
                Powerful tools designed to simplify everyday school
                administration and academic activities.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/40 dark:hover:shadow-none"
                  >
                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#f7e4e9] text-[#a85f76] transition group-hover:bg-[#bd7188] group-hover:text-white dark:bg-indigo-400/10 dark:text-indigo-400">
                      <Icon className="size-6" />
                    </div>

                    <h3 className="mt-6 text-xl font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          className="border-y border-slate-200 bg-[#faf6f1] px-5 py-20 dark:border-slate-800 dark:bg-[#211b20] sm:px-8"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#a85f76] dark:text-indigo-400">
                About EduNexus
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                Built to Make School Management Simpler.
              </h2>
            </div>

            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
              From managing school users and academic structures to organizing
              examinations and timetables, EduNexus provides a unified
              experience that helps different school roles access the tools
              they need.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#bd7188] px-7 py-16 text-center text-white shadow-2xl shadow-[#bd7188]/20 sm:px-14">
            <Sparkles className="mx-auto size-9 text-indigo-200" />

            <h2 className="mt-6 text-3xl font-extrabold sm:text-5xl">
              Bring Your School Together.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-indigo-100">
              Access your school workspace and explore the tools available
              for your role.
            </p>

            <Link
              to="/login"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-[#875466] transition hover:-translate-y-1 hover:bg-[#f7e4e9]"
            >
              Enter EduNexus
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 dark:border-slate-800 dark:bg-[#0f172a] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-6 text-[#a85f76] dark:text-indigo-400" />
            <span className="font-extrabold">EduNexus</span>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            School Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

