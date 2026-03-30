import { useState, useEffect } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import Swal from "sweetalert2";

import { useNextMatchForCoachQuery } from "@/queries/match/useNextMatchForCoach";
import { usePlayersCoachQuery } from "@/queries/players/usePlayersCoach";
import { useCoachLineupQuery } from "@/queries/lineups/useCoachLineup";
import { useSaveLineupMutation } from "@/mutations/lineups/useSaveLineup";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor } from "@dnd-kit/core";
import type { Player } from "@/interfaces/player.interface";
import LoadingFallback from "@/components/LoadingFallback";

import { VolleyballCourt } from "./VolleyballCourt";
import { PlayerBench } from "./PlayerBench";

interface LineupManagerProps {
  coachSlug: string;
}

export const LineupManager = ({ coachSlug }: LineupManagerProps) => {
  const { data: currentUser } = useCurrentUserQuery();
  const { data: match, isLoading: isLoadingMatch } = useNextMatchForCoachQuery();
  const nextMatch = match || null;
  const { data: players, isLoading: isLoadingPlayers } = usePlayersCoachQuery(coachSlug);
  const { data: existingLineupData, isLoading: isLoadingLineup } = useCoachLineupQuery(
    nextMatch?.slug_match || "",
    currentUser?.slug_team || "",
  );
  const saveMutation = useSaveLineupMutation(nextMatch?.slug_match || "", coachSlug);
  const [lineupState, setLineupState] = useState<Record<number, Player | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
  });
  const [setterPos, setSetterPos] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requiere mover el ratón 5 píxeles para iniciar el Drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // En móviles, requiere mantener pulsado 150ms para arrastrar
        tolerance: 5, // Permite un ligero temblor del dedo sin cancelar el clic
      },
    }),
  );
  useEffect(() => {
    // 1. Solución error 'undefined': Verificamos existencia explícitamente
    if (!existingLineupData || !existingLineupData.positions || existingLineupData.positions.length === 0) {
      return;
    }

    const baseState: Record<number, Player | null> = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null };
    let foundSetterPos: number | null = null;

    existingLineupData.positions.forEach((pos) => {
      const positionKey = pos.current_position || pos.initial_position;
      if (positionKey >= 1 && positionKey <= 7) {
        baseState[positionKey] = {
          slug_player: pos.slug_player,
          name: pos.name,
          dorsal: pos.dorsal,
          role: pos.role,
          image: pos.image,
          slug: pos.slug_player,
          slug_team: existingLineupData.lineup.slug_team || "",
          status: "active",
          is_active: true,
        } as unknown as Player;

        if (pos.is_setter) {
          foundSetterPos = positionKey;
        }
      }
    });
    // 2. Solución error 'cascading renders':
    // En este caso es necesario para inicializar el componente con datos de la API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLineupState(baseState);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSetterPos(foundSetterPos);
  }, [existingLineupData]);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedPlayer = active.data.current?.player as Player;
    const fromPos = active.data.current?.fromPos; // Posición de origen (1-7 o 'bench')

    if (!draggedPlayer) return;

    setLineupState((prev) => {
      const newState = { ...prev };

      // 1. Limpiar la posición anterior del jugador en la pista (si estaba en una)
      Object.keys(newState).forEach((key) => {
        if (newState[Number(key)]?.slug_player === draggedPlayer.slug_player) {
          newState[Number(key)] = null;
        }
      });

      // 2. Si el destino es el banquillo, ya hemos terminado (al poner a null arriba)
      if (over.id === "bench") {
        // Si el jugador que quitamos era el setter, reseteamos setterPos
        if (fromPos === setterPos) setSetterPos(null);
        return newState;
      }

      // 3. Si el destino es una zona de la pista
      if (typeof over.id === "string" && over.id.startsWith("pos-")) {
        const targetPos = Number(over.id.split("-")[1]);

        // Si la posición de destino ya tenía un jugador, ese jugador "vuelve al banquillo"
        // (o podrías implementar un intercambio, pero por ahora vuelve al banquillo)
        newState[targetPos] = draggedPlayer;

        // Si movimos al jugador que era setter a una nueva posición, actualizamos la marca
        if (fromPos === setterPos) {
          setSetterPos(targetPos);
        }
      }

      return newState;
    });
  };
  const handleSave = async () => {
    // 1. Validaciones de posiciones completas (1-6)
    const missingPositions = [1, 2, 3, 4, 5, 6].filter((pos) => !lineupState[pos]);
    if (missingPositions.length > 0) {
      return Swal.fire({ title: "Incompleto", text: "Faltan jugadores en posiciones 1-6", icon: "warning" });
    }

    // 2. Validación de Colocador
    if (!setterPos || !lineupState[setterPos]) {
      return Swal.fire({ title: "Falta Colocador", text: "Haz clic en un jugador para marcarlo como Colocador", icon: "info" });
    }

    // --- LÓGICA DINÁMICA 5-1 ---

    // Calculamos la posición DIAGONAL (Opuesta) al colocador
    // Regla: 1<->4, 2<->5, 3<->6
    const oppositePos = setterPos > 3 ? setterPos - 3 : setterPos + 3;

    // Filtramos los candidatos: Excluimos al Colocador, a su Opuesto y al Líbero (pos 7)
    const availableOptions: Record<string, string> = {};

    [1, 2, 3, 4, 5, 6].forEach((pos) => {
      const player = lineupState[pos];
      // Solo permitimos elegir a los que NO son ni el colocador ni su opuesto
      if (player && pos !== setterPos && pos !== oppositePos) {
        availableOptions[player.slug_player] = `${player.name} (P-${pos})`;
      }
    });

    // 3. Lanzar el Swal con los 4 jugadores restantes (Normalmente los 2 Centrales y 2 Puntas)
    const { value: liberoTarget } = await Swal.fire({
      title: "Configuración de Líbero",
      text: `El Colocador está en ${setterPos} y su Opuesto en ${oppositePos}. ¿Por qué jugador entrará el líbero?`,
      input: "radio",
      inputOptions: availableOptions,
      inputValidator: (value) => {
        if (!value) return "¡Debes elegir un jugador!";
      },
      confirmButtonColor: "#3b82f6",
      showCancelButton: true,
    });

    if (!liberoTarget) return;

    // 4. Preparar el guardado
    const positionsToSave = Object.entries(lineupState)
      .filter(([, player]) => player !== null)
      .map(([pos, player]) => ({
        slug_player: player!.slug_player,
        position: Number(pos),
        is_setter: Number(pos) === setterPos,
        libero_swap_target: player!.slug_player === liberoTarget,
      }));

    try {
      await saveMutation.mutateAsync({
        slug_match: nextMatch!.slug_match,
        slug_team: currentUser?.slug_team || "",
        positions: positionsToSave,
      });
      Swal.fire({ title: "¡Guardado!", icon: "success", timer: 1500, showConfirmButton: false });
    } catch (error: unknown) {
      const errMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al guardar";
      Swal.fire({ title: "Error", text: errMsg, icon: "error" });
    }
  };
  if (isLoadingMatch || isLoadingPlayers || isLoadingLineup) return <LoadingFallback />;
  if (!nextMatch) return <div className="p-6 text-gray-500">No hay próximos partidos programados.</div>;
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="p-8 bg-slate-50/30 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Próximo Partido</h2>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{nextMatch.name}</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {new Date(nextMatch.date).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {saveMutation.isPending ? "Guardando..." : "Confirmar Titulares"}
        </button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <VolleyballCourt
              lineupState={lineupState}
              setterPos={setterPos}
              onSelectSetter={(pos) => {
                if (pos === 7) {
                  Swal.fire({
                    title: "Acción no permitida",
                    text: "El Líbero no puede ser el colocador del equipo.",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  return;
                }
                setSetterPos(pos);
              }}
            />
          </div>
          <div className="lg:col-span-5">
            <PlayerBench allPlayers={players || []} lineupState={lineupState} />
          </div>
        </div>
      </DndContext>
    </div>
  );
};
