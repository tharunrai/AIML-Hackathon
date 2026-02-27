"use client";

import {
    Trophy,
    Clock,
    CheckCircle,
    XCircle,
    Star,
    TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable, StatusBadge, CategoryBadge, Column } from "@/components/shared/DataTable";
import { ChartWrapper, CustomAreaChart, CustomPieChart } from "@/components/shared/ChartComponents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currentStudent, myAchievements, monthlyStats, categoryStats } from "@/lib/dummy-data";
import { Achievement } from "@/types";

const columns: Column<Achievement>[] = [
    {
        key: "title", label: "Achievement", sortable: true, render: (_, row) => (
            <div className="max-w-xs">
                <p className="text-xs font-medium text-slate-900 truncate">{row.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{row.date}</p>
            </div>
        )
    },
    { key: "category", label: "Category", render: (val) => <CategoryBadge category={String(val)} /> },
    {
        key: "points", label: "Points", sortable: true, render: (val) => (
            <span className="font-semibold text-blue-700 text-xs">{String(val)} pts</span>
        )
    },
    { key: "status", label: "Status", render: (_, row) => <StatusBadge status={row.status} /> },
];

export default function StudentDashboard() {
    const totalPoints = myAchievements.reduce((s, a) => s + (a.status === "approved" ? a.points : 0), 0);
    const approved = myAchievements.filter((a) => a.status === "approved").length;
    const pending = myAchievements.filter((a) => a.status === "pending").length;
    const rejected = myAchievements.filter((a) => a.status === "rejected").length;

    const areaData = monthlyStats.slice(-6).map((m) => ({
        name: m.month,
        total: m.total,
        approved: m.approved,
    }));

    const pieData = categoryStats.map((c) => ({ name: c.category, value: c.approved }));

    return (
        <DashboardLayout user={currentStudent} role="student" pendingCount={pending}>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-900">My Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Welcome back, {currentStudent.name.split(" ")[0]}! Here&apos;s your achievement summary.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard title="Total Points" value={totalPoints} icon={Star} color="blue" trend={12} trendLabel="vs last month" />
                <StatCard title="Approved" value={approved} icon={CheckCircle} color="green" trend={5} trendLabel="vs last month" />
                <StatCard title="Pending Review" value={pending} icon={Clock} color="orange" />
                <StatCard title="Rejected" value={rejected} icon={XCircle} color="red" />
            </div>

            {/* Charts Row */}
            <div className="grid gap-5 lg:grid-cols-3 mb-6">
                <ChartWrapper title="Achievement Trend" description="Monthly submission and approval trend" className="lg:col-span-2">
                    <CustomAreaChart
                        data={areaData}
                        areas={[
                            { key: "total", label: "Submitted", color: "#2563eb" },
                            { key: "approved", label: "Approved", color: "#10b981" },
                        ]}
                    />
                </ChartWrapper>
                <ChartWrapper title="By Category" description="Approved achievements per category">
                    <CustomPieChart data={pieData} height={240} innerRadius={50} />
                </ChartWrapper>
            </div>

            {/* Recent Achievements */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-800">My Achievements</CardTitle>
                        <p className="text-xs text-slate-500 mt-0.5">All submitted achievements and their status</p>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-[10px]">
                        {myAchievements.length} Total
                    </Badge>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={myAchievements}
                        searchable
                        searchKey="title"
                        searchPlaceholder="Search achievements..."
                        pageSize={5}
                    />
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
