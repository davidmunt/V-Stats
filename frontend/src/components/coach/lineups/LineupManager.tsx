import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import Swal from "sweetalert2";

import { useNextMatchForCoachQuery } from "@/queries/match/useNextMatchForCoach";
import { usePlayersCoachQuery } from "@/queries/players/usePlayersCoach";
import { useCoachLineupQuery } from "@/queries/lineups/useCoachLineup";
import { useSaveLineupMutation } from "@/mutations/lineups/useSaveLineup";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";

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
  useEffect(() => {
    if (existingLineupData && existingLineupData.positions && existingLineupData.positions.length > 0) {
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
        const positionKey = pos.current_position || pos.initial_position;

        if (positionKey >= 1 && positionKey <= 7) {
          baseState[positionKey] = {
            slug_player: pos.slug_player,
            name: pos.name,
            dorsal: pos.dorsal,
            role: pos.role,
            image: pos.image,
            slug: pos.slug_player,
            slug_team: existingLineupData.lineup.slug_team,
            status: "active",
            is_active: true,
          } as unknown as Player;
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
          if (newState[Number(key)]?.slug_player === draggedPlayer.slug_player) {
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
          if (newState[Number(key)]?.slug_player === draggedPlayer.slug_player) {
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
        slug_player: player!.slug_player,
        position: Number(pos),
      }));
    try {
      await saveMutation.mutateAsync({
        slug_match: nextMatch!.slug_match,
        slug_team: currentUser?.slug_team || "",
        positions: positionsToSave,
      });
      Swal.fire({
        title: "¡Todo Listo!",
        text: "La alineación titular se ha guardado correctamente para el partido.",
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 800,
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

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <VolleyballCourt lineupState={lineupState} />
          </div>
          <div className="lg:col-span-5">
            <PlayerBench allPlayers={players || []} lineupState={lineupState} />
          </div>
        </div>
      </DndContext>
    </div>
  );
};
