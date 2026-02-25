import { useStartMatchMutation } from "@/mutations/matches/useStartMatch";
import type { Match } from "@/interfaces/match.interface";
import Swal from "sweetalert2";

interface StartAnalysingProps {
  match: Match;
  analystSlug: string;
}

export const StartAnalysing = ({ match, analystSlug }: StartAnalysingProps) => {
  const startMutation = useStartMatchMutation(analystSlug);

  const handleStart = async () => {
    const matchTime = new Date(match.date);
    const currentTime = new Date();

    if (currentTime < matchTime) {
      return Swal.fire({
        title: "¡Demasiado pronto!",
        text: `El partido está programado para las ${matchTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. Por favor, espera a la hora oficial.`,
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
    }

    try {
      await startMutation.mutateAsync(match.slug_match);
    } catch (error: unknown) {
      const errMsg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Ha habido un error al intentar iniciar el análisis del partido";
      Swal.fire({
        title: "Error",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const isToday = new Date(match.date).toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="text-6xl mb-4">🏐</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{match.name}</h2>
      <p className="text-gray-500 mb-6">{new Date(match.date).toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" })}</p>

      {!isToday ? (
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium">
          El partido no está programado para hoy. Espera a la fecha correspondiente.
        </div>
      ) : (
        <button
          onClick={handleStart}
          disabled={startMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {startMutation.isPending ? "Iniciando..." : "Empezar"}
        </button>
      )}
    </div>
  );
};
