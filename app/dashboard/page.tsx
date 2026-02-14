import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs';
import { SyncButton } from '@/components/dashboard/sync-button';

export default async function Dashboard() {
    const supabase = await createClient();

    // Securely check for user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/login');
    }

    // Fetch emails from Supabase
    const { data: emails } = await supabase
        .from('emails')
        .select('*')
        .order('received_at', { ascending: false });

    // Fetch drafts
    const { data: drafts } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false });

    const categorizedEmails = (category: string) =>
        (emails || []).filter((e) => e.category === category);

    return (
        <>
            <header className="flex justify-between items-end mb-8 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Executive Briefing</h1>
                    <p className="text-sm text-muted-foreground font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • Status: Online</p>
                </div>
                <div className="flex items-center gap-4">
                    <SyncButton />
                </div>
            </header>

            <DashboardTabs emails={emails || []} drafts={drafts || []} />
        </>
    );
}
