import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import Swal from "sweetalert2";

import { useNextMatchForCoachQuery } from "@/queries/match/useNextMatchForCoach";
import { usePlayersCoachQuery } from "@/queries/players/usePlayersCoach";
import { useCoachLineupQuery } from "@/queries/lineups/useCoachLineup";
import { useSaveLineupMutation } from "@/mutations/lineups/useSaveLineup";

import type { Player } from "@/interfaces/player.interface";
import LoadingFallback from "@/components/LoadingFallback";

import { VolleyballCourt } from "./VolleyballCourt";
import { PlayerBench } from "./PlayerBench";

interface LineupManagerProps {
  coachSlug: string;
}

export const LineupManager = ({ coachSlug }: LineupManagerProps) => {
  const { data: match, isLoading: isLoadingMatch } = useNextMatchForCoachQuery(coachSlug);
  const nextMatch = match || null;
  const { data: players, isLoading: isLoadingPlayers } = usePlayersCoachQuery(coachSlug);
  const { data: existingLineupData, isLoading: isLoadingLineup } = useCoachLineupQuery(nextMatch?.slug || "", coachSlug);
  const saveMutation = useSaveLineupMutation(nextMatch?.slug || "", coachSlug);
  const [lineupState, setLineupState] = useState<Record<number, Player | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
  });
  useEffect(() => {
    if (existingLineupData && existingLineupData.positions.length > 0) {
      const baseState: Record<number, Player | null> = {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
      };

      existingLineupData.positions.forEach((pos) => {
        if (pos.initial_position >= 1 && pos.initial_position <= 7) {
          baseState[pos.initial_position] = pos.player;
        }
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLineupState(baseState);
    }
  }, [existingLineupData]);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const draggedPlayer = active.data.current?.player as Player;
    if (!draggedPlayer) return;
    if (over.id === "bench") {
      setLineupState((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          if (newState[Number(key)]?.id_player === draggedPlayer.id_player) {
            newState[Number(key)] = null;
          }
        });
        return newState;
      });
      return;
    }
    if (typeof over.id === "string" && over.id.startsWith("pos-")) {
      const targetPos = Number(over.id.split("-")[1]);
      setLineupState((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          if (newState[Number(key)]?.id_player === draggedPlayer.id_player) {
            newState[Number(key)] = null;
          }
        });
        newState[targetPos] = draggedPlayer;
        return newState;
      });
    }
  };
  const handleSave = async () => {
    const missingPositions = [1, 2, 3, 4, 5, 6].filter((pos) => !lineupState[pos]);
    if (missingPositions.length > 0) {
      return Swal.fire({
        title: "Alineación Incompleta",
        text: `Te faltan jugadores en las posiciones: ${missingPositions.join(", ")}`,
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
    }
    const positionsToSave = Object.entries(lineupState)
      .filter((entry) => entry[1] !== null)
      .map(([pos, player]) => ({
        player_id: player!.id_player,
        position: Number(pos),
      }));
    try {
      await saveMutation.mutateAsync({
        matchSlug: nextMatch!.slug,
        teamSlug: coachSlug,
        positions: positionsToSave,
      });
      Swal.fire({
        title: "¡Todo Listo!",
        text: "La alineación titular se ha guardado correctamente para el partido.",
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const errMsg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Hubo un error al guardar la alineación.";
      Swal.fire({
        title: "Error",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };
  if (isLoadingMatch || isLoadingPlayers || isLoadingLineup) return <LoadingFallback />;
  if (!nextMatch) return <div className="p-6 text-gray-500">No hay próximos partidos programados.</div>;
  return (
    <div className="space-y-6">
      {/* Cabecera del Partido */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Próximo Partido</h2>
          <p className="text-gray-500">
            {nextMatch.name} - {new Date(nextMatch.date).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all disabled:opacity-50"
        >
          {saveMutation.isPending ? "Guardando..." : "Confirmar Titulares"}
        </button>
      </div>
      {/* ÁREA DE DRAG & DROP */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Izquierda: La Pista (Zonas de Soltado) */}
          <VolleyballCourt lineupState={lineupState} />
          {/* Derecha/Abajo: El Banquillo (Jugadores Arrastrables) */}
          <PlayerBench allPlayers={players || []} lineupState={lineupState} />
        </div>
      </DndContext>
    </div>
  );
};
