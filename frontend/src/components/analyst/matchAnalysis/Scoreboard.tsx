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
  const { data: lineups, isLoading: isLoadingLineups } = useMatchTeamsQuery(matchSlug);
  const addPoint = useAddPointMutation();
  const deletePoint = useDeleteLastPointMutation();

  if (isLoadingSet || isLoadingLineups) return <LoadingFallback />;
  if (!actualSet || !lineups || !lineups.home || !lineups.away) {
    return <div className="text-center p-4 bg-gray-100 rounded-lg">Cargando marcador y equipos...</div>;
  }

  const teamHome = lineups.home;
  const teamAway = lineups.away;

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
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-[2rem] shadow-2xl shadow-blue-900/20 border border-white/10">
      <div className="flex justify-between items-center max-w-6xl mx-auto gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 p-0.5 flex items-center justify-center shadow-lg shrink-0">
            <img src={teamHome.image} alt={teamHome.name} className="w-full h-full object-contain rounded-lg" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 leading-none">Local</span>
            <span className="text-[13px] font-black uppercase tracking-tight text-white truncate max-w-[120px]">{teamHome.name}</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => handleRemovePoint(teamHome.slug_team)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-red-500/40 text-white/70 hover:text-white transition-all active:scale-90 border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="text-4xl font-black tabular-nums tracking-tighter text-white leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)] w-10 text-center">
              {actualSet.local_points}
            </span>
            <button
              onClick={() => handleAddPoint(teamHome.slug_team)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-900/40 active:scale-95 transition-all border border-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 px-6 border-x border-white/10 shrink-0">
          <span className="text-white/60 font-black text-[9px] tracking-[0.2em] uppercase">Set</span>
          <span className="text-3xl font-black text-white italic leading-none">{actualSet.set_number}</span>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={() => handleAddPoint(teamAway.slug_team)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-900/40 active:scale-95 transition-all border border-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <span className="text-4xl font-black tabular-nums tracking-tighter text-white leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.2)] w-10 text-center">
              {actualSet.visitor_points}
            </span>
            <button
              onClick={() => handleRemovePoint(teamAway.slug_team)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-red-500/40 text-white/70 hover:text-white transition-all active:scale-90 border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-end min-w-0">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70 leading-none">Visitante</span>
            <span className="text-[13px] font-black uppercase tracking-tight text-white truncate max-w-[120px]">{teamAway.name}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 p-0.5 flex items-center justify-center shadow-lg shrink-0">
            <img src={teamAway.image} alt={teamAway.name} className="w-full h-full object-contain rounded-lg" />
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-white/10 flex justify-center">
        <FinishedSets matchSlug={matchSlug} />
      </div>
    </div>
  );
};
