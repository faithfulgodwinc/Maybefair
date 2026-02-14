import { createClient } from "@/lib/supabase/server";
import { DraftsClient } from "@/components/dashboard/drafts-client";
import { redirect } from "next/navigation";

export default async function DraftsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch ALL drafts (both pending and sent)
    const { data: drafts, error } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false });

    return <DraftsClient drafts={drafts || []} />;
}
