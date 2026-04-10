import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Swal from "sweetalert2";

import { useAnalystMatchesQuery } from "@/queries/match/useAnalystMatches";
import LoadingFallback from "@/components/LoadingFallback";
import type { Match } from "@/interfaces/match.interface";

const locales = { es: es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: Match; // Aquí usamos tu interfaz Match
}

interface LeagueScoutingCalendarProps {
  // Esta función recibirá el slug del partido y el slug del equipo seleccionado
  onSelectMatch: (matchSlug: string, teamSlug: string) => void;
}

export const LeagueScoutingCalendar = ({ onSelectMatch }: LeagueScoutingCalendarProps) => {
  const { data: matches, isLoading, isError } = useAnalystMatchesQuery();

  const events = (matches || []).map((match) => ({
    title: match.name,
    start: new Date(match.date),
    end: new Date(match.date),
    resource: match,
  }));

  const handleSelectEvent = (event: CalendarEvent) => {
    const match: Match = event.resource;

    // Solo permitimos analizar partidos que no hayan terminado (o según tu lógica)
    // Pero aquí abrimos el modal para elegir equipo
    Swal.fire({
      title: "Seleccionar equipo para análisis",
      text: `¿A qué equipo quieres analizar en el partido ${match.name}?`,
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Local",
      denyButtonText: "Visitante",
      confirmButtonColor: "#3b82f6",
      denyButtonColor: "#1e293b",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Seleccionó Local
        onSelectMatch(match.slug_match, match.slug_team_local);
      } else if (result.isDenied) {
        // Seleccionó Visitante
        onSelectMatch(match.slug_match, match.slug_team_visitor);
      }
    });
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando partidos de la liga.</div>;

  return (
    <div className="p-8 bg-slate-50/30 rounded-3xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Scouting de Liga</h2>
        <p className="text-slate-500 text-sm mt-1">Selecciona un partido para iniciar el análisis táctico de un rival.</p>
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
            onSelectEvent={handleSelectEvent} // <--- IMPORTANTE: Al clicar, abre el modal
            messages={{
              next: "Sig.",
              previous: "Ant.",
              today: "Hoy",
              month: "Mes",
              agenda: "Agenda",
              noEventsInRange: "No hay partidos en este rango.",
            }}
            eventPropGetter={(event) => {
              const status = event.resource.status;
              let bgColor = "#64748b"; // Por defecto slate
              if (status === "live") bgColor = "#ef4444"; // Rojo para directo
              if (status === "finished") bgColor = "#10b981"; // Esmeralda para terminados
              if (status === "scheduled") bgColor = "#3b82f6"; // Azul para programados

              return {
                style: {
                  backgroundColor: bgColor,
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: "800",
                  padding: "4px 8px",
                  border: "none",
                  cursor: "pointer",
                },
              };
            }}
          />
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-6 px-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Programados</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">En Vivo</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Finalizados</span>
        </div>
      </div>
    </div>
  );
};
