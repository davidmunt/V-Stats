import { useDroppable } from "@dnd-kit/core";
import type { Player } from "@/interfaces/player.interface";

interface CourtZoneProps {
  id: number;
  label: string;
  player: Player | null;
  isSetter: boolean;
  onSelect: (id: number) => void;
}

const CourtZone = ({ id, label, player, isSetter, onSelect }: CourtZoneProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: `pos-${id}` });

  return (
    <div
      ref={setNodeRef}
      onClick={() => player && onSelect(id)}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all h-32 w-full cursor-pointer
        ${isOver ? "bg-blue-50 border-blue-400 shadow-inner" : "bg-white border-dashed border-slate-200"}
        ${player ? (isSetter ? "border-amber-400 bg-amber-50/30" : "border-solid border-slate-100 shadow-md") : ""}
        ${isSetter ? "ring-2 ring-amber-400 ring-offset-2" : ""}
      `}
    >
      {/* Icono de Setter */}
      {isSetter && (
        <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-sm z-10 animate-bounce">
          SETTER
        </div>
      )}

      <span className="absolute top-2 left-3 text-[9px] font-black text-slate-300 uppercase tracking-tighter">
        Pos {id} — {label}
      </span>

      {player ? (
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full border-2 shadow-sm overflow-hidden flex items-center justify-center ${isSetter ? "border-amber-400" : "border-white bg-slate-100"}`}
          >
            {player.image ? (
              <img src={player.image} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-black">#{player.dorsal}</span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-800 mt-2">{player.name}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center opacity-20">
          <span className="text-xl">+</span>
        </div>
      )}
    </div>
  );
};

interface VolleyballCourtProps {
  lineupState: Record<number, Player | null>;
  setterPos: number | null;
  onSelectSetter: (pos: number) => void;
}

export const VolleyballCourt = ({ lineupState, setterPos, onSelectSetter }: VolleyballCourtProps) => {
  const renderZone = (id: number, label: string) => (
    <CourtZone id={id} label={label} player={lineupState[id]} isSetter={setterPos === id} onSelect={onSelectSetter} />
  );

  return (
    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative">
      <div className="grid grid-cols-3 gap-6 mt-8 max-w-lg mx-auto">
        {renderZone(4, "DEL. IZQ")}
        {renderZone(3, "CENTRAL")}
        {renderZone(2, "DEL. DER")}
        <div className="col-span-3 h-px bg-slate-200 my-2 opacity-50"></div>
        {renderZone(5, "ZAG. IZQ")}
        {renderZone(6, "CENTRAL")}
        {renderZone(1, "SAQUE")}
      </div>
      <div className="mt-10 pt-6 border-t border-slate-200 flex justify-center">
        <div className="w-1/2">{renderZone(7, "LÍBERO")}</div>
      </div>
    </div>
  );
};
