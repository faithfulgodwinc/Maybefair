import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getUpcomingEventsAction } from "@/app/actions/calendar-ops";
import { Calendar as CalendarIcon, MapPin, Clock, CalendarDays } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default async function CalendarPage() {
    const { events, error } = await getUpcomingEventsAction();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-end justify-between border-b border-border/40 pb-6 mt-12 sm:mt-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <CalendarDays className="h-6 w-6 text-primary" />
                        Executive Calendar
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">Your upcoming scheduled engagements.</p>
                </div>
                <div className="bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-md text-xs font-mono font-medium">
                    {events?.length || 0} UPCOMING
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm mb-6">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events && events.length > 0 ? (
                    events.map((event) => (
                        <Card key={event.id} className="group hover:shadow-md transition-all duration-200 border border-border/60 hover:border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Badge variant="outline" className="text-[10px] font-mono font-normal text-muted-foreground tracking-wider uppercase border-border/60 bg-secondary/10">
                                    Event
                                </Badge>
                                {new Date(event.start.dateTime || event.start.date || '').getDate() === new Date().getDate() && (
                                    <Badge className="bg-primary/90 hover:bg-primary text-[10px] font-mono">TODAY</Badge>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-3 pt-2">
                                <div>
                                    <h3 className="text-base font-semibold leading-tight text-foreground line-clamp-2 min-h-[3rem]">
                                        {event.summary}
                                    </h3>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-border/30">
                                    <div className="flex items-center text-sm font-medium text-foreground/80">
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                        {new Date(event.start.dateTime || event.start.date || '').toLocaleDateString(undefined, {
                                            weekday: 'short', month: 'short', day: 'numeric'
                                        })}
                                    </div>

                                    <div className="flex items-center text-xs text-muted-foreground font-mono">
                                        <Clock className="mr-2 h-3.5 w-3.5" />
                                        {event.start.dateTime ? (
                                            <>
                                                {new Date(event.start.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                {' - '}
                                                {new Date(event.end.dateTime || '').toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </>
                                        ) : (
                                            'All Day'
                                        )}
                                    </div>

                                    {event.location && (
                                        <div className="flex items-center text-xs text-muted-foreground truncate pt-0.5">
                                            <MapPin className="mr-2 h-3.5 w-3.5" />
                                            {event.location}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center">
                        <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarDays className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground font-medium">No upcoming events found.</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Your schedule is clear for now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
