'use client'

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PenTool, Loader2, Volume2, VolumeX } from 'lucide-react';
import { generateDraftAction } from '@/app/actions/generate-draft';
import { DraftCard } from './draft-card';
import { useSpeech } from '@/lib/hooks/use-speech';
import { EmailDetailModal } from './email-detail-modal';

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

export function EmailCard({ email, initialDraft }: { email: Email, initialDraft?: Draft }) {
    const [draft, setDraft] = useState<Draft | undefined>(initialDraft);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Text-to-speech hook
    const { speak, stop, isSpeaking, isSupported } = useSpeech();

    // Sync state if prop changes (e.g. after deletion/revalidation)
    useEffect(() => {
        setDraft(initialDraft);
    }, [initialDraft]);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await generateDraftAction(email.id);
            if (result.success && result.draft) {
                setDraft(result.draft as Draft);
            } else if (result.error) {
                alert(result.error);
            }
        } catch (error) {
            console.error("Failed to generate draft", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSpeak = () => {
        if (isSpeaking) {
            stop();
        } else {
            // Extract sender name (remove email address)
            const senderName = email.sender.split('<')[0].trim();

            // Compose the text to speak
            const textToSpeak = `Email from ${senderName}. Subject: ${email.subject}. ${email.snippet}`;

            speak(textToSpeak);
        }
    };

    return (
        <>
            <Card
                className="group relative overflow-hidden bg-card transition-all duration-200 hover:shadow-md border-border/60 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div className={`p-4 sm:p-5 transition-colors ${draft ? 'bg-muted/10' : ''}`}>
                    <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${getBadgeVariant(email.category) === 'destructive' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                {email.category.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono truncate">
                                <ClientDate date={email.received_at} />
                            </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            {/* Text-to-Speech Button */}
                            {isSupported && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent modal from opening
                                        handleSpeak();
                                    }}
                                    className={`h-9 w-9 sm:h-7 sm:w-7 p-0 transition-all touch-manipulation ${isSpeaking ? 'opacity-100 text-primary' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}
                                    aria-label={isSpeaking ? "Stop reading email" : "Read email aloud"}
                                >
                                    {isSpeaking ? (
                                        <VolumeX className="h-4 w-4 sm:h-3.5 sm:w-3.5 animate-pulse" />
                                    ) : (
                                        <Volume2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                                    )}
                                </Button>
                            )}

                            {/* Draft Button */}
                            {!draft && !loading && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent modal from opening
                                        handleGenerate();
                                    }}
                                    className="h-9 w-9 sm:h-7 sm:w-7 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
                                >
                                    <PenTool className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                                    <span className="sr-only">Draft Reply</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-1.5 mb-2">
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-base sm:text-base font-semibold text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2 pr-2">
                                {email.subject}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground/80 truncate">
                            {email.sender.split('<')[0]} <span className="text-xs font-normal text-muted-foreground/50 hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">&lt;{email.sender.split('<')[1]?.replace('>', '')}&gt;</span>
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-2 leading-relaxed max-w-prose">
                        {email.snippet}
                    </p>
                </div>

                {/* AI Draft Section - Integrated as a 'pad' */}
                {(draft || loading) && (
                    <div className="border-t border-border/50 bg-secondary/30 px-5 py-4">
                        {loading && (
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground animate-pulse py-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                                <span>ANALYZING & DRAFTING...</span>
                            </div>
                        )}
                        {draft && !loading && (
                            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Draft Reply</span>
                                    <div className="h-px bg-border flex-1 ml-4 opacity-50" />
                                </div>
                                <DraftCard draft={draft} />
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Email Detail Modal */}
            <EmailDetailModal
                email={email}
                draft={draft}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

function ClientDate({ date }: { date: string }) {
    const [formatted, setFormatted] = useState('');

    useEffect(() => {
        setFormatted(new Date(date).toLocaleString());
    }, [date]);

    if (!formatted) return <span className="animate-pulse bg-gray-200 h-4 w-24 rounded inline-block" />;

    return <>{formatted}</>;
}

function getBadgeVariant(category: string): "default" | "secondary" | "destructive" | "outline" {
    switch (category) {
        case 'urgent': return 'destructive';
        case 'meeting_request': return 'default';
        case 'question': return 'secondary';
        case 'newsletter': return 'outline';
        default: return 'outline';
    }
}
