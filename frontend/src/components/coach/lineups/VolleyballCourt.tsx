import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Player } from "@/interfaces/player.interface";

interface CourtZoneProps {
  id: number;
  label: string;
  player: Player | null;
  isSetter: boolean;
  onSelect: (id: number) => void;
}

const CourtZone = ({ id, label, player, isSetter, onSelect }: CourtZoneProps) => {
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({ id: `pos-${id}` });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: player ? `draggable-${player.slug_player}` : `empty-${id}`,
    disabled: !player,
    data: { player, fromPos: id },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div
      ref={setDroppableRef}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all h-32 w-full
        ${isOver ? "bg-blue-50 border-blue-400 shadow-inner" : "bg-white border-dashed border-slate-200"}
        ${player ? (isSetter ? "border-amber-400 bg-amber-50/30" : "border-solid border-slate-100 shadow-md") : ""}
        ${isDragging ? "opacity-40" : ""}
      `}
    >
      <span className="absolute top-2 left-3 text-[9px] font-black text-slate-300 uppercase">
        Pos {id} — {label}
      </span>

      {player ? (
        <div
          ref={setDraggableRef}
          style={style}
          {...listeners}
          {...attributes}
          onClick={() => onSelect(id)}
          className="flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
        >
          {isSetter && (
            <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-sm z-10">
              SETTER
            </div>
          )}
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
