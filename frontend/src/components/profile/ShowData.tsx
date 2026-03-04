import type { User } from "@/interfaces/user.interface";

interface Props {
  userData?: User;
  onEdit: () => void;
  onChangePassword: () => void;
}

const ShowData = ({ userData, onEdit, onChangePassword }: Props) => {
  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        {/* Header con Gradiente (Part_VII_background) */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />

        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-2xl border border-slate-100">
              <img src={userData?.avatar || "/default-avatar.png"} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>

          <div className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tight">{userData?.name}</h2>
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {userData?.user_type}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
              <p className="font-bold text-slate-700">{userData?.email}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado</p>
              <p className="font-bold text-emerald-600 italic">Cuenta Activa</p>
            </div>
          </div>

          <button
            onClick={onEdit}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Editar Perfil
          </button>

          <button
            onClick={onChangePassword}
            className="w-full mt-4 bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-2xl font-bold transition-all border-2 border-slate-200 flex items-center justify-center gap-2 active:scale-95 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            Seguridad y Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowData;
