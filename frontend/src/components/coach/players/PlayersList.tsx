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
    SETTER: { label: "Colocador", color: "bg-purple-100 text-purple-700" },
    MIDDLE: { label: "Central", color: "bg-orange-100 text-orange-700" },
    OUTSIDE: { label: "Punta", color: "bg-blue-100 text-blue-700" },
    OPPOSITE: { label: "Opuesto", color: "bg-green-100 text-green-700" },
    LIBERO: { label: "Líbero", color: "bg-yellow-100 text-yellow-700" },
  };
  return roles[role] || { label: role, color: "bg-gray-100 text-gray-700" };
};

export const PlayersList = ({ onCreate, onEdit }: PlayersListProps) => {
  const { data: coach } = useCurrentUserQuery();
  const { data: players, isLoading, isError } = usePlayersCoachQuery(coach?.slug ? coach?.slug : "slug");
  const deleteMutation = useDeletePlayerMutation(coach?.slug || "");

  const handleDelete = (playerSlug: string) => {
    if (window.confirm("¿Estás seguro de que quieres dar de baja a este jugador?")) {
      deleteMutation.mutate({ slug: playerSlug });
    }
  };

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div className="p-4 text-red-500 text-center">Error al cargar la plantilla.</div>;

  return (
    <div className="p-6">
      {/* --- CABECERA --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mi Plantilla</h2>
          <p className="text-sm text-gray-500">{players?.length || 0} Jugadores registrados en el equipo</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="text-lg">+</span> Nuevo Jugador
        </button>
      </div>

      {/* --- TABLA DE JUGADORES --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {!players || players.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No hay jugadores en la plantilla. Haz clic en "Nuevo Jugador" para empezar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-500 text-xs uppercase font-semibold tracking-wider">
                  <th className="py-3 px-4 w-20">Dorsal</th>
                  <th className="py-3 px-4">Jugador</th>
                  <th className="py-3 px-4">Posición</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {players.map((player) => (
                  <tr key={player.id_player} className="hover:bg-gray-50 transition-colors">
                    {/* Dorsal */}
                    <td className="py-4 px-4 font-black text-xl text-blue-600">{player.dorsal}</td>

                    {/* Imagen y Nombre */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border overflow-hidden flex-shrink-0">
                          {player.image ? (
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-[10px] text-gray-400 font-bold">
                              {player.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-gray-900">{player.name}</div>
                      </div>
                    </td>

                    {/* Rol / Posición */}
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getRoleDetails(player.role).color}`}>
                        {getRoleDetails(player.role).label}
                      </span>
                    </td>

                    {/* Estado de Actividad */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          player.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : player.status === "INJURED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {player.status}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => onEdit(player)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(player.slug)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold disabled:opacity-50"
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
