import { useState, useMemo, useEffect } from "react"; // IMPORTANTE: Añadimos useEffect
import { useAddPointMutation } from "@/mutations/actions/useAddPoint";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import Swal from "sweetalert2";
import { CoordinatePicker } from "./CoordinatePicker";
import { getAllowedActions, type ActionType } from "@/utils/volleyLogic";

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

  const allowedActions = useMemo(() => {
    const history = JSON.parse(sessionStorage.getItem("vstats_last_actions") || "[]");
    return getAllowedActions(history, selectedPosition);
  }, [selectedPosition]);

  useEffect(() => {
    if (allowedActions.length === 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedType(allowedActions[0]);
    } else {
      setSelectedType(null);
    }
  }, [allowedActions]);

  const handleResultButtonClick = (result: ActionResult) => {
    if (!selectedType) return;
    if (selectedType === "SERVE") {
      setTempResult(result);
      setShowPicker(true);
      return;
    }
    const isImpactAction = ["ATTACK", "BLOCK", "DIG"].includes(selectedType);
    const isExtremeResult = ["++", "--"].includes(result);
    if (isImpactAction && isExtremeResult) {
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
    setTempResult(result);
    handleSaveWithCoords({ start_x: 0, start_y: 0, end_x: 0, end_y: 0 }, result);
  };

  const handleSaveWithCoords = async (
    coords: { start_x: number; start_y: number; end_x: number; end_y: number },
    directResult?: ActionResult,
  ) => {
    const resultToSave = directResult || tempResult;
    if (!selectedType || !resultToSave) return;

    let pointForTeamSlug: string | null = null;
    if (resultToSave === "++") {
      pointForTeamSlug = selectedPosition.slug_team;
    } else if (resultToSave === "--") {
      pointForTeamSlug = selectedPosition.slug_team === teamLocalSlug ? teamVisitorSlug : teamLocalSlug;
    }

    try {
      await addActionMutation.mutateAsync({
        setSlug: setSlug,
        slug_team: selectedPosition.slug_team,
        slug_player: selectedPosition.slug_player,
        action_type: selectedType,
        result: resultToSave,
        player_position: selectedPosition.current_position,
        slug_point_for_team: pointForTeamSlug,
        ...coords,
      });

      setSelectedType(null);
      setTempResult(null);
      setShowPicker(false);
      onSuccess();
    } catch (error: unknown) {
      // 1. Creamos una referencia tipada para que TS no se queje
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string };
        };
      };

      // 2. Ahora ya puedes usar axiosError con total seguridad
      console.log("--- ERROR DETECTADO ---");
      console.log("Status Code:", axiosError.response?.status);
      console.log("Data completa del error:", axiosError.response?.data);

      const backendMessage = axiosError.response?.data?.message || "";
      console.log("Mensaje extraído:", backendMessage);

      // 3. Lógica de Partido Finalizado
      if (backendMessage === "MATCH_ALREADY_FINISHED" || axiosError.response?.status === 400) {
        console.log("¡Último punto registrado detectado!");

        setSelectedType(null);
        setTempResult(null);
        setShowPicker(false);

        Swal.fire({
          title: "¡Partido Finalizado!",
          text: "Se ha registrado el último punto. Generando estadísticas...",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          onSuccess();
        });

        return;
      }

      // 4. Otros errores
      Swal.fire({
        title: "Error al registrar acción",
        text: backendMessage || "Error desconocido en el servidor",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const actionNames: Record<string, string> = {
    RECEPTION: "RECEPCIÓN",
    ATTACK: "ATAQUE",
    SET: "COLOCACIÓN",
    BLOCK: "BLOQUEO",
    SERVE: "SAQUE",
    DIG: "DEFENSA",
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full animate-in slide-in-from-right-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
        <p className="text-[9px] uppercase font-black tracking-widest opacity-70">Control de Acción</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-base border border-white/10 italic">
            #{selectedPosition.dorsal}
          </div>
          <h3 className="font-bold text-lg tracking-tight">{selectedPosition.name || `Jugador ${selectedPosition.dorsal}`}</h3>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        {showPicker && <CoordinatePicker onComplete={handleSaveWithCoords} onCancel={() => setShowPicker(false)} />}

        {allowedActions.length > 1 && (
          <section>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">
              1. Acción Disponible
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["SERVE", "RECEPTION", "SET", "ATTACK", "BLOCK", "DIG"]
                .filter((type) => allowedActions.includes(type as ActionType))
                .map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as ActionType)}
                    className={`py-4 px-2 rounded-2xl border-2 transition-all font-black text-[11px] uppercase tracking-wider ${
                      selectedType === type
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.02]"
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-200 hover:bg-white"
                    }`}
                  >
                    {actionNames[type] || type}
                  </button>
                ))}
            </div>
          </section>
        )}

        {allowedActions.length === 1 && selectedType && (
          <section className="animate-in fade-in zoom-in-95 duration-300">
            <span className="text-sm font-black text-blue-700 uppercase tracking-tight">{actionNames[selectedType]}</span>
          </section>
        )}

        {allowedActions.length === 0 && (
          <p className="text-[10px] text-amber-600 font-bold bg-amber-50 p-3 rounded-xl border border-amber-100 italic">
            Este jugador no tiene acciones lógicas en esta fase del punto.
          </p>
        )}

        <section className={`transition-all duration-300 ${!selectedType ? "opacity-20 pointer-events-none scale-95" : "opacity-100"}`}>
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block italic">
            {allowedActions.length === 1 ? "1. Resultado" : "2. Resultado"}
          </label>
          <div className="flex gap-2">
            {[
              { val: "++" as ActionResult, color: "bg-emerald-500", desc: "Punto" },
              { val: "+" as ActionResult, color: "bg-blue-500", desc: "Continua" },
              { val: "-" as ActionResult, color: "bg-amber-500", desc: "Mala" },
              { val: "--" as ActionResult, color: "bg-rose-500", desc: "Error" },
            ]
              .filter((res) => !(res.val === "++" && ["RECEPTION", "SET"].includes(selectedType || "")))
              .map((res) => (
                <button
                  key={res.val}
                  onClick={() => handleResultButtonClick(res.val)}
                  className={`${res.color} text-white flex-1 py-4 rounded-2xl shadow-lg transition-all active:scale-90 flex flex-col items-center justify-center gap-1 hover:brightness-110`}
                >
                  <span className="text-2xl font-black italic">{res.val}</span>
                  <span className="text-[8px] font-bold uppercase opacity-90">{res.desc}</span>
                </button>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};
