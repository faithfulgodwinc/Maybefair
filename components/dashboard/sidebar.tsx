'use client'

import { Inbox, FileText, Send, Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/dashboard/sign-out-button';
import { CheckAIButton } from '@/components/dashboard/check-ai-button';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-sidebar h-full fixed left-0 top-0 z-50 border-r border-border flex flex-col
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                md:w-16 md:translate-x-0
                lg:w-64
            `}>
                <div className="h-14 flex items-center justify-center md:justify-start md:px-6 lg:px-6 border-b border-border/40 bg-sidebar/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 bg-primary text-primary-foreground rounded-sm flex items-center justify-center font-bold text-xs">M</div>
                        <span className="md:hidden lg:block font-medium text-sm tracking-tight text-foreground">MAYBEFAIR</span>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-0.5">
                    <div className="px-3 mb-2 md:hidden lg:block">
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
                            className="w-full justify-start h-11 md:h-9 px-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors touch-manipulation"
                            asChild={!!item.href}
                            onClick={onClose}
                        >
                            {item.href ? (
                                <a href={item.href} className="flex items-center">
                                    <item.icon className="h-5 w-5 md:h-4 md:w-4 mr-3 opacity-70" />
                                    <span className="md:hidden lg:block text-sm font-medium">{item.label}</span>
                                </a>
                            ) : (
                                <div className="cursor-pointer flex items-center">
                                    <item.icon className="h-5 w-5 md:h-4 md:w-4 mr-3 opacity-70" />
                                    <span className="md:hidden lg:block text-sm font-medium">{item.label}</span>
                                </div>
                            )}
                        </Button>
                    ))}

                    <div className="px-3 mt-8 mb-2 md:hidden lg:block">
                        <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">System</span>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-11 md:h-9 px-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors touch-manipulation"
                        asChild
                        onClick={onClose}
                    >
                        <a href="/dashboard/settings" className="flex items-center">
                            <Settings className="h-5 w-5 md:h-4 md:w-4 mr-3 opacity-70" />
                            <span className="md:hidden lg:block text-sm font-medium">Settings</span>
                        </a>
                    </Button>
                </nav>

                <div className="p-4 border-t border-border/40 bg-sidebar/30">
                    <div className="space-y-2">
                        <div className="flex justify-center md:justify-start lg:justify-start w-full">
                            <CheckAIButton />
                        </div>
                        <div className="flex justify-center md:justify-start lg:justify-start w-full">
                            <SignOutButton />
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
