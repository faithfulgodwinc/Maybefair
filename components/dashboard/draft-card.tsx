'use client'

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { deleteDraftAction, sendDraftAction } from '@/app/actions/draft-ops';
import { Loader2, Send, Trash2, Edit2, Save, X } from 'lucide-react';
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal';

interface Draft {
    id: string;
    email_id: string;
    content: string;
    status: string;
    created_at: string;
}

export function DraftCard({ draft }: { draft: Draft }) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(draft.content);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { toast } = useToast();

    const handleDelete = async () => {
        setLoading(true);
        await deleteDraftAction(draft.id);
        setLoading(false);
        setShowDeleteModal(false);
        toast({
            title: "Draft deleted",
            description: "The draft has been permanently deleted.",
        })
    };

    const handleSend = async () => {
        setLoading(true);
        const result = await sendDraftAction(draft.id, content);
        setLoading(false);
        if (result.success) {
            toast({
                title: "Draft sent successfully!",
                description: `Mail successfully sent to ${result.recipient}`,
                variant: "default",
                className: "bg-green-50 border-green-200"
            });
        } else {
            toast({
                title: "Error sending draft",
                description: result.error,
                variant: "destructive",
            });
        }
    };

    if (draft.status === 'sent') {
        return (
            <Card className="border border-green-900/30 bg-green-900/10 opacity-75">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-bold text-muted-foreground font-mono">ID: {draft.email_id.substring(0, 8)}</CardTitle>
                        <Badge variant="default" className="bg-green-600 font-mono">SENT</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground/70 font-mono line-clamp-3">{content}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`relative transition-all duration-200 ${isEditing ? 'ring-1 ring-primary shadow-md' : 'shadow-none border border-border/60 hover:border-border'}`}>
            <CardHeader className="pb-3 pt-4 px-4 sm:px-5 border-b border-border/30">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {/* Status label handled by parent now or inside here differently? Keeping simple. */}
                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/80" />
                        <span className="text-xs font-semibold text-foreground/80 tracking-wide font-mono">
                            DRAFT RESP.
                        </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 touch-manipulation" onClick={() => setShowDeleteModal(true)} disabled={loading}>
                            <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 pt-4">
                {isEditing ? (
                    <Textarea
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        className="min-h-[200px] font-mono text-sm bg-background border-input focus:ring-primary/20 resize-none leading-relaxed p-4 shadow-inner"
                    />
                ) : (
                    <div className="whitespace-pre-wrap text-sm text-foreground/90 font-mono leading-relaxed p-2">
                        {content}
                    </div>
                )}

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-2">
                    <div className="text-[10px] text-muted-foreground font-medium">
                        <ClientDate date={draft.created_at} />
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={loading} className="h-11 sm:h-8 text-sm sm:text-xs flex-1 sm:flex-none touch-manipulation">
                                    <X className="mr-1.5 h-4 w-4 sm:h-3 sm:w-3" /> Cancel
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} disabled={loading} className="h-11 sm:h-8 text-sm sm:text-xs bg-sidebar-accent text-sidebar-foreground border border-border flex-1 sm:flex-none touch-manipulation">
                                    <Save className="mr-1.5 h-4 w-4 sm:h-3 sm:w-3" /> Save
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} disabled={loading} className="h-11 sm:h-8 text-sm sm:text-xs border-dashed flex-1 sm:flex-none touch-manipulation">
                                <Edit2 className="mr-1.5 h-4 w-4 sm:h-3 sm:w-3" /> Edit
                            </Button>
                        )}

                        <Button variant="default" size="sm" onClick={handleSend} disabled={loading} className="h-11 sm:h-8 text-sm sm:text-xs px-4 sm:px-4 shadow-sm hover:shadow-md transition-shadow bg-primary text-primary-foreground flex-1 sm:flex-none touch-manipulation">
                            {loading ? <Loader2 className="mr-1.5 h-4 w-4 sm:h-3 sm:w-3 animate-spin" /> : <Send className="mr-1.5 h-4 w-4 sm:h-3 sm:w-3" />}
                            Send Now
                        </Button>
                    </div>
                </div>
            </CardContent>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                loading={loading}
            />
        </Card>
    );
}

export function ClientDate({ date }: { date: string }) {
    const [formatted, setFormatted] = useState('');

    useEffect(() => {
        setFormatted(`Created: ${new Date(date).toLocaleString()}`);
    }, [date]);

    if (!formatted) return <span className="animate-pulse bg-gray-200 h-4 w-24 rounded inline-block" />;

    return <>{formatted}</>;
}
