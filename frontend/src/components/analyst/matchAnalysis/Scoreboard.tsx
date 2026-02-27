import { useActualSetQuery } from "@/queries/set/useActualSet";
import { useMatchTeamsQuery } from "@/queries/match/useMatchTeams";
import { useAddPointMutation } from "@/mutations/actions/useAddPoint";
import { useDeleteLastPointMutation } from "@/mutations/actions/useDeleteLastPoint";
import LoadingFallback from "@/components/LoadingFallback";
import Swal from "sweetalert2";
import FinishedSets from "./FinishedSets";

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

  const handleAddPoint = async (teamSlug: string) => {
    try {
      await addPoint.mutateAsync({
        setSlug: actualSet.slug_set,
        slug_team: teamSlug,
        slug_point_for_team: teamSlug,
        action_type: "POINT_ADJUSTMENT",
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

  const handleRemovePoint = async (teamSlug: string) => {
    try {
      await deletePoint.mutateAsync({
        setSlug: actualSet.slug_set,
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
    <div className="bg-[#334155] text-white p-4 rounded-[2rem] shadow-xl border-b-4 border-blue-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>

      <div className="flex justify-between items-center max-w-6xl mx-auto relative z-10">
        {/* Equipo Local - Imagen maximizada */}
        <div className="flex flex-col items-start gap-2 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 overflow-hidden shadow-inner flex items-center justify-center">
              <img src={teamHome.image} alt={teamHome.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[13px] font-black uppercase tracking-wider text-blue-300 truncate max-w-[140px]">{teamHome.name}</span>
          </div>
          <div className="flex items-center gap-4 ml-1 mt-1">
            <button
              onClick={() => handleRemovePoint(teamHome.slug_team)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/40 text-red-400 border border-white/10 transition-all"
            >
              <span className="text-md">−</span>
            </button>
            <span className="text-5xl font-black tabular-nums tracking-tighter leading-none">{actualSet.local_points}</span>
            <button
              onClick={() => handleAddPoint(teamHome.slug_team)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 shadow-lg active:scale-90 transition-all text-xl"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center px-6 border-x border-white/10 mx-2">
          <span className="text-slate-400 font-black text-[9px] tracking-[0.2em] uppercase opacity-60">Set</span>
          <span className="text-4xl font-mono font-bold text-white italic leading-none mt-1">{actualSet.set_number}</span>
        </div>

        <div className="flex flex-col items-end gap-2 flex-1 text-right">
          <div className="flex flex-row-reverse items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 overflow-hidden shadow-inner flex items-center justify-center">
              <img src={teamAway.image} alt={teamAway.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[13px] font-black uppercase tracking-wider text-blue-300 truncate max-w-[140px]">{teamAway.name}</span>
          </div>
          <div className="flex flex-row-reverse items-center gap-4 mr-1 mt-1">
            <button
              onClick={() => handleRemovePoint(teamAway.slug_team)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-500/40 text-red-400 border border-white/10 transition-all"
            >
              <span className="text-md">−</span>
            </button>
            <span className="text-5xl font-black tabular-nums tracking-tighter leading-none">{actualSet.visitor_points}</span>
            <button
              onClick={() => handleAddPoint(teamAway.slug_team)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 shadow-lg active:scale-90 transition-all text-xl"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-white/5 flex justify-center opacity-80 scale-90">
        <FinishedSets matchSlug={matchSlug} />
      </div>
    </div>
  );
};
