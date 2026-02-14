'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, Mail, Calendar, User, Reply } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmailDetailModalProps {
    email: any;
    draft?: any;
    isOpen: boolean;
    onClose: () => void;
}

export function EmailDetailModal({ email, draft, isOpen, onClose }: EmailDetailModalProps) {
    const [emailBody, setEmailBody] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && email) {
            fetchEmailBody();
        }
    }, [isOpen, email]);

    const fetchEmailBody = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/gmail/email/${email.id}`);
            if (response.ok) {
                const data = await response.json();
                setEmailBody(data.body || email.snippet);
            } else {
                setEmailBody(email.snippet);
            }
        } catch (error) {
            console.error('Failed to fetch email body:', error);
            setEmailBody(email.snippet);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            urgent: 'bg-red-100 text-red-700 border-red-300',
            meeting_request: 'bg-blue-100 text-blue-700 border-blue-300',
            question: 'bg-purple-100 text-purple-700 border-purple-300',
            newsletter: 'bg-green-100 text-green-700 border-green-300',
            spam: 'bg-gray-100 text-gray-700 border-gray-300',
            other: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        };
        return colors[category] || colors.other;
    };

    if (!email) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-3xl max-h-[90vh] p-0 gap-0 rounded-2xl">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-border/40 bg-muted/30">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-xl font-semibold text-foreground leading-tight mb-2 break-words">
                                {email.subject}
                            </DialogTitle>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={getCategoryColor(email.category)}>
                                    {email.category.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono">
                                    {formatDate(email.received_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Email Content */}
                <ScrollArea className="flex-1 max-h-[calc(90vh-200px)]">
                    <div className="px-8 py-6 space-y-6">
                        {/* Sender Info */}
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="font-semibold text-foreground break-words">
                                        {email.sender.split('<')[0].trim()}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono break-all">
                                        &lt;{email.sender.split('<')[1]?.replace('>', '') || email.sender}&gt;
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    to me
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Email Body */}
                        <div className="w-full overflow-hidden">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed break-all overflow-wrap-anywhere w-full pr-2">
                                    {emailBody}
                                </div>
                            )}
                        </div>

                        {/* Draft Response Section */}
                        {draft && (
                            <>
                                <Separator className="my-6" />
                                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Reply className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                            Your AI-Generated Draft
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                            {draft.status}
                                        </Badge>
                                    </div>
                                    <div className="whitespace-pre-wrap text-sm text-blue-900/80 dark:text-blue-100/80 leading-relaxed font-mono break-words overflow-wrap-anywhere w-full">
                                        {draft.content}
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <Button size="sm" variant="default">
                                            Edit Draft
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Send Now
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
