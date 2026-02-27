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
    <div className="max-w-3xl mx-auto mt-20 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-[3rem] border border-slate-100 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-50 rounded-full opacity-50"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-5xl mb-8 mx-auto shadow-inner border border-blue-100">
            🏐
          </div>

          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3 italic">{match.name}</h2>

          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-10">
            {new Date(match.date).toLocaleString("es-ES", { dateStyle: "full", timeStyle: "short" })}
          </p>

          {!isToday ? (
            <div className="flex flex-col items-center gap-3 bg-amber-50 p-6 rounded-[2rem] border border-amber-100 max-w-sm">
              <span className="text-2xl">⏳</span>
              <p className="text-xs text-amber-700 font-bold uppercase tracking-widest leading-relaxed">
                Acceso restringido: El partido está programado para otra fecha.
              </p>
            </div>
          ) : (
            <button
              onClick={handleStart}
              disabled={startMutation.isPending}
              className="group relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black py-5 px-16 rounded-[2rem] text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-blue-200 active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10">{startMutation.isPending ? "Configurando sesión..." : "Iniciar Análisis"}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-[2rem]"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
