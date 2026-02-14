'use client'

import { useState } from 'react';
import { DraftList } from './draft-list';
import { FileText, Clock, CheckCircle2, List } from 'lucide-react';

interface Draft {
    id: string;
    email_id: string;
    content: string;
    status: string;
    created_at: string;
}

type TabType = 'all' | 'pending' | 'sent';

export function DraftsClient({ drafts }: { drafts: Draft[] }) {
    const [activeTab, setActiveTab] = useState<TabType>('all');

    const pendingDrafts = drafts.filter(d => d.status === 'draft');
    const sentDrafts = drafts.filter(d => d.status === 'sent');

    const filteredDrafts =
        activeTab === 'pending' ? pendingDrafts :
            activeTab === 'sent' ? sentDrafts :
                drafts;

    const tabs = [
        { id: 'all' as TabType, label: 'All', icon: List, count: drafts.length },
        { id: 'pending' as TabType, label: 'Pending', icon: Clock, count: pendingDrafts.length },
        { id: 'sent' as TabType, label: 'Sent', icon: CheckCircle2, count: sentDrafts.length },
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-border/40 pb-6 mt-12 sm:mt-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        Drafts
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        All generated correspondence, pending and sent.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-md text-xs font-mono font-medium">
                        {drafts.length} TOTAL
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-border/30">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all
                                border-b-2 -mb-px
                                ${isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }
                            `}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                            <span className={`
                                ml-1 px-2 py-0.5 rounded-full text-xs font-mono
                                ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground'
                                }
                            `}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Draft List */}
            <div className="grid gap-6">
                <DraftList drafts={filteredDrafts} />
            </div>
        </div>
    );
}
