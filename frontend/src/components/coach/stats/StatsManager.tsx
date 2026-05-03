import { useState } from "react";
import YourTeamStats from "./YourTeamStats";
import OtherTeamsStats from "./OtherTeamsStats";
import { VipPaywall } from "../../payment/VipPaywall";
import { useAuthContext } from "@/hooks/useAuthContext";

const StatsManager = () => {
  const [currentView, setCurrentView] = useState<"mine" | "others">("mine");
  const { user } = useAuthContext();

  const isVip = user?.is_vip;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-center md:justify-start">
        <div className="inline-flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 shadow-sm">
          <button
            onClick={() => setCurrentView("mine")}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              currentView === "mine" ? "bg-white text-blue-600 shadow-md scale-105" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Mi Equipo
          </button>

          <button
            onClick={() => setCurrentView("others")}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
              currentView === "others" ? "bg-white text-blue-600 shadow-md scale-105" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Equipos Rivales
            {!isVip && <span className="text-[10px]">🔒</span>}
          </button>
        </div>
      </div>

      <div className="w-full transition-all duration-300">
        {currentView === "mine" ? <YourTeamStats /> : isVip ? <OtherTeamsStats /> : <VipPaywall />}
      </div>
    </div>
  );
};

export default StatsManager;
