import { useState } from "react";
import { useAddPointMutation } from "@/mutations/actions/useAddPoint";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import Swal from "sweetalert2";
import { CoordinatePicker } from "./CoordinatePicker";

type ActionType = "SERVE" | "ATTACK" | "BLOCK" | "RECEPTION" | "DIG" | "SET";
type ActionResult = "++" | "+" | "-" | "--";

interface ActionPanelProps {
  setSlug: string;
  selectedPosition: LineupPosition;
  teamLocalId: string;
  teamVisitorId: string;
  onSuccess: () => void;
}

export const ActionPanel = ({ setSlug, selectedPosition, teamLocalId, teamVisitorId, onSuccess }: ActionPanelProps) => {
  const [selectedType, setSelectedType] = useState<ActionType | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tempResult, setTempResult] = useState<ActionResult | null>(null);
  const addActionMutation = useAddPointMutation();

  const handleResultButtonClick = (result: ActionResult) => {
    if (!selectedType) return;
    setTempResult(result);
    setShowPicker(true);
  };

  const handleSaveWithCoords = async (coords: { start_x: number; start_y: number; end_x: number; end_y: number }) => {
    if (!selectedType || !tempResult) return;

    let pointForTeamId: string | null = null;
    if (tempResult === "++") {
      pointForTeamId = selectedPosition.slug_team;
    } else if (tempResult === "--") {
      pointForTeamId = selectedPosition.slug_team === teamLocalId ? teamVisitorId : teamLocalId;
    }

    try {
      await addActionMutation.mutateAsync({
        setSlug: setSlug,
        id_team: selectedPosition.slug_team,
        id_player: selectedPosition.slug_player,
        action_type: selectedType,
        result: tempResult,
        player_position: selectedPosition.current_position,
        id_point_for_team: pointForTeamId,
        ...coords,
      });

      setSelectedType(null);
      setTempResult(null);
      setShowPicker(false);
      onSuccess();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error";
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <div>
          <p className="text-[10px] uppercase font-bold opacity-80">Jugador Seleccionado</p>
          <h3 className="font-bold text-lg">#{selectedPosition.dorsal}</h3>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-6">
        {showPicker && <CoordinatePicker onComplete={handleSaveWithCoords} onCancel={() => setShowPicker(false)} />}
        <div>
          <label className="text-xs font-black text-gray-400 uppercase mb-3 block">1. Tipo Accion</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedType("SERVE")}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedType === "SERVE" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-600"}`}
            >
              Saque
            </button>
            <button
              onClick={() => setSelectedType("RECEPTION")}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedType === "RECEPTION" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-600"}`}
            >
              Recepcion
            </button>
            <button
              onClick={() => setSelectedType("SET")}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedType === "SET" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-600"}`}
            >
              Colocacion
            </button>
            <button
              onClick={() => setSelectedType("ATTACK")}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedType === "ATTACK" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-600"}`}
            >
              Ataque
            </button>
            <button
              onClick={() => setSelectedType("BLOCK")}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedType === "BLOCK" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-600"}`}
            >
              Bloqueo
            </button>
            <button
              onClick={() => setSelectedType("DIG")}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedType === "DIG" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 bg-gray-50 text-gray-600"}`}
            >
              Defensa
            </button>
          </div>
        </div>

        <div className={`transition-opacity ${!selectedType ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
          <label className="text-xs font-black text-gray-400 uppercase mb-3 block">2. Calidad Accion</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleResultButtonClick("++")}
              className="bg-green-600 text-white p-4 rounded-xl shadow-md flex flex-col items-center"
            >
              <span className="text-2xl font-black">++</span>
              <span className="text-[10px] font-medium opacity-90">Punto</span>
            </button>
            <button
              onClick={() => handleResultButtonClick("+")}
              className="bg-green-400 text-white p-4 rounded-xl shadow-md flex flex-col items-center"
            >
              <span className="text-2xl font-black">+</span>
              <span className="text-[10px] font-medium opacity-90">Bueno</span>
            </button>
            <button
              onClick={() => handleResultButtonClick("-")}
              className="bg-orange-400 text-white p-4 rounded-xl shadow-md flex flex-col items-center"
            >
              <span className="text-2xl font-black">-</span>
              <span className="text-[10px] font-medium opacity-90">Malo</span>
            </button>
            <button
              onClick={() => handleResultButtonClick("--")}
              className="bg-red-600 text-white p-4 rounded-xl shadow-md flex flex-col items-center"
            >
              <span className="text-2xl font-black">--</span>
              <span className="text-[10px] font-medium opacity-90">Punto Rival</span>
            </button>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};
