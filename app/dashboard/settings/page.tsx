'use client'

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Shield, Zap, Mail, Settings } from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Mock settings state
    const [executiveMode, setExecutiveMode] = useState(true);
    const [autoDraft, setAutoDraft] = useState(true);
    const [dailyBriefing, setDailyBriefing] = useState(true);

    const handleSignOut = async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-end justify-between border-b border-border/40 pb-6 mt-12 sm:mt-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <Settings className="h-6 w-6 text-primary" />
                        Settings
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">Manage your executive profile and AI preferences.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Section - Spans full width on mobile, half on desktop */}
                <Card className="h-full">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold">Executive Profile</CardTitle>
                        <CardDescription>Account status and subscription.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-5 p-4 bg-secondary/20 rounded-lg border border-border/50">
                            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-medium tracking-tight">Executive User</h3>
                                <p className="text-sm text-muted-foreground mb-2">user@example.com</p>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10">PRO PLAN</Badge>
                                    <Badge variant="outline" className="text-xs">Administrator</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <Button variant="destructive" onClick={handleSignOut} disabled={loading} className="w-full sm:w-auto h-9 text-xs">
                                <LogOut className="mr-2 h-3.5 w-3.5" />
                                {loading ? 'Signing out...' : 'Sign Out'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Preferences */}
                <Card className="h-full">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold">AI Assistant Logic</CardTitle>
                        <CardDescription>Configure the autonomous behavior.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start justify-between space-x-4 p-3 hover:bg-secondary/30 rounded-lg transition-colors">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="executive-mode" className="font-medium flex items-center gap-2 text-sm">
                                    <Shield className="h-4 w-4 text-primary" />
                                    Executive Guardrails
                                </Label>
                                <span className="text-xs text-muted-foreground leading-relaxed">Enforce strict professional tone and safety checks.</span>
                            </div>
                            <Switch id="executive-mode" checked={executiveMode} onCheckedChange={setExecutiveMode} />
                        </div>

                        <div className="flex items-start justify-between space-x-4 p-3 hover:bg-secondary/30 rounded-lg transition-colors">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="auto-draft" className="font-medium flex items-center gap-2 text-sm">
                                    <Zap className="h-4 w-4 text-amber-500" />
                                    Auto-Draft Incoming
                                </Label>
                                <span className="text-xs text-muted-foreground leading-relaxed">Generate drafts for high-priority emails automatically.</span>
                            </div>
                            <Switch id="auto-draft" checked={autoDraft} onCheckedChange={setAutoDraft} />
                        </div>

                        <div className="flex items-start justify-between space-x-4 p-3 hover:bg-secondary/30 rounded-lg transition-colors">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="daily-briefing" className="font-medium flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                    Morning Briefing
                                </Label>
                                <span className="text-xs text-muted-foreground leading-relaxed">Receive a summary of urgent items at 8:00 AM.</span>
                            </div>
                            <Switch id="daily-briefing" checked={dailyBriefing} onCheckedChange={setDailyBriefing} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
