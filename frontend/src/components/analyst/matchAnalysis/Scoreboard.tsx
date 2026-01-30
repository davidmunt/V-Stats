import { useActualSetQuery } from "@/queries/set/useActualSet";
import { useMatchTeamsQuery } from "@/queries/match/useMatchTeams";
import { useAddPointMutation } from "@/mutations/points/useAddPoint";
import { useDeleteLastPointMutation } from "@/mutations/points/useDeleteLastPoint";
import LoadingFallback from "@/components/LoadingFallback";
import Swal from "sweetalert2";

interface ScoreboardProps {
  matchSlug: string;
}

export const Scoreboard = ({ matchSlug }: ScoreboardProps) => {
  const { data: actualSet, isLoading: isLoadingSet } = useActualSetQuery(matchSlug);
  const { data: teams, isLoading: isLoadingTeams } = useMatchTeamsQuery(matchSlug);
  const addPoint = useAddPointMutation();
  const deletePoint = useDeleteLastPointMutation();

  if (isLoadingSet || isLoadingTeams) return <LoadingFallback />;
  if (!actualSet || !teams || teams.length < 2) {
    return <div className="text-center p-4 bg-gray-100 rounded-lg">Cargando marcador y equipos...</div>;
  }

  const teamHome = teams[0];
  const teamAway = teams[1];

  const handleAddPoint = async (teamId: string) => {
    try {
      await addPoint.mutateAsync({ setSlug: actualSet.slug, id_team: teamId, id_point_for_team: teamId, action_type: "POINT_ADJUSTMENT" });
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error";
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleRemovePoint = async (teamSlug: string) => {
    try {
      await deletePoint.mutateAsync({
        setSlug: actualSet.slug,
        teamSlug: teamSlug,
      });
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error";
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-b-4 border-blue-600">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="w-16 h-16 rounded-full bg-white/10 p-2 border border-white/20">
            <img src={teamHome.image} alt={teamHome.name} className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-sm uppercase tracking-wider text-center">{teamHome.name}</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleRemovePoint(teamHome.slug)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500 transition-colors text-red-500 hover:text-white"
            >
              -
            </button>
            <span className="text-6xl font-black tabular-nums">{actualSet.local_points}</span>
            <button
              onClick={() => handleAddPoint(teamHome.id_team)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-90 transition-transform text-2xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center px-10 border-x border-white/10">
          <span className="text-blue-400 font-bold text-xs tracking-widest uppercase">Set</span>
          <span className="text-5xl font-mono font-bold mt-1">{actualSet.set_number}</span>
        </div>

        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="w-16 h-16 rounded-full bg-white/10 p-2 border border-white/20">
            <img src={teamAway.image} alt={teamAway.name} className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-sm uppercase tracking-wider text-center">{teamAway.name}</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleAddPoint(teamAway.id_team)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-90 transition-transform text-2xl font-bold"
            >
              +
            </button>
            <span className="text-6xl font-black tabular-nums">{actualSet.visitor_points}</span>
            <button
              onClick={() => handleRemovePoint(teamAway.slug)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500 transition-colors text-red-500 hover:text-white"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
