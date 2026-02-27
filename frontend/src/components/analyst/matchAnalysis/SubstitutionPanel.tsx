import { useCreateSubstitutionMutation } from "@/mutations/actions/useCreateSubstitution";
import type { LineupPosition } from "@/interfaces/lineupPosition.interface";
import Swal from "sweetalert2";

interface SubstitutionPanelProps {
  slugLineup: string;
  selectedPosition: LineupPosition;
  allPositions: LineupPosition[];
  onSuccess: () => void;
}

export const SubstitutionPanel = ({ slugLineup, selectedPosition, allPositions, onSuccess }: SubstitutionPanelProps) => {
  const substitutionMutation = useCreateSubstitutionMutation();
  const substitutePlayer = allPositions.find((p) => p.slug_team === selectedPosition.slug_team && p.current_position === 7);

  const handleSubstitute = async () => {
    if (!substitutePlayer) return;

    const result = await Swal.fire({
      title: "¿Confirmar sustitución?",
      text: `¿Cambiar ${selectedPosition.dorsal} por ${substitutePlayer.dorsal} ?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Confirmar cambio",
    });

    if (result.isConfirmed) {
      try {
        await substitutionMutation.mutateAsync({
          slug_lineup: slugLineup,
          slug_player_in: substitutePlayer.slug_player,
          slug_player_out: selectedPosition.slug_player,
        });
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
    }
  };

  if (!substitutePlayer) return null;

  return (
    <div className="bg-white rounded-[1.5rem] shadow-lg border border-slate-200 p-4 mb-4 animate-in fade-in duration-500">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Sustitución rápida</label>
      <button
        onClick={handleSubstitute}
        disabled={substitutionMutation.isPending}
        className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-blue-50 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-100 transition-all group active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-md">
            {substitutePlayer.dorsal}
          </div>
          <div className="text-left">
            <p className="text-[8px] text-blue-600 font-black uppercase tracking-widest leading-none mb-0.5">
              Entra por #{selectedPosition.dorsal}
            </p>
            <p className="text-xs font-bold text-slate-700 tracking-tight">{`Dorsal ${substitutePlayer.dorsal}`}</p>
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600 text-xs">
          <span className="font-bold">⇄</span>
        </div>
      </button>
    </div>
  );
};
