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

// Configuración del localizador para el calendario (Idioma Español)
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
    end: new Date(new Date(match.date).getTime() + 60 * 60 * 1000), // +1 hora
    resource: match,
  }));

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500">Error cargando el calendario de partidos.</div>;

  return (
    <div className="p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Calendario de Partidos</h2>
          <p className="text-sm text-gray-500">Gestiona la programación de la liga</p>
        </div>
        <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Programar Partido
        </button>
      </div>

      <div className="h-[600px] border rounded-lg p-2">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={[Views.MONTH, Views.AGENDA]} // Solo mes y agenda para administración
          culture="es"
          messages={{
            next: "Sig.",
            previous: "Ant.",
            today: "Hoy",
            month: "Mes",
            agenda: "Agenda",
            noEventsInRange: "No hay partidos en este rango.",
          }}
          // Al hacer click en un "cuadradito" (evento)
          onSelectEvent={(event) => onEdit(event.resource)}
          // Estilos personalizados para los eventos
          eventPropGetter={(event) => {
            const status = event.resource.status;
            let bgColor = "#3b82f6"; // Blue 500 por defecto (SCHEDULED)
            if (status === "LIVE") bgColor = "#ef4444"; // Red 500
            if (status === "FINISHED") bgColor = "#10b981"; // Green 500
            if (status === "CANCELLED") bgColor = "#6b7280"; // Gray 500

            return {
              style: {
                backgroundColor: bgColor,
                borderRadius: "4px",
                fontSize: "12px",
                border: "none",
              },
            };
          }}
        />
      </div>
    </div>
  );
};
