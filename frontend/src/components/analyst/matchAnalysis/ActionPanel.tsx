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
  teamLocalSlug: string;
  teamVisitorSlug: string;
  onSuccess: () => void;
}

export const ActionPanel = ({ setSlug, selectedPosition, teamLocalSlug, teamVisitorSlug, onSuccess }: ActionPanelProps) => {
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

    let pointForTeamSlug: string | null = null;
    if (tempResult === "++") {
      pointForTeamSlug = selectedPosition.slug_team;
    } else if (tempResult === "--") {
      pointForTeamSlug = selectedPosition.slug_team === teamLocalSlug ? teamVisitorSlug : teamLocalSlug;
    }

    try {
      await addActionMutation.mutateAsync({
        setSlug: setSlug,
        slug_team: selectedPosition.slug_team,
        slug_player: selectedPosition.slug_player,
        action_type: selectedType,
        result: tempResult,
        player_position: selectedPosition.current_position,
        slug_point_for_team: pointForTeamSlug,
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
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full animate-in slide-in-from-right-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
        <p className="text-[9px] uppercase font-black tracking-widest opacity-70">Control de Acción</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-base border border-white/10 italic">
            #{selectedPosition.dorsal}
          </div>
          <h3 className="font-bold text-lg tracking-tight">{selectedPosition.dorsal}</h3>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        {showPicker && <CoordinatePicker onComplete={handleSaveWithCoords} onCancel={() => setShowPicker(false)} />}

        <section>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">1. Categoría Técnica</label>
          <div className="grid grid-cols-3 gap-2">
            {["SERVE", "RECEPTION", "SET", "ATTACK", "BLOCK", "DIG"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as ActionType)}
                className={`py-3 px-1 rounded-xl border-2 transition-all font-bold text-[10px] uppercase tracking-tighter ${
                  selectedType === type
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-inner"
                    : "border-slate-50 bg-slate-50/50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {type === "RECEPTION"
                  ? "RECP"
                  : type === "ATTACK"
                    ? "ATAQ"
                    : type === "SET"
                      ? "COLOC"
                      : type === "BLOCK"
                        ? "BLOQ"
                        : type === "SERVE"
                          ? "SAQUE"
                          : "DEF"}
              </button>
            ))}
          </div>
        </section>

        <section className={`transition-all duration-300 ${!selectedType ? "opacity-20 pointer-events-none grayscale" : "opacity-100"}`}>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">2. Evaluación de Calidad</label>
          <div className="flex gap-2">
            {[
              { val: "++" as ActionResult, color: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" },
              { val: "+" as ActionResult, color: "bg-blue-500 hover:bg-blue-600 shadow-blue-200" },
              { val: "-" as ActionResult, color: "bg-amber-500 hover:bg-amber-600 shadow-amber-200" },
              { val: "--" as ActionResult, color: "bg-rose-500 hover:bg-rose-600 shadow-rose-200" },
            ].map((res) => (
              <button
                key={res.val}
                onClick={() => handleResultButtonClick(res.val)}
                className={`${res.color} text-white flex-1 py-4 rounded-xl shadow-lg transition-all active:scale-90 flex items-center justify-center`}
              >
                <span className="text-2xl font-black italic">{res.val}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
