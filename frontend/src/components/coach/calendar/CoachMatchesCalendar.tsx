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
    <div className="p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Mi Calendario de Partidos</h2>
        <p className="text-sm text-gray-500">Consulta las próximas fechas de tu equipo</p>
      </div>

      <div className="h-[600px] border rounded-lg p-2">
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
            noEventsInRange: "No hay partidos programados.",
          }}
          // DESHABILITADO: Eliminamos onSelectEvent para que no se pueda editar
          eventPropGetter={(event) => {
            const status = event.resource.status;
            let bgColor = "#3b82f6";
            if (status === "LIVE") bgColor = "#ef4444";
            if (status === "FINISHED") bgColor = "#10b981";

            return {
              style: {
                backgroundColor: bgColor,
                borderRadius: "6px",
                fontSize: "12px",
                border: "none",
                cursor: "default", // Cambiamos el cursor a flecha normal
              },
            };
          }}
        />
      </div>
    </div>
  );
};
