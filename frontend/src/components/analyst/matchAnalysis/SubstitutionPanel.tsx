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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-4">
      <label className="text-xs font-black text-gray-400 uppercase mb-3 block">Sustitución rápida</label>
      <button
        onClick={handleSubstitute}
        disabled={substitutionMutation.isPending}
        className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {substitutePlayer.dorsal}
          </div>
          <div className="text-left">
            <p className="text-[10px] text-blue-600 font-bold uppercase leading-none">Entra por #{selectedPosition.dorsal}</p>
            <p className="text-sm font-bold text-slate-700">{substitutePlayer.dorsal || "Reserva"}</p>
          </div>
        </div>
        <span className="text-blue-600 group-hover:translate-x-1 transition-transform">⇄</span>
      </button>
    </div>
  );
};
