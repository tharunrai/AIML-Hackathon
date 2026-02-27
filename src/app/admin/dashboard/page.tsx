"use client";

import {
    Users,
    Trophy,
    CheckCircle,
    TrendingUp,
    Clock,
    Check,
    X,
    Eye,
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    currentAdmin,
    achievements,
    pendingAchievements,
    students,
    categoryStats,
    departmentStats,
    topStudents,
    monthlyStats,
} from "@/lib/dummy-data";
import { Achievement, DepartmentStats } from "@/types";

// â”€â”€ Admin columns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ Approval columns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const approvalColumns: Column<Achievement>[] = [
    {
        key: "studentName", label: "Student", sortable: true, render: (_, row) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-emerald-50 text-emerald-700 text-[9px] font-semibold">
                        {row.studentName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs font-medium text-slate-900">{row.studentName}</p>
                    <p className="text-[10px] text-slate-400">{row.department.split(" ")[0]}</p>
                </div>
            </div>
        )
    },
    {
        key: "title", label: "Achievement", render: (_, row) => (
            <div className="max-w-[200px]">
                <p className="text-xs font-medium text-slate-900 truncate">{row.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{row.date}</p>
            </div>
        )
    },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    {
        key: "points", label: "Points", render: (val) => (
            <span className="text-xs font-semibold text-emerald-700">{String(val)} pts</span>
        )
    },
    { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
    {
        key: "id", label: "Action", render: (_, row) => (
            <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-700">
                    <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" className="h-7 w-7 bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="outline" className="h-7 w-7 border-red-200 text-red-500 hover:bg-red-50">
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>
        )
    },
];

// â”€â”€ Chart data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const pieData = categoryStats.map((c) => ({ name: c.category, value: c.count }));
const areaData = monthlyStats.map((m) => ({ name: m.month, total: m.total, approved: m.approved, pending: m.pending }));
const barDataDept = departmentStats.map((d) => ({ name: d.department, Points: d.totalPoints, Achievements: d.totalAchievements * 30 }));
const barDataReview = monthlyStats.slice(-6).map((m) => ({
    name: m.month,
    Approved: m.approved,
    Pending: m.pending,
    Rejected: m.rejected,
}));

const menteeStats = students.slice(0, 4).map((s) => ({
    ...s,
    achievementCount: achievements.filter((a) => a.studentId === s.id).length,
    approved: achievements.filter((a) => a.studentId === s.id && a.status === "approved").length,
}));

export default function AdminDashboard() {
    const totalAchievements = achievements.length;
    const totalApproved = achievements.filter((a) => a.status === "approved").length;
    const totalStudents = 1200;
    const approvalRate = Math.round((totalApproved / totalAchievements) * 100);
    const totalReviewed = achievements.filter((a) => a.status !== "pending").length;

    return (
        <DashboardLayout user={currentAdmin} role="admin" pendingCount={pendingAchievements.length}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">System-wide overview, approvals, and analytics for NBA Criterion 4.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Total Students" value={totalStudents.toLocaleString()} icon={Users} color="violet" trend={5} trendLabel="vs last year" />
                <StatCard title="Total Achievements" value={totalAchievements} icon={Trophy} color="violet" trend={18} trendLabel="vs last month" />
                <StatCard title="Pending Approvals" value={pendingAchievements.length} icon={Clock} color="orange" />
                <StatCard title="Approval Rate" value={approvalRate} suffix="%" icon={TrendingUp} color="green" trend={2} trendLabel="vs last month" />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview">
                <TabsList className="mb-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="approvals">
                        Pending Approvals
                        {pendingAchievements.length > 0 && (
                            <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-[9px] font-bold">
                                {pendingAchievements.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* â”€â”€ OVERVIEW TAB â”€â”€ */}
                <TabsContent value="overview">
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
                                data={barDataDept}
                                bars={[
                                    { key: "Points", label: "Total Points", color: "#8b5cf6" },
                                    { key: "Achievements", label: "Achievements Ã—30", color: "#c4b5fd" },
                                ]}
                            />
                        </ChartWrapper>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-slate-800">Top Students</CardTitle>
                                <p className="text-xs text-slate-500">By total achievement points</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {topStudents.map((s, i) => (
                                    <div key={s.id} className="flex items-center gap-3">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 shrink-0">
                                            {i === 0 ? "ðŸ¥‡" : i === 1 ? "ðŸ¥ˆ" : i === 2 ? "ðŸ¥‰" : `#${i + 1}`}
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
                </TabsContent>

                {/* â”€â”€ APPROVALS TAB â”€â”€ */}
                <TabsContent value="approvals">
                    {/* Approval Stats */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                        <StatCard title="Awaiting Review" value={pendingAchievements.length} icon={Clock} color="orange" />
                        <StatCard title="Reviewed This Month" value={totalReviewed} icon={CheckCircle} color="green" trend={8} trendLabel="vs last month" />
                        <StatCard title="Students Monitored" value={students.length} icon={Users} color="violet" />
                        <StatCard title="Approval Rate" value="91" suffix="%" icon={TrendingUp} color="green" trend={3} trendLabel="vs last month" />
                    </div>

                    {/* Charts + Mentee Progress */}
                    <div className="grid gap-5 lg:grid-cols-3 mb-6">
                        <ChartWrapper title="Monthly Review Activity" description="Approval decisions per month" className="lg:col-span-2">
                            <CustomBarChart
                                data={barDataReview}
                                bars={[
                                    { key: "Approved", label: "Approved", color: "#10b981" },
                                    { key: "Pending", label: "Pending", color: "#f59e0b" },
                                    { key: "Rejected", label: "Rejected", color: "#ef4444" },
                                ]}
                            />
                        </ChartWrapper>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-slate-800">Student Progress</CardTitle>
                                <p className="text-xs text-slate-500">Achievement completion rate</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {menteeStats.map((s) => {
                                    const rate = s.achievementCount > 0 ? Math.round((s.approved / s.achievementCount) * 100) : 0;
                                    return (
                                        <div key={s.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="bg-emerald-50 text-emerald-700 text-[9px] font-semibold">
                                                            {s.name.split(" ").map((n) => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-medium text-slate-700">{s.name.split(" ")[0]}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-500">{rate}%</span>
                                            </div>
                                            <Progress value={rate} className="h-1.5" />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pending Approvals Table */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-800">All Achievement Submissions</CardTitle>
                            <p className="text-xs text-slate-500">Review and approve or reject student submissions</p>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={approvalColumns}
                                data={achievements}
                                searchable
                                searchKey="studentName"
                                searchPlaceholder="Search by student name..."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}
