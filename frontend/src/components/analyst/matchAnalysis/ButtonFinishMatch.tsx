export const ButtonFinishMatch = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm">
          🏁
        </div>

        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">¡Partido Finalizado!</h2>
        <p className="text-gray-500 mt-2 font-medium">
          Todos los datos han sido guardados correctamente. Puedes cerrar el panel de análisis.
        </p>

        <button
          onClick={handleRefresh}
          className="mt-8 w-full bg-slate-800 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg tracking-widest uppercase text-sm"
        >
          Finalizar y Salir
        </button>

        <p className="text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">V-Stats Analyst System</p>
      </div>
    </div>
  );
};
