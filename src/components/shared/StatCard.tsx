import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: number;
    trendLabel?: string;
    color?: "blue" | "green" | "orange" | "violet" | "red";
    suffix?: string;
}

const colorMap = {
    blue: {
        bg: "bg-blue-50",
        icon: "bg-blue-600",
        text: "text-blue-700",
    },
    green: {
        bg: "bg-emerald-50",
        icon: "bg-emerald-600",
        text: "text-emerald-700",
    },
    orange: {
        bg: "bg-orange-50",
        icon: "bg-orange-500",
        text: "text-orange-700",
    },
    violet: {
        bg: "bg-violet-50",
        icon: "bg-violet-600",
        text: "text-violet-700",
    },
    red: {
        bg: "bg-red-50",
        icon: "bg-red-500",
        text: "text-red-700",
    },
};

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    trendLabel,
    color = "blue",
    suffix,
}: StatCardProps) {
    const colors = colorMap[color];

    const TrendIcon =
        trend === undefined || trend === 0
            ? Minus
            : trend > 0
                ? TrendingUp
                : TrendingDown;

    const trendColor =
        trend === undefined || trend === 0
            ? "text-slate-500"
            : trend > 0
                ? "text-emerald-600"
                : "text-red-500";

    return (
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            {title}
                        </p>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold text-slate-900">{value}</p>
                            {suffix && (
                                <span className="text-sm font-medium text-slate-500">{suffix}</span>
                            )}
                        </div>
                        {(trend !== undefined || description) && (
                            <div className="flex items-center gap-1">
                                {trend !== undefined && (
                                    <>
                                        <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
                                        <span className={cn("text-xs font-medium", trendColor)}>
                                            {Math.abs(trend)}%
                                        </span>
                                    </>
                                )}
                                {trendLabel && (
                                    <span className="text-xs text-slate-400">{trendLabel}</span>
                                )}
                                {description && !trendLabel && (
                                    <span className="text-xs text-slate-500">{description}</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={cn("rounded-xl p-3", colors.bg)}>
                        <Icon className={cn("h-5 w-5", colors.text)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
