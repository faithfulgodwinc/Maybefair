'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { EmailCard } from './email-card';
import { EmptyState } from './empty-state';

interface Email {
    id: string;
    subject: string;
    sender: string;
    snippet: string;
    category: string;
    received_at: string;
}

interface Draft {
    id: string;
    email_id: string;
    content: string;
    status: string;
    created_at: string;
}

export function EmailList({ emails, drafts }: { emails: Email[], drafts?: Draft[] }) {
    if (emails.length === 0) {
        return <EmptyState title="All caught up!" description="No new emails to process. Enjoy your day." />;
    }

    return (
        <motion.div
            className="space-y-4"
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08
                    }
                }
            }}
        >
            <AnimatePresence mode="popLayout">
                {emails.map((email) => {
                    const draft = drafts?.find(d => d.email_id === email.id);
                    return (
                        <motion.div
                            key={email.id}
                            variants={{
                                hidden: { opacity: 0, y: 20, scale: 0.98 },
                                show: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 }
                                }
                            }}
                            layout
                        >
                            <EmailCard email={email} initialDraft={draft} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
}

// Helper moved to EmailCard to avoid duplication or export it?
// It was internal, so EmailCard has its own copy now.

