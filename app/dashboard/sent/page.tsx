import { createClient } from "@/lib/supabase/server";
import { DraftList } from "@/components/dashboard/draft-list";
import { redirect } from "next/navigation";
import { Send } from "lucide-react";

export default async function SentPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch sent items
    const { data: sentItems, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('status', 'sent')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-end justify-between border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <Send className="h-6 w-6 text-primary" />
                        Sent Archives
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">History of AI-drafted correspondence.</p>
                </div>
                <div className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-md text-xs font-mono font-medium">
                    {sentItems?.length || 0} MESSAGES
                </div>
            </div>

            <div className="grid gap-6">
                <DraftList drafts={sentItems || []} />
            </div>
        </div>
    );
}
