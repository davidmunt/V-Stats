import { useStatsQuery } from "@/queries/stats/useTeamStats";
import { HeatMap } from "./HeatMap";
import LoadingFallback from "@/components/LoadingFallback";
import { HeatMapAvantages } from "./HeatMapAvantages";
import { StatsTable } from "./StatsTable";

export const TeamStats = () => {
  const { data, isLoading, isError } = useStatsQuery();

  if (isLoading) return <LoadingFallback />;

  if (isError || !data) {
    return (
      <div className="p-12 text-center bg-red-50 rounded-3xl border border-red-100 text-red-600 font-bold">
        Error al cargar las estadísticas del equipo.
      </div>
    );
  }
  const { team_id, actions } = data;

  return (
    <div className="p-6 space-y-10">
      {/* SECCIÓN 1: LOS MAPAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HeatMap actions={actions} myTeamId={team_id} />
        <HeatMapAvantages actions={actions} myTeamId={team_id} />
      </div>

      <div className="w-full">
        <StatsTable actions={actions} myTeamId={team_id} />
      </div>
    </div>
  );
};
