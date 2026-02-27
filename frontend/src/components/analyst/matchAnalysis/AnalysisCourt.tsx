import { PlayerNode } from "./Player";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";

interface AnalysisCourtProps {
  homeLineup: Record<number, LineupPosition | null>;
  awayLineup: Record<number, LineupPosition | null>;
  onPlayerClick: (position: LineupPosition, isHomeTeam: boolean) => void;
}

export const AnalysisCourt = ({ homeLineup, awayLineup, onPlayerClick }: AnalysisCourtProps) => {
  return (
    <div className="relative w-full aspect-[18/11] bg-slate-100 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex select-none p-4">
      <div className="absolute inset-y-0 left-1/2 w-4 bg-slate-800 shadow-2xl z-20 flex items-center justify-center">
        <div className="h-full w-px bg-white/20"></div>
        <span className="absolute rotate-90 whitespace-nowrap bg-slate-800 text-[9px] text-white px-4 py-1 rounded-full font-black tracking-[0.4em] uppercase">
          NET — NETWORK
        </span>
      </div>

      <div className="relative flex-1 grid grid-cols-2 grid-rows-3 gap-3 p-4 bg-blue-50/30 rounded-l-[2rem]">
        {[4, 3, 5, 2, 6, 1].map((pos) => (
          <div key={`home-${pos}`} className="flex justify-center items-center">
            <PlayerNode player={homeLineup[pos]} position={pos} isHome={true} onPlayerClick={onPlayerClick} />
          </div>
        ))}
      </div>

      <div className="relative flex-1 grid grid-cols-2 grid-rows-3 gap-3 p-4 bg-rose-50/30 rounded-r-[2rem]">
        {[3, 2, 4, 1, 5, 6].map((pos) => (
          <div key={`away-${pos}`} className="flex justify-center items-center">
            <PlayerNode player={awayLineup[pos]} position={pos} isHome={false} onPlayerClick={onPlayerClick} />
          </div>
        ))}
      </div>
    </div>
  );
};
