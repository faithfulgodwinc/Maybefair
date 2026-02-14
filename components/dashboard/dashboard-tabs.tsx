'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailList } from '@/components/dashboard/email-list';
import { DraftList } from '@/components/dashboard/draft-list';
import { cn } from '@/lib/utils';

interface DashboardTabsProps {
    emails: any[];
    drafts: any[];
}

export function DashboardTabs({ emails, drafts }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState("all");

    const categorizedEmails = (category: string) =>
        (emails || []).filter((e) => e.category === category);

    const tabs = [
        { id: "all", label: "All" },
        { id: "urgent", label: "Urgent" },
        { id: "meeting_request", label: "Meetings" },
        { id: "question", label: "Questions" },
        { id: "newsletter", label: "Newsletters" },
        { id: "drafts", label: "Thinking Drafts" },
    ];

    return (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="relative">
                <TabsList className="bg-transparent border-b border-border/40 w-full justify-start h-auto p-0 gap-6 rounded-none">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className={cn(
                                "relative bg-transparent h-10 px-0 pb-3 text-sm font-medium transition-colors data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-primary/80 rounded-none border-b-2 border-transparent",
                                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <TabsContent value="all" className="mt-0 focus-visible:outline-none">
                        <EmailList emails={emails || []} drafts={drafts || []} />
                    </TabsContent>
                    <TabsContent value="urgent" className="mt-0 focus-visible:outline-none">
                        <EmailList emails={categorizedEmails('urgent')} drafts={drafts || []} />
                    </TabsContent>
                    <TabsContent value="meeting_request" className="mt-0 focus-visible:outline-none">
                        <EmailList emails={categorizedEmails('meeting_request')} drafts={drafts || []} />
                    </TabsContent>
                    <TabsContent value="question" className="mt-0 focus-visible:outline-none">
                        <EmailList emails={categorizedEmails('question')} drafts={drafts || []} />
                    </TabsContent>
                    <TabsContent value="newsletter" className="mt-0 focus-visible:outline-none">
                        <EmailList emails={categorizedEmails('newsletter')} drafts={drafts || []} />
                    </TabsContent>
                    <TabsContent value="drafts" className="mt-0 focus-visible:outline-none">
                        <DraftList drafts={drafts || []} />
                    </TabsContent>
                </motion.div>
            </AnimatePresence>
        </Tabs>
    );
}
