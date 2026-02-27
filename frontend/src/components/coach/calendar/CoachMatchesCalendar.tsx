import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useCoachMatchesQuery } from "@/queries/match/useCoachMatches";
import LoadingFallback from "@/components/LoadingFallback";

const locales = { es: es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export const CoachMatchesCalendar = ({ coachSlug }: { coachSlug: string }) => {
  const { data: matches, isLoading, isError } = useCoachMatchesQuery(coachSlug);

  const events = (matches || []).map((match) => ({
    title: match.name,
    start: new Date(match.date),
    end: new Date(new Date(match.date).getTime() + 60 * 60 * 1000),
    resource: match,
  }));

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando el calendario.</div>;

  return (
    <div className="p-8 bg-slate-50/30 rounded-3xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Calendario de Partidos</h2>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden p-6">
        <div className="h-[650px] calendar-fine-text">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={[Views.MONTH, Views.AGENDA]}
            culture="es"
            messages={{
              next: "Sig.",
              previous: "Ant.",
              today: "Hoy",
              month: "Mes",
              agenda: "Agenda",
              noEventsInRange: "No hay partidos programados en este rango.",
            }}
            eventPropGetter={(event) => {
              const status = event.resource.status;
              let bgColor = "#3b82f6";
              if (status === "LIVE") bgColor = "#ef4444";
              if (status === "FINISHED") bgColor = "#10b981";

              return {
                className: "shadow-sm border-none",
                style: {
                  backgroundColor: bgColor,
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "2px 6px",
                  cursor: "default",
                },
              };
            }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 px-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Próximos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-100"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">En Juego</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-100"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Finalizados</span>
        </div>
      </div>
    </div>
  );
};
