'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, TestTube2 } from 'lucide-react';

export default function TestClassifierPage() {
    const [subject, setSubject] = useState('');
    const [snippet, setSnippet] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ category: string; confidence: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTest = async () => {
        if (!subject.trim()) {
            setError('Please enter an email subject');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/test-classifier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, snippet }),
            });

            if (!response.ok) {
                throw new Error('Classification failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
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

    const testExamples = [
        { subject: 'Can we meet tomorrow at 3pm?', snippet: "I'd like to discuss the project timeline", expected: 'meeting_request' },
        { subject: 'URGENT: Server is down', snippet: 'Production server is not responding', expected: 'urgent' },
        { subject: 'Welcome to Supabase', snippet: 'Get started with your new project', expected: 'newsletter' },
        { subject: 'What is the status of the report?', snippet: 'I need an update on the quarterly report', expected: 'question' },
    ];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-end justify-between border-b border-border/40 pb-6 mt-12 sm:mt-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <TestTube2 className="h-6 w-6 text-primary" />
                        Email Classifier Test
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">Test Gemini AI classification manually</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Test Email Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Email Subject *</Label>
                        <Input
                            id="subject"
                            placeholder="e.g., Can we meet tomorrow at 3pm?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="snippet">Email Snippet (optional)</Label>
                        <Textarea
                            id="snippet"
                            placeholder="e.g., I'd like to discuss the project timeline and deliverables..."
                            value={snippet}
                            onChange={(e) => setSnippet(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <Button onClick={handleTest} disabled={loading} className="w-full">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Classifying...
                            </>
                        ) : (
                            'Classify Email'
                        )}
                    </Button>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Category:</span>
                                <Badge className={getCategoryColor(result.category)}>
                                    {result.category.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Confidence:</span>
                                <span className="text-sm font-mono">{(result.confidence * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Test Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {testExamples.map((example, idx) => (
                        <Button
                            key={idx}
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-3"
                            onClick={() => {
                                setSubject(example.subject);
                                setSnippet(example.snippet);
                            }}
                        >
                            <div className="flex-1">
                                <div className="font-medium text-sm">{example.subject}</div>
                                <div className="text-xs text-muted-foreground mt-1">{example.snippet}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Expected: <span className="font-mono">{example.expected}</span>
                                </div>
                            </div>
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
