import { usePlayersCoachQuery } from "@/queries/players/usePlayersCoach";
import { useDeletePlayerMutation } from "@/mutations/players/useDeletePlayer";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import type { Player, PlayerRole } from "@/interfaces/player.interface";
import LoadingFallback from "@/components/LoadingFallback";

interface PlayersListProps {
  onCreate: () => void;
  onEdit: (player: Player) => void;
}

const getRoleDetails = (role: PlayerRole) => {
  const roles = {
    SETTER: { label: "Colocador", color: "bg-purple-50 text-purple-600 border-purple-100" },
    MIDDLE: { label: "Central", color: "bg-orange-50 text-orange-600 border-orange-100" },
    OUTSIDE: { label: "Punta", color: "bg-blue-50 text-blue-600 border-blue-100" },
    OPPOSITE: { label: "Opuesto", color: "bg-green-50 text-green-600 border-green-100" },
    LIBERO: { label: "Líbero", color: "bg-amber-50 text-amber-600 border-amber-100" },
  };
  return roles[role] || { label: role, color: "bg-gray-50 text-gray-600 border-gray-100" };
};

export const PlayersList = ({ onCreate, onEdit }: PlayersListProps) => {
  const { data: coach } = useCurrentUserQuery();
  const { data: players, isLoading, isError } = usePlayersCoachQuery(coach?.slug_user ? coach?.slug_user : "slug");
  const deleteMutation = useDeletePlayerMutation(coach?.slug_user || "");

  const handleDelete = (playerSlug: string) => {
    deleteMutation.mutate({ slug: playerSlug });
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500 text-center">Error al cargar la plantilla.</div>;

  return (
    <div className="p-8 bg-slate-50/30 rounded-3xl animate-in fade-in duration-500">
      {/* Header unificado con VenuesList */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Mi Plantilla</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{players?.length || 0} Jugadores registrados en el equipo.</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-200/50 active:scale-95"
        >
          <span className="text-xl leading-none">+</span> Nuevo Jugador
        </button>
      </div>

      {/* Tabla con diseño de profundidad (Part_VII_taules) */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden">
        {!players || players.length === 0 ? (
          <div className="p-20 text-center bg-slate-50/50">
            <p className="text-slate-400 font-medium italic">No hay jugadores en la plantilla todavía.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <tr>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest w-20">#</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Jugador</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Posición</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {players.map((player) => (
                  <tr key={player.slug_player} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="py-6 px-8">
                      <span className="font-black text-2xl text-blue-600/40 group-hover:text-blue-600 transition-colors">
                        {player.dorsal}
                      </span>
                    </td>

                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                          {player.image ? (
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <div className="text-[10px] font-bold text-slate-300 uppercase">{player.name.substring(0, 2)}</div>
                          )}
                        </div>
                        <div className="font-bold text-slate-800 text-lg">{player.name}</div>
                      </div>
                    </td>

                    <td className="py-6 px-8">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${getRoleDetails(player.role).color}`}
                      >
                        {getRoleDetails(player.role).label}
                      </span>
                    </td>

                    <td className="py-6 px-8">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${
                          player.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : player.status === "INJURED"
                              ? "bg-rose-50 text-rose-600 border-rose-100"
                              : "bg-slate-50 text-slate-600 border-slate-100"
                        }`}
                      >
                        {player.status}
                      </span>
                    </td>

                    <td className="py-6 px-8 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => onEdit(player)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-black uppercase tracking-widest p-2 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(player.slug_player)}
                          disabled={deleteMutation.isPending}
                          className="text-slate-300 hover:text-rose-600 text-xs font-black uppercase tracking-widest p-2 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-30"
                        >
                          {deleteMutation.isPending ? "..." : "Borrar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
