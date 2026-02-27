import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Player, PlayerRole } from "@/interfaces/player.interface";

const getRoleColor = (role: PlayerRole) => {
  const colors = {
    SETTER: "border-l-purple-400 text-purple-700",
    MIDDLE: "border-l-orange-400 text-orange-700",
    OUTSIDE: "border-l-blue-400 text-blue-700",
    OPPOSITE: "border-l-green-400 text-green-700",
    LIBERO: "border-l-amber-400 text-amber-700",
  };
  return colors[role] || "border-l-slate-400 text-slate-700";
};

interface DraggablePlayerProps {
  player: Player;
}

const DraggablePlayer = ({ player }: DraggablePlayerProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.slug_player,
    data: { player },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
      flex items-center gap-4 p-3 rounded-2xl border border-slate-200 bg-white cursor-grab active:cursor-grabbing transition-all border-l-4
      ${isDragging ? "opacity-0 scale-95 shadow-none" : "hover:shadow-md hover:-translate-y-0.5 shadow-sm"}
      ${getRoleColor(player.role)}
    `}
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner">
        {player.image ? (
          <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-black text-slate-300">#{player.dorsal}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-slate-800 truncate">{player.name}</div>
        <div className="text-[9px] uppercase font-black tracking-widest opacity-60">
          #{player.dorsal} — {player.role}
        </div>
      </div>

      <div className="flex flex-col gap-0.5 opacity-20 group-hover:opacity-40">
        <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
        <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
        <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
      </div>
    </div>
  );
};

interface PlayerBenchProps {
  allPlayers: Player[];
  lineupState: Record<number, Player | null>;
}

export const PlayerBench = ({ allPlayers, lineupState }: PlayerBenchProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "bench",
  });

  const playerIdsOnCourt = Object.values(lineupState)
    .filter((p): p is Player => Boolean(p && p.slug_player))
    .map((p) => p.slug_player);

  const benchPlayers = (allPlayers || []).filter((p) => {
    if (!p || !p.slug_player) return false;
    return !playerIdsOnCourt.includes(p.slug_player);
  });

  return (
    <div
      ref={setNodeRef}
      className={`
      bg-slate-100/50 p-8 rounded-[2rem] border border-slate-200 transition-all min-h-[500px] relative
      ${isOver ? "bg-rose-50/50 border-rose-200" : ""}
    `}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Disponibles</h3>
          <p className="text-lg font-bold text-slate-800 tracking-tight">Banquillo</p>
        </div>
        <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-xl shadow-sm">
          {benchPlayers.length} REGISTROS
        </span>
      </div>

      {benchPlayers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-slate-400 text-sm font-medium italic px-4">Toda la plantilla está posicionada en la pista.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          {benchPlayers
            .sort((a, b) => (a.dorsal || 0) - (b.dorsal || 0))
            .map((player) => (player?.slug_player ? <DraggablePlayer key={player.slug_player} player={player} /> : null))}
        </div>
      )}

      {isOver && (
        <div className="absolute inset-0 bg-rose-50/90 backdrop-blur-[2px] flex items-center justify-center rounded-[2rem] border-2 border-dashed border-rose-400 z-50 animate-in fade-in duration-300">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-xl shadow-rose-200/50 flex items-center gap-3">
            <span className="text-2xl">↩</span>
            <span className="font-black text-rose-600 text-xs uppercase tracking-widest">Quitar de la pista</span>
          </div>
        </div>
      )}
    </div>
  );
};
