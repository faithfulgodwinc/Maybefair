'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { checkGeminiModelsAction } from '@/app/actions/check-ai';

export function CheckAIButton() {
    const [models, setModels] = useState<string[]>([]);

    const handleCheck = async () => {
        const list = await checkGeminiModelsAction();
        setModels(list);
        alert(`Available Models:\n${list.join('\n')}`);
    };

    return (
        <Button onClick={handleCheck} variant="ghost" size="sm" className="text-xs text-gray-500">
            Check AI Models
        </Button>
    )
}
