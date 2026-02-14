import { Inbox, FileText, Send, Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/dashboard/sign-out-button';
import { CheckAIButton } from '@/components/dashboard/check-ai-button';

export function Sidebar() {
    return (
        <aside className="w-16 md:w-64 bg-sidebar h-full fixed left-0 top-0 z-50 border-r border-border flex flex-col">
            <div className="h-14 flex items-center justify-center md:justify-start md:px-6 border-b border-border/40 bg-sidebar/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-primary text-primary-foreground rounded-sm flex items-center justify-center font-bold text-xs">M</div>
                    <span className="hidden md:block font-medium text-sm tracking-tight text-foreground">MAYBEFAIR</span>
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-0.5">
                <div className="px-3 mb-2 hidden md:block">
                    <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Workspace</span>
                </div>
                {[
                    { icon: Inbox, label: "Inbox", href: "/dashboard" },
                    { icon: FileText, label: "Drafts", href: "/dashboard/drafts" },
                    { icon: Send, label: "Sent", href: "/dashboard/sent" },
                    { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
                ].map((item, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start h-9 px-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        asChild={!!item.href}
                    >
                        {item.href ? (
                            <a href={item.href} className="flex items-center">
                                <item.icon className="h-4 w-4 mr-3 opacity-70" />
                                <span className="hidden md:block text-sm font-medium">{item.label}</span>
                            </a>
                        ) : (
                            <div className="cursor-pointer flex items-center">
                                <item.icon className="h-4 w-4 mr-3 opacity-70" />
                                <span className="hidden md:block text-sm font-medium">{item.label}</span>
                            </div>
                        )}
                    </Button>
                ))}

                <div className="px-3 mt-8 mb-2 hidden md:block">
                    <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">System</span>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start h-9 px-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    asChild
                >
                    <a href="/dashboard/settings" className="flex items-center">
                        <Settings className="h-4 w-4 mr-3 opacity-70" />
                        <span className="hidden md:block text-sm font-medium">Settings</span>
                    </a>
                </Button>
            </nav>

            <div className="p-4 border-t border-border/40 bg-sidebar/30">
                <div className="space-y-2">
                    <div className="flex justify-center md:justify-start w-full">
                        <CheckAIButton />
                    </div>
                    <div className="flex justify-center md:justify-start w-full">
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </aside>
    );
}
