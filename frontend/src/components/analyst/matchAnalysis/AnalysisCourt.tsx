import { useEffect, useMemo } from "react";
import { PlayerNode } from "./Player";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import { getGamePhase } from "@/utils/courtPositioning";

interface AnalysisCourtProps {
  homeLineup: Record<number, LineupPosition | null>;
  awayLineup: Record<number, LineupPosition | null>;
  onPlayerClick: (position: LineupPosition, isHomeTeam: boolean, rect: DOMRect | null) => void;
}

export const AnalysisCourt = ({ homeLineup, awayLineup, onPlayerClick }: AnalysisCourtProps) => {
  const currentPhase = useMemo(() => {
    const history = JSON.parse(sessionStorage.getItem("vstats_last_actions") || "[]");
    return getGamePhase(history);
  }, [homeLineup]);

  const setterCurrentPos = useMemo(() => {
    const setterNode = Object.values(homeLineup).find((p) => p?.is_setter);
    return setterNode ? setterNode.current_position : 0;
  }, [homeLineup]);

  useEffect(() => {
    const history = JSON.parse(sessionStorage.getItem("vstats_last_actions") || "[]");
    const lastAction = history[0];
    if (currentPhase === "SERVE_OWN" && lastAction?.result === "++" && homeLineup[1]) {
      const timer = setTimeout(() => {
        console.log("Punto ganado: Auto-seleccionando sacador en P1");
        onPlayerClick(homeLineup[1]!, true, null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPhase, homeLineup, onPlayerClick]);

  return (
    <div className="relative w-full aspect-[18/11] bg-slate-100 rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden flex select-none p-4">
      <div className="absolute inset-y-0 left-1/2 w-4 bg-slate-800 shadow-2xl z-20 flex items-center justify-center">
        <div className="h-full w-px bg-white/20"></div>
        <span className="absolute rotate-90 whitespace-nowrap bg-slate-800 text-[9px] text-white px-4 py-1 rounded-full font-black tracking-[0.4em] uppercase">
          NET — NETWORK
        </span>
      </div>

      <div className="relative flex-1 grid grid-cols-2 grid-rows-3 gap-3 p-4 bg-blue-50/30 rounded-l-[2rem]">
        {[5, 4, 6, 3, 1, 2].map((pos) => (
          <div key={`home-${pos}`} className="flex justify-center items-center">
            <PlayerNode
              player={homeLineup[pos]}
              position={pos}
              isHome={true}
              onPlayerClick={onPlayerClick}
              phase={currentPhase}
              setterPos={setterCurrentPos}
            />
          </div>
        ))}
      </div>

      <div className="relative flex-1 grid grid-cols-2 grid-rows-3 gap-3 p-4 bg-rose-50/30 rounded-r-[2rem]">
        {[4, 5, 3, 6, 2, 1].map((pos) => (
          <div key={`away-${pos}`} className="flex justify-center items-center">
            <PlayerNode
              player={awayLineup[pos]}
              position={pos}
              isHome={false}
              onPlayerClick={onPlayerClick}
              phase={currentPhase}
              setterPos={0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
