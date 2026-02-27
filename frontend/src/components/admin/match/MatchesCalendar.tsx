import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useMatchesQuery } from "@/queries/match/useMatches";
import type { Match } from "@/interfaces/match.interface";
import LoadingFallback from "@/components/LoadingFallback";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface MatchesCalendarProps {
  leagueSlug: string;
  onCreate: () => void;
  onEdit: (match: Match) => void;
}

export const MatchesCalendar = ({ leagueSlug, onCreate, onEdit }: MatchesCalendarProps) => {
  const { data: matches, isLoading, isError } = useMatchesQuery(leagueSlug);

  const events = (matches || []).map((match) => ({
    title: match.name,
    start: new Date(match.date),
    end: new Date(new Date(match.date).getTime() + 60 * 60 * 1000),
    resource: match,
  }));

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando el calendario de partidos.</div>;

  return (
    <div className="p-8 rounded-3xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Calendario de Partidos</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Visualización mensual y agenda de los próximos encuentros.</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95"
        >
          <span className="text-xl leading-none">+</span> Programar Partido
        </button>
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
              noEventsInRange: "No hay partidos en este rango.",
            }}
            onSelectEvent={(event) => onEdit(event.resource)}
            eventPropGetter={(event) => {
              const status = event.resource.status;
              let bgColor = "#3b82f6";
              if (status === "LIVE") bgColor = "#ef4444";
              if (status === "FINISHED") bgColor = "#10b981";
              if (status === "CANCELLED") bgColor = "#94a3b8";

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
                },
              };
            }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 px-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Programado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">En Vivo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Finalizado</span>
        </div>
      </div>
    </div>
  );
};
