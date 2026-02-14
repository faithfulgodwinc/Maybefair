import { createClient } from "@/lib/supabase/server";
import { DraftList } from "@/components/dashboard/draft-list";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";

export default async function DraftsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch drafts
    const { data: drafts, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-end justify-between border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        Drafts
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">Pending correspondence requiring your approval.</p>
                </div>
                <div className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-md text-xs font-mono font-medium">
                    {drafts?.length || 0} PENDING
                </div>
            </div>

            <div className="grid gap-6">
                <DraftList drafts={drafts || []} />
            </div>
        </div>
    );
}
