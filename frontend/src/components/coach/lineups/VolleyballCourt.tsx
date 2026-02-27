import { useDroppable } from "@dnd-kit/core";
import type { Player } from "@/interfaces/player.interface";

interface CourtZoneProps {
  id: number;
  label: string;
  player: Player | null;
}

const CourtZone = ({ id, label, player }: CourtZoneProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `pos-${id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
      relative flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all h-32 w-full
      ${isOver ? "bg-blue-50 border-blue-400 shadow-inner" : "bg-white border-dashed border-slate-200"}
      ${player ? "border-solid border-slate-100 shadow-md" : ""}
    `}
    >
      <span className="absolute top-2 left-3 text-[9px] font-black text-slate-300 uppercase tracking-tighter">
        Pos {id} — {label}
      </span>

      {player ? (
        <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 ring-1 ring-slate-100">
            {player.image ? (
              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center h-full text-xs font-black text-slate-400">#{player.dorsal}</span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-800 mt-2 truncate max-w-[90px]">{player.name}</span>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">#{player.dorsal}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center opacity-20">
          <div className="w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
            <span className="text-xl text-slate-300 font-light">+</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface VolleyballCourtProps {
  lineupState: Record<number, Player | null>;
}

export const VolleyballCourt = ({ lineupState }: VolleyballCourtProps) => {
  return (
    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/60 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-10 bg-slate-100 flex items-center justify-center border-b border-slate-200">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Plantilla Titular en Pista</span>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8 max-w-lg mx-auto">
        <CourtZone id={4} label="DEL. IZQ" player={lineupState[4] || null} />
        <CourtZone id={3} label="CENTRAL" player={lineupState[3] || null} />
        <CourtZone id={2} label="DEL. DER" player={lineupState[2] || null} />

        <div className="col-span-3 h-px bg-slate-200 my-2 opacity-50"></div>

        <CourtZone id={5} label="ZAG. IZQ" player={lineupState[5] || null} />
        <CourtZone id={6} label="CENTRAL" player={lineupState[6] || null} />
        <CourtZone id={1} label="SAQUE" player={lineupState[1] || null} />
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200 flex justify-center">
        <div className="w-1/2">
          <CourtZone id={7} label="LÍBERO" player={lineupState[7] || null} />
        </div>
      </div>
    </div>
  );
};
