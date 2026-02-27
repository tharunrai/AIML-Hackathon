"use client";

import {
    Users,
    Trophy,
    CheckCircle,
    TrendingUp,
    Medal,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import {
    ChartWrapper,
    CustomBarChart,
    CustomPieChart,
    CustomAreaChart,
} from "@/components/shared/ChartComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    currentAdmin,
    achievements,
    categoryStats,
    departmentStats,
    topStudents,
    monthlyStats,
} from "@/lib/dummy-data";
import { Achievement, DepartmentStats, TopStudent } from "@/types";

const achievementColumns: Column<Achievement>[] = [
    { key: "studentName", label: "Student", sortable: true },
    {
        key: "title", label: "Achievement", render: (_, row) => (
            <span className="text-xs text-slate-700 max-w-[160px] block truncate">{row.title}</span>
        )
    },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    { key: "department", label: "Dept", render: (val) => <span className="text-xs text-slate-500">{String(val).split(" ")[0]}</span> },
    {
        key: "points", label: "Points", sortable: true, render: (val) => (
            <span className="text-xs font-semibold text-violet-700">{String(val)} pts</span>
        )
    },
    { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
];

const deptColumns: Column<DepartmentStats>[] = [
    { key: "department", label: "Department", sortable: true },
    { key: "totalStudents", label: "Students", sortable: true },
    { key: "totalAchievements", label: "Total", sortable: true },
    { key: "approvedAchievements", label: "Approved", sortable: true, render: (val) => <span className="text-emerald-700 font-semibold text-xs">{String(val)}</span> },
    {
        key: "totalPoints", label: "Points", sortable: true, render: (val) => (
            <span className="font-semibold text-violet-700 text-xs">{Number(val).toLocaleString()}</span>
        )
    },
];

const pieData = categoryStats.map((c) => ({ name: c.category, value: c.count }));
const areaData = monthlyStats.map((m) => ({ name: m.month, total: m.total, approved: m.approved, pending: m.pending }));
const barData = departmentStats.map((d) => ({ name: d.department, Points: d.totalPoints, Achievements: d.totalAchievements * 30 }));

export default function AdminDashboard() {
    const totalAchievements = achievements.length;
    const totalApproved = achievements.filter((a) => a.status === "approved").length;
    const totalStudents = 1200;
    const approvalRate = Math.round((totalApproved / totalAchievements) * 100);

    return (
        <DashboardLayout user={currentAdmin} role="admin">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">System-wide overview and analytics for NBA Criterion 4.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Total Students" value={totalStudents.toLocaleString()} icon={Users} color="violet" trend={5} trendLabel="vs last year" />
                <StatCard title="Total Achievements" value={totalAchievements} icon={Trophy} color="violet" trend={18} trendLabel="vs last month" />
                <StatCard title="Approved" value={totalApproved} icon={CheckCircle} color="green" />
                <StatCard title="Approval Rate" value={approvalRate} suffix="%" icon={TrendingUp} color="orange" trend={2} trendLabel="vs last month" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-5 lg:grid-cols-3 mb-5">
                <ChartWrapper title="Monthly Submission Trend" description="Total achievement submissions over the year" className="lg:col-span-2">
                    <CustomAreaChart
                        data={areaData}
                        areas={[
                            { key: "total", label: "Total", color: "#8b5cf6" },
                            { key: "approved", label: "Approved", color: "#10b981" },
                            { key: "pending", label: "Pending", color: "#f59e0b" },
                        ]}
                    />
                </ChartWrapper>
                <ChartWrapper title="Category Distribution" description="Proportion of achievements by category">
                    <CustomPieChart data={pieData} height={260} innerRadius={55} />
                </ChartWrapper>
            </div>

            {/* Charts Row 2 + Top Students */}
            <div className="grid gap-5 lg:grid-cols-3 mb-5">
                <ChartWrapper title="Department Performance" description="Points and achievements per department" className="lg:col-span-2">
                    <CustomBarChart
                        data={barData}
                        bars={[
                            { key: "Points", label: "Total Points", color: "#8b5cf6" },
                            { key: "Achievements", label: "Achievements ×30", color: "#c4b5fd" },
                        ]}
                    />
                </ChartWrapper>

                {/* Top Students */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-slate-800">Top Students</CardTitle>
                        <p className="text-xs text-slate-500">By total achievement points</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {topStudents.map((s, i) => (
                            <div key={s.id} className="flex items-center gap-3">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 shrink-0">
                                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                </div>
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback className="bg-violet-100 text-violet-700 text-[9px] font-semibold">
                                        {s.name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-slate-900 truncate">{s.name}</p>
                                    <p className="text-[10px] text-slate-400">{s.department}</p>
                                </div>
                                <span className="text-xs font-bold text-violet-700 shrink-0">{s.totalPoints} pts</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Department Stats Table */}
            <Card className="border-slate-200 shadow-sm mb-5">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-800">Department-wise Statistics</CardTitle>
                    <p className="text-xs text-slate-500">Achievement breakdown across all departments</p>
                </CardHeader>
                <CardContent>
                    <DataTable columns={deptColumns} data={departmentStats} pagination={false} />
                </CardContent>
            </Card>

            {/* All Achievements Table */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-800">All Achievement Submissions</CardTitle>
                    <p className="text-xs text-slate-500">Complete record across all students and departments</p>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={achievementColumns}
                        data={achievements}
                        searchable
                        searchKey="studentName"
                        searchPlaceholder="Search by student name..."
                    />
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
