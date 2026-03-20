import type { LineupPosition } from "@/interfaces/lineupPosition.interface";

export type ActionType = "SERVE" | "RECEPTION" | "SET" | "ATTACK" | "BLOCK" | "DIG";

interface ActionHistoryItem {
  slug_team: string;
  action_type: ActionType;
  result: "++" | "+" | "-" | "--";
}

export const getAllowedActions = (history: ActionHistoryItem[], selectedPlayer: LineupPosition): ActionType[] => {
  const lastAction = history[0];

  // --- 1. INICIO DE SET O PARTIDO ---
  if (!lastAction) {
    return ["SERVE", "RECEPTION"];
  }

  const lastResult = lastAction.result;
  const lastType = lastAction.action_type;

  // --- 2. SI EL PUNTO TERMINÓ (El balón murió) ---
  if (lastResult === "++" || lastResult === "--") {
    // Si nuestra última acción fue punto (++), nos toca SACAR
    if (lastResult === "++") {
      return ["SERVE"];
    }
    // Si nuestra última acción fue error (--), el rival sacará -> Recibimos.
    // Aplicamos regla del profesor para el centro (3 o 6)
    if (selectedPlayer.current_position === 3 || selectedPlayer.current_position === 6) {
      return ["RECEPTION", "SET"];
    }
    return ["RECEPTION"];
  }

  // --- 3. CONTINUIDAD DE JUEGO (El balón sigue vivo '+' o '-') ---

  // A. Tras Recibo o Defensa propia
  // Cambiamos lastResult === "+" por ["+", "-"].includes(lastResult)
  if ((lastType === "RECEPTION" || lastType === "DIG") && ["+", "-"].includes(lastResult)) {
    return ["SET", "ATTACK"];
  }

  // B. Tras Colocación propia
  if (lastType === "SET" && ["+", "-"].includes(lastResult)) {
    return ["ATTACK", "SET"];
  }

  // C. Si sacamos, atacamos o bloqueamos y el balón sigue vivo
  if ((lastType === "ATTACK" || lastType === "BLOCK" || lastType === "SERVE") && ["+", "-"].includes(lastResult)) {
    return ["BLOCK", "DIG", "SET"];
  }

  return ["RECEPTION", "SET", "ATTACK", "BLOCK", "DIG"];
};
