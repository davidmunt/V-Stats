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
        w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg shadow-md transition-transform active:scale-95
        ${
          isHome
            ? "bg-blue-600 border-blue-800 text-white hover:bg-blue-700 cursor-pointer"
            : "bg-red-600 border-red-800 text-white opacity-80 cursor-default"
        }
      `}
    >
      {player.dorsal}
    </button>
  );
};
