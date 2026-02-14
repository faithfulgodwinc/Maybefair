import { DraftCard } from './draft-card';

interface Draft {
    id: string;
    email_id: string;
    content: string;
    status: string;
    created_at: string;
}

export function DraftList({ drafts }: { drafts: Draft[] }) {
    if (drafts.length === 0) {
        return <div className="p-8 text-center text-gray-500">No drafts yet. Generate one from the Inbox!</div>;
    }

    return (
        <div className="space-y-4">
            {drafts.map((draft) => (
                <DraftCard key={draft.id} draft={draft} />
            ))}
        </div>
    );
}
