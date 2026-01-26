import { useDroppable } from "@dnd-kit/core";
import type { Player } from "@/interfaces/player.interface";

// --- SUB-COMPONENTE: LA CASILLA (ZONA DE SOLTADO) ---
interface CourtZoneProps {
  id: number;
  label: string;
  player: Player | null; // El jugador que está en esta posición (si lo hay)
}

const CourtZone = ({ id, label, player }: CourtZoneProps) => {
  // Hook de dnd-kit para convertir esta casilla en un destino válido
  const { isOver, setNodeRef } = useDroppable({
    id: `pos-${id}`, // Identificador único: pos-1, pos-2, etc.
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all h-24 w-full
        ${isOver ? "bg-blue-100 border-blue-500 shadow-lg" : "bg-white/90 border-dashed border-gray-300"}
        ${player ? "border-solid border-green-500 bg-green-50" : ""}
      `}
    >
      <span className="absolute top-1 left-2 text-xs font-bold text-gray-400">
        P{id} - {label}
      </span>

      {player ? (
        // Si hay un jugador asignado, mostramos su miniatura
        <div className="flex flex-col items-center mt-2 animate-fade-in">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200">
            {player.image ? (
              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center h-full text-xs font-bold text-gray-500">#{player.dorsal}</span>
            )}
          </div>
          <span className="text-xs font-bold text-gray-800 mt-1 truncate max-w-[80px]">{player.name}</span>
          <span className="text-[9px] text-gray-500 font-mono">#{player.dorsal}</span>
        </div>
      ) : (
        // Casilla vacía
        <span className="text-gray-300 text-sm font-medium mt-2">Vacío</span>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL: LA PISTA DE VOLEY ---

// El padre le pasará un objeto donde las claves son el nº de posición y el valor el Jugador (o null)
interface VolleyballCourtProps {
  lineupState: Record<number, Player | null>;
}

export const VolleyballCourt = ({ lineupState }: VolleyballCourtProps) => {
  return (
    <div className="bg-orange-100 p-6 rounded-2xl border-4 border-white shadow-inner relative overflow-hidden">
      {/* Visuales decorativos de la pista (Líneas) */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-500 tracking-widest">
        RED (NET)
      </div>
      <div className="absolute top-1/3 inset-x-0 h-0.5 bg-white opacity-60"></div> {/* Línea de 3 metros */}
      {/* Grid de Posiciones Oficiales de Voleibol (1-6) */}
      <div className="grid grid-cols-3 gap-4 mt-6 max-w-lg mx-auto">
        {/* Delanteros (Posiciones 4, 3, 2) */}
        <CourtZone id={4} label="Del. Izquierdo" player={lineupState[4] || null} />
        <CourtZone id={3} label="Central" player={lineupState[3] || null} />
        <CourtZone id={2} label="Del. Derecho" player={lineupState[2] || null} />

        {/* Zagueros (Posiciones 5, 6, 1) */}
        <CourtZone id={5} label="Zaguero Izq." player={lineupState[5] || null} />
        <CourtZone id={6} label="Zaguero C." player={lineupState[6] || null} />
        <CourtZone id={1} label="Saque/Zaguero D." player={lineupState[1] || null} />
      </div>
      {/* Zona Especial: Líbero (Posición 7) */}
      <div className="mt-8 pt-4 border-t-2 border-orange-200/50 flex justify-center">
        <div className="w-1/3">
          <CourtZone id={7} label="LÍBERO" player={lineupState[7] || null} />
        </div>
      </div>
    </div>
  );
};
