import type { LineupPosition } from "@/interfaces/lineupPosition.interface";

interface PlayerNodeProps {
  player: LineupPosition | null;
  position: number;
  isHome: boolean;
  onPlayerClick: (position: LineupPosition, isHomeTeam: boolean) => void;
}

export const PlayerNode = ({ player, position, isHome, onPlayerClick }: PlayerNodeProps) => {
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
      onClick={() => isHome && onPlayerClick(player, isHome)}
      className={`
      group relative w-16 h-16 rounded-3xl border-2 flex items-center justify-center transition-all active:scale-95 shadow-lg
      ${
        isHome
          ? "bg-white border-blue-100 text-blue-600 hover:border-blue-500 hover:shadow-blue-200/50 cursor-pointer"
          : "bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-default"
      }
    `}
    >
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-black absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-inherit shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          POS {position}
        </span>
        <span className="text-2xl font-black leading-none">{player?.dorsal || "??"}</span>
      </div>
    </button>
  );
};
