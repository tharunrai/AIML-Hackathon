"use client";

import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AchievementCategory } from "@/types";
import { cn } from "@/lib/utils";

const categories: AchievementCategory[] = [
    "Academic",
    "Research",
    "Sports",
    "Cultural",
    "Co-Curricular",
    "Professional",
];

interface FormData {
    title: string;
    category: string;
    date: string;
    description: string;
    proof: string;
}

interface FormErrors {
    title?: string;
    category?: string;
    date?: string;
    description?: string;
}

const initialForm: FormData = {
    title: "",
    category: "",
    date: "",
    description: "",
    proof: "",
};

export function AchievementForm() {
    const [form, setForm] = useState<FormData>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.title.trim() || form.title.length < 5) {
            newErrors.title = "Title must be at least 5 characters.";
        }
        if (!form.category) {
            newErrors.category = "Please select a category.";
        }
        if (!form.date) {
            newErrors.date = "Achievement date is required.";
        }
        if (!form.description.trim() || form.description.length < 20) {
            newErrors.description = "Description must be at least 20 characters.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
    };

    const handleReset = () => {
        setForm(initialForm);
        setErrors({});
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="py-14 text-center space-y-3">
                    <div className="flex items-center justify-center">
                        <div className="bg-emerald-100 rounded-full p-4">
                            <CheckCircle className="h-10 w-10 text-emerald-600" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Achievement Submitted!</h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                        Your achievement has been submitted successfully and is pending faculty review.
                    </p>
                    <Button onClick={handleReset} variant="outline" className="mt-2">
                        Submit Another
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle className="text-base font-semibold">Submit New Achievement</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                    Fill in the details below. Your submission will be reviewed by faculty.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-medium text-slate-700">
                            Achievement Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., National Hackathon Winner – SIH 2024"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className={cn("h-9 text-sm", errors.title && "border-red-400 focus-visible:ring-red-400")}
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </div>

                    {/* Category + Date Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-slate-700">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.category}
                                onValueChange={(val) => setForm({ ...form, category: val })}
                            >
                                <SelectTrigger className={cn("h-9 text-sm", errors.category && "border-red-400")}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="text-sm">
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-xs font-medium text-slate-700">
                                Achievement Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className={cn("h-9 text-sm", errors.date && "border-red-400 focus-visible:ring-red-400")}
                            />
                            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-xs font-medium text-slate-700">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                            id="description"
                            placeholder="Describe your achievement in detail. Include context, significance, and outcomes..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={4}
                            className={cn(
                                "w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm resize-none",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                errors.description ? "border-red-400" : "border-slate-200"
                            )}
                        />
                        <div className="flex items-center justify-between">
                            {errors.description ? (
                                <p className="text-xs text-red-500">{errors.description}</p>
                            ) : (
                                <p className="text-xs text-slate-400">{form.description.length} / 500 characters</p>
                            )}
                        </div>
                    </div>

                    {/* Proof Upload (UI only) */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-slate-700">Supporting Document</Label>
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Submitting...
                                </span>
                            ) : (
                                "Submit Achievement"
                            )}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
