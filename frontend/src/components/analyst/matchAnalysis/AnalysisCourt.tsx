import { PlayerNode } from "./Player";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";

interface AnalysisCourtProps {
  homeLineup: Record<number, LineupPosition | null>;
  awayLineup: Record<number, LineupPosition | null>;
  onPlayerClick: (position: LineupPosition, isHomeTeam: boolean) => void;
}

export const AnalysisCourt = ({ homeLineup, awayLineup, onPlayerClick }: AnalysisCourtProps) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[18/11] bg-orange-100 border-4 border-white rounded-3xl shadow-2xl overflow-hidden flex select-none">
      <div className="absolute inset-y-0 left-1/2 w-2 bg-gray-400/80 z-10 shadow-lg"></div>

      <div className="relative flex-1 grid grid-cols-2 gap-4 p-6">
        <div className="flex justify-center items-center">
          <PlayerNode player={homeLineup[4]} position={4} isHome={true} onPlayerClick={onPlayerClick} />
        </div>
        <div className="flex justify-center items-center border-r-2 border-white/30">
          <PlayerNode player={homeLineup[3]} position={3} isHome={true} onPlayerClick={onPlayerClick} />
        </div>

        <div className="flex justify-center items-center">
          <PlayerNode player={homeLineup[5]} position={5} isHome={true} onPlayerClick={onPlayerClick} />
        </div>
        <div className="flex justify-center items-center border-r-2 border-white/30">
          <PlayerNode player={homeLineup[2]} position={2} isHome={true} onPlayerClick={onPlayerClick} />
        </div>

        <div className="flex justify-center items-center">
          <PlayerNode player={homeLineup[6]} position={6} isHome={true} onPlayerClick={onPlayerClick} />
        </div>
        <div className="flex justify-center items-center border-r-2 border-white/30">
          <PlayerNode player={homeLineup[1]} position={1} isHome={true} onPlayerClick={onPlayerClick} />
        </div>
      </div>

      <div className="relative flex-1 grid grid-cols-2 gap-4 p-6">
        <div className="flex justify-center items-center border-l-2 border-white/30">
          <PlayerNode player={awayLineup[3]} position={3} isHome={false} onPlayerClick={onPlayerClick} />
        </div>
        <div className="flex justify-center items-center">
          <PlayerNode player={awayLineup[2]} position={2} isHome={false} onPlayerClick={onPlayerClick} />
        </div>

        <div className="flex justify-center items-center border-l-2 border-white/30">
          <PlayerNode player={awayLineup[4]} position={4} isHome={false} onPlayerClick={onPlayerClick} />
        </div>
        <div className="flex justify-center items-center">
          <PlayerNode player={awayLineup[1]} position={1} isHome={false} onPlayerClick={onPlayerClick} />
        </div>

        <div className="flex justify-center items-center border-l-2 border-white/30">
          <PlayerNode player={awayLineup[5]} position={5} isHome={false} onPlayerClick={onPlayerClick} />
        </div>
        <div className="flex justify-center items-center">
          <PlayerNode player={awayLineup[6]} position={6} isHome={false} onPlayerClick={onPlayerClick} />
        </div>
      </div>
    </div>
  );
};
