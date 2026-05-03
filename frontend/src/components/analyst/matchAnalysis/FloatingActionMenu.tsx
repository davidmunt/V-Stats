import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAddPointMutation } from "@/mutations/actions/useAddPoint";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import Swal from "sweetalert2";
import { CoordinatePicker } from "./CoordinatePicker";
import { getAllowedActions, type ActionType } from "@/utils/volleyLogic";

type ActionResult = "++" | "+" | "-" | "--";

interface FloatingActionMenuProps {
  anchorRect: DOMRect | null;
  setSlug: string;
  selectedPosition: LineupPosition;
  teamLocalSlug: string;
  teamVisitorSlug: string;
  onSuccess: () => void;
  onFinishMatch?: () => void;
  onClose: () => void;
}

const ACTION_NAMES: Record<string, string> = {
  RECEPTION: "RECEP.",
  ATTACK: "ATAQUE",
  SET: "COLOC.",
  BLOCK: "BLOQUEO",
  SERVE: "SAQUE",
  DIG: "DEF.",
};

const RESULTS = [
  { val: "++" as ActionResult, color: "bg-emerald-500 hover:brightness-110", label: "++" },
  { val: "+" as ActionResult, color: "bg-blue-500 hover:brightness-110", label: "+" },
  { val: "-" as ActionResult, color: "bg-amber-500 hover:brightness-110", label: "−" },
  { val: "--" as ActionResult, color: "bg-rose-500 hover:brightness-110", label: "−−" },
];

export const FloatingActionMenu = ({
  anchorRect,
  setSlug,
  selectedPosition,
  teamLocalSlug,
  teamVisitorSlug,
  onSuccess,
  onFinishMatch,
  onClose,
}: FloatingActionMenuProps) => {
  const [selectedType, setSelectedType] = useState<ActionType | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tempResult, setTempResult] = useState<ActionResult | null>(null);
  const addActionMutation = useAddPointMutation();

  const allowedActions = useMemo(() => {
    const history = JSON.parse(sessionStorage.getItem("vstats_last_actions") || "[]");
    return getAllowedActions(history, selectedPosition);
  }, [selectedPosition]);

  useEffect(() => {
    if (allowedActions.length === 1) {
      setSelectedType(allowedActions[0]);
    } else {
      setSelectedType(null);
    }
  }, [allowedActions]);

  const menuStyle = useMemo(() => {
    const menuWidth = 210;
    const margin = 8;

    if (!anchorRect) {
      return { position: "fixed" as const, top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 300, width: menuWidth };
    }

    let left = anchorRect.left + anchorRect.width / 2 - menuWidth / 2;
    let top = anchorRect.bottom + margin;

    const estimatedHeight = allowedActions.length > 1 ? 145 : 100;
    if (top + estimatedHeight > window.innerHeight - margin) {
      top = anchorRect.top - estimatedHeight - margin;
    }
    if (top < margin) top = margin;
    if (left < margin) left = margin;
    if (left + menuWidth > window.innerWidth - margin) left = window.innerWidth - menuWidth - margin;

    return { position: "fixed" as const, top, left, zIndex: 300, width: menuWidth };
  }, [anchorRect, allowedActions.length]);

  const handleResultButtonClick = (result: ActionResult) => {
    if (!selectedType) return;
    if (selectedType === "SERVE") {
      setTempResult(result);
      setShowPicker(true);
      return;
    }
    const isImpactAction = ["ATTACK", "BLOCK", "DIG"].includes(selectedType);
    if (isImpactAction && ["++", "--"].includes(result)) {
      setTempResult(result);
      setShowPicker(true);
      return;
    }
    const isTransitionAction = ["RECEPTION", "SET"].includes(selectedType);
    if (isTransitionAction && result === "--") {
      setTempResult(result);
      setShowPicker(true);
      return;
    }
    handleSaveWithCoords({ start_x: 0, start_y: 0, end_x: 0, end_y: 0 }, result);
  };

  const handleSaveWithCoords = async (
    coords: { start_x: number; start_y: number; end_x: number; end_y: number },
    directResult?: ActionResult,
  ) => {
    const resultToSave = directResult || tempResult;
    if (!selectedType || !resultToSave) return;

    let pointForTeamSlug: string | null = null;
    if (resultToSave === "++") pointForTeamSlug = selectedPosition.slug_team;
    else if (resultToSave === "--")
      pointForTeamSlug = selectedPosition.slug_team === teamLocalSlug ? teamVisitorSlug : teamLocalSlug;

    try {
      await addActionMutation.mutateAsync({
        setSlug,
        slug_team: selectedPosition.slug_team,
        slug_player: selectedPosition.slug_player,
        action_type: selectedType,
        result: resultToSave,
        player_position: selectedPosition.current_position,
        slug_point_for_team: pointForTeamSlug,
        ...coords,
      });
      setTempResult(null);
      setShowPicker(false);
      onSuccess();
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      const backendMessage = axiosError.response?.data?.message || "";

      if (backendMessage === "MATCH_ALREADY_FINISHED" || axiosError.response?.status === 400) {
        setTempResult(null);
        setShowPicker(false);
        onFinishMatch?.();
        return;
      }

      Swal.fire({
        title: "Error al registrar acción",
        text: backendMessage || "Error desconocido en el servidor",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const visibleResults = RESULTS.filter(
    (r) => !(r.val === "++" && ["RECEPTION", "SET"].includes(selectedType || "")),
  );

  const menu = (
    <>
      {showPicker ? (
        <CoordinatePicker onComplete={handleSaveWithCoords} onCancel={() => setShowPicker(false)} />
      ) : (
        <>
          <div className="fixed inset-0 z-[299]" onClick={onClose} />
          <div style={menuStyle} className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-black text-blue-600 text-sm shrink-0">#{selectedPosition.dorsal}</span>
                <span className="text-slate-500 text-[11px] font-medium truncate">
                  {selectedPosition.name || "Jugador"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-slate-300 hover:text-slate-500 font-black text-base leading-none ml-2 shrink-0"
              >
                ×
              </button>
            </div>

            {allowedActions.length > 1 && (
              <div className="grid grid-cols-3 gap-1">
                {["SERVE", "RECEPTION", "SET", "ATTACK", "BLOCK", "DIG"]
                  .filter((t) => allowedActions.includes(t as ActionType))
                  .map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type as ActionType)}
                      className={`py-1.5 rounded-xl border-2 text-[9px] font-black uppercase tracking-wide transition-all ${
                        selectedType === type
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-200"
                      }`}
                    >
                      {ACTION_NAMES[type] || type}
                    </button>
                  ))}
              </div>
            )}

            {allowedActions.length === 1 && selectedType && (
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center">
                {ACTION_NAMES[selectedType] || selectedType}
              </div>
            )}

            {allowedActions.length === 0 && (
              <p className="text-[9px] text-amber-600 font-bold text-center py-0.5">Sin acciones disponibles</p>
            )}

            <div className={`flex gap-1 transition-opacity duration-150 ${!selectedType ? "opacity-20 pointer-events-none" : ""}`}>
              {visibleResults.map((r) => (
                <button
                  key={r.val}
                  onClick={() => handleResultButtonClick(r.val)}
                  className={`${r.color} text-white flex-1 py-2.5 rounded-xl font-black text-sm active:scale-90 transition-all`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );

  return createPortal(menu, document.body);
};
