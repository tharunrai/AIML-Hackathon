"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Trophy,
    BarChart2,
    FileText,
    Users,
    CheckSquare,
    PieChart,
    Home,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole, NavItem } from "@/types";

const studentNav: NavItem[] = [
    { label: "Dashboard", href: "/student-dashboard", icon: "LayoutDashboard" },
    { label: "Achievements", href: "/achievements", icon: "Trophy" },
    { label: "Analytics", href: "/analytics", icon: "BarChart2" },
    { label: "Reports", href: "/reports", icon: "FileText" },
];

const facultyNav: NavItem[] = [
    { label: "Dashboard", href: "/faculty-dashboard", icon: "LayoutDashboard" },
    { label: "Pending Approvals", href: "/achievements", icon: "CheckSquare", badge: 2 },
    { label: "Students", href: "/reports", icon: "Users" },
    { label: "Analytics", href: "/analytics", icon: "BarChart2" },
    { label: "Reports", href: "/reports", icon: "FileText" },
];

const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/admin-dashboard", icon: "LayoutDashboard" },
    { label: "All Achievements", href: "/achievements", icon: "Trophy" },
    { label: "Analytics", href: "/analytics", icon: "PieChart" },
    { label: "Reports", href: "/reports", icon: "FileText" },
    { label: "Users", href: "/reports", icon: "Users" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Trophy,
    BarChart2,
    FileText,
    Users,
    CheckSquare,
    PieChart,
    Home,
};

function navForRole(role: UserRole): NavItem[] {
    if (role === "student") return studentNav;
    if (role === "faculty") return facultyNav;
    return adminNav;
}

interface SidebarProps {
    role: UserRole;
}

const roleTheme = {
    student: {
        active: "bg-blue-600 text-white shadow-sm",
    },
    faculty: {
        active: "bg-emerald-600 text-white shadow-sm",
    },
    admin: {
        active: "bg-violet-600 text-white shadow-sm",
    },
};

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const navItems = navForRole(role);
    const theme = roleTheme[role];

    return (
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-slate-50 min-h-screen">
            <nav className="flex-1 px-3 py-6 space-y-0.5">
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Navigation
                </p>
                {navItems.map((item) => {
                    const Icon = iconMap[item.icon] || LayoutDashboard;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                isActive
                                    ? theme.active
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-4 w-4 shrink-0",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                                )}
                            />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && item.badge > 0 ? (
                                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
                                    {item.badge}
                                </span>
                            ) : isActive ? (
                                <ChevronRight className="h-3 w-3 text-white/70" />
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer branding */}
            <div className="px-4 py-4 border-t border-slate-200">
                <p className="text-[10px] text-slate-400 text-center">
                    NBA Criterion 4 · v1.0.0
                </p>
            </div>
        </aside>
    );
}
