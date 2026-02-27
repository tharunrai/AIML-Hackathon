"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell,
    Search,
    User,
    LogOut,
    Settings,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User as UserType } from "@/types";

interface NavbarProps {
    user: UserType;
    pendingCount?: number;
}

export function Navbar({ user, pendingCount = 0 }: NavbarProps) {
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    const roleTheme = {
        student: {
            logo: "bg-blue-600",
            badge: "bg-blue-600 hover:bg-blue-600",
            avatar: "bg-blue-100 text-blue-700",
        },
        faculty: {
            logo: "bg-emerald-600",
            badge: "bg-emerald-600 hover:bg-emerald-600",
            avatar: "bg-emerald-100 text-emerald-700",
        },
        admin: {
            logo: "bg-violet-600",
            badge: "bg-violet-600 hover:bg-violet-600",
            avatar: "bg-violet-100 text-violet-700",
        },
    };

    const theme = roleTheme[user.role as keyof typeof roleTheme] || roleTheme.student;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="flex h-16 items-center gap-4 px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mr-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.logo}`}>
                        <span className="text-xs font-bold text-white">NBA</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">
                            Criterion 4
                        </p>
                        <p className="text-[10px] text-slate-500 leading-tight">
                            Achievement System
                        </p>
                    </div>
                </Link>

                {/* Search */}
                <div className="relative flex-1 max-w-sm hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search achievements..."
                        className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm focus:bg-white"
                    />
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
                        <Bell className="h-4 w-4 text-slate-600" />
                        {pendingCount > 0 && (
                            <Badge className={`absolute -top-1 -right-1 h-4 w-4 p-0 text-[9px] flex items-center justify-center text-white ${theme.badge}`}>
                                {pendingCount}
                            </Badge>
                        )}
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 h-9 px-2"
                            >
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback className={`${theme.avatar} text-xs font-semibold`}>
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-medium text-slate-900 leading-tight">
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 capitalize leading-tight">
                                        {user.role}
                                    </p>
                                </div>
                                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-slate-500 font-normal">
                                    {user.email}
                                </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                asChild
                            >
                                <Link href="/login">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
