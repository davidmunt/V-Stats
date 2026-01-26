import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Player, PlayerRole } from "@/interfaces/player.interface";

// Función auxiliar para colores según la posición
const getRoleColor = (role: PlayerRole) => {
  const colors = {
    SETTER: "bg-purple-100 text-purple-700 border-purple-200",
    MIDDLE: "bg-orange-100 text-orange-700 border-orange-200",
    OUTSIDE: "bg-blue-100 text-blue-700 border-blue-200",
    OPPOSITE: "bg-green-100 text-green-700 border-green-200",
    LIBERO: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  return colors[role] || "bg-gray-100 text-gray-700";
};

// --- SUB-COMPONENTE: JUGADOR ARRASTRABLE (DRAGGABLE) ---
interface DraggablePlayerProps {
  player: Player;
}

const DraggablePlayer = ({ player }: DraggablePlayerProps) => {
  // Hook para hacer que el jugador se pueda arrastrar
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id_player, // El ID del draggable es el ID del jugador
    data: { player }, // Pasamos el objeto del jugador en la "mochila" del evento drag
  });

  // Estilo que mueve el componente por la pantalla siguiendo el ratón
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners} // Eventos del ratón (click y arrastre)
      {...attributes} // Atributos de accesibilidad para dnd-kit
      className={`
        flex items-center gap-2 p-2 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing bg-white
        ${isDragging ? "opacity-50 scale-105 shadow-xl z-50" : "hover:bg-gray-50"}
        ${getRoleColor(player.role)}
      `}
    >
      <div className="w-8 h-8 rounded-full bg-white border border-gray-300 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-gray-500 text-xs">
        {player.image ? <img src={player.image} alt={player.name} className="w-full h-full object-cover" /> : `#${player.dorsal}`}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-gray-900 truncate">{player.name}</div>
        <div className="text-[10px] uppercase font-bold text-gray-500">{player.role}</div>
      </div>
      <div className="font-black text-lg px-2 text-gray-400">⋮⋮</div> {/* Icono de agarre */}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL: EL BANQUILLO ---
interface PlayerBenchProps {
  allPlayers: Player[];
  lineupState: Record<number, Player | null>;
}

export const PlayerBench = ({ allPlayers, lineupState }: PlayerBenchProps) => {
  // 1. Hook para que el banquillo sea una zona donde soltar (para devolver jugadores)
  const { isOver, setNodeRef } = useDroppable({
    id: "bench", // ID especial para identificar el banquillo
  });

  // 2. Filtramos: ¿Qué IDs están ya en la pista?
  const playerIdsOnCourt = Object.values(lineupState)
    .filter((p): p is Player => p !== null)
    .map((p) => p.id_player);

  // 3. Los jugadores del banquillo son los que NO están en la pista
  const benchPlayers = allPlayers.filter((p) => !playerIdsOnCourt.includes(p.id_player));

  return (
    <div
      ref={setNodeRef} // El div entero escucha si le sueltan jugadores encima
      className={`
        bg-gray-50 p-6 rounded-2xl border-2 transition-colors min-h-[300px]
        ${isOver ? "border-red-400 bg-red-50" : "border-gray-200"}
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span>🪑</span> Banquillo (Disponibles)
        </h3>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full font-bold">{benchPlayers.length} jugadores</span>
      </div>

      {benchPlayers.length === 0 ? (
        <div className="text-center text-gray-400 text-sm mt-10">Toda la plantilla está en la pista.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {benchPlayers
            .sort((a, b) => a.dorsal - b.dorsal) // Ordenamos por dorsal
            .map((player) => (
              <DraggablePlayer key={player.id_player} player={player} />
            ))}
        </div>
      )}

      {/* Mensaje visual si estás arrastrando sobre el banquillo */}
      {isOver && (
        <div className="absolute inset-0 bg-red-100/80 backdrop-blur-sm flex items-center justify-center rounded-2xl border-2 border-red-500 z-10">
          <span className="font-bold text-red-700 text-lg">Soltar aquí para quitar de la pista</span>
        </div>
      )}
    </div>
  );
};
