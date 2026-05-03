import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import { getPlayerVisualOffset, type GamePhase } from "@/utils/courtPositioning";

interface PlayerNodeProps {
  player: LineupPosition | null;
  position: number;
  isHome: boolean;
  onPlayerClick: (position: LineupPosition, isHomeTeam: boolean, rect: DOMRect | null) => void;
  phase: GamePhase;
  setterPos: number;
}

export const PlayerNode = ({ player, position, isHome, onPlayerClick, phase, setterPos }: PlayerNodeProps) => {
  const isSetter = player?.is_setter || false;
  const isLibero = player?.initial_position == 7;
  const history = JSON.parse(sessionStorage.getItem("vstats_last_actions") || "[]");
  const lastResult = history[0]?.result;
  const isAutoSelected = phase === "SERVE_OWN" && position === 1 && isHome && lastResult === "++";
  const offsetStyle = isHome ? getPlayerVisualOffset(position, isSetter, phase, isHome, setterPos) : { transform: "translate(0%, 0%)" };

  if (!player) {
    return (
      <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-300">
        P{position}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => isHome && onPlayerClick(player, isHome, (e.currentTarget as HTMLButtonElement).getBoundingClientRect())}
      style={offsetStyle}
      className={`
      group relative w-16 h-16 rounded-3xl border-2 flex items-center justify-center shadow-lg
      transition-all duration-700 ease-in-out z-10 hover:z-30
      ${isAutoSelected ? "ring-4 ring-blue-500 animate-pulse shadow-blue-500/50" : ""}
      ${
        isHome
          ? isLibero
            ? "bg-purple-600 border-purple-500 text-white hover:shadow-purple-300/50 cursor-pointer active:scale-95"
            : "bg-white border-blue-100 text-blue-600 hover:border-blue-500 hover:shadow-blue-200/50 cursor-pointer active:scale-95"
          : "bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-default"
      }
      ${isSetter ? "ring-4 ring-amber-400 border-amber-400" : ""} 
    `}
    >
      {isSetter && (
        <span className="absolute -top-3 -right-2 bg-amber-400 text-white text-[8px] px-2 py-0.5 rounded-full font-black z-30 shadow-md">
          SETTER
        </span>
      )}
      {isAutoSelected && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] px-3 py-1 rounded-full font-black z-30 shadow-lg animate-bounce">
          SACADOR
        </span>
      )}
      {isLibero && (
        <span className="absolute -bottom-2 bg-purple-800 text-white text-[7px] px-2 py-0.5 rounded-full font-black z-30 uppercase tracking-wider">
          Líbero
        </span>
      )}

      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-inherit shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 text-slate-800">
          POS {position}
        </span>
        <span className="text-2xl font-black leading-none">{player?.dorsal || "??"}</span>
      </div>
    </button>
  );
};
