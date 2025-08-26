import { CalendarView } from "@/src/components/calendar/calendar-view";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-sans">
          Calendario
        </h1>
        <p className="text-muted-foreground font-serif">
          Vista de calendario con todas las reservas
        </p>
      </div>

      <CalendarView />
    </div>
  );
}
