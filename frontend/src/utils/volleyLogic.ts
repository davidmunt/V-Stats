import type { LineupPosition } from "@/interfaces/lineupPosition.interface";

export type ActionType = "SERVE" | "RECEPTION" | "SET" | "ATTACK" | "BLOCK" | "DIG";

interface ActionHistoryItem {
  slug_team: string;
  action_type: ActionType;
  result: "++" | "+" | "-" | "--";
}

export const getAllowedActions = (history: ActionHistoryItem[], selectedPlayer: LineupPosition): ActionType[] => {
  const lastAction = history[0];

  if (!lastAction) {
    return ["SERVE", "RECEPTION"];
  }

  const lastResult = lastAction.result;
  const lastType = lastAction.action_type;

  if (lastResult === "++" || lastResult === "--") {
    if (lastResult === "++") {
      return ["SERVE"];
    }
    if (selectedPlayer.current_position === 3 || selectedPlayer.current_position === 6) {
      return ["RECEPTION", "SET"];
    }
    return ["RECEPTION"];
  }

  if ((lastType === "RECEPTION" || lastType === "DIG") && ["+", "-"].includes(lastResult)) {
    return ["SET", "ATTACK"];
  }

  if (lastType === "SET" && ["+", "-"].includes(lastResult)) {
    return ["ATTACK", "SET"];
  }

  if ((lastType === "ATTACK" || lastType === "BLOCK" || lastType === "SERVE") && ["+", "-"].includes(lastResult)) {
    return ["BLOCK", "DIG", "SET"];
  }

  return ["RECEPTION", "SET", "ATTACK", "BLOCK", "DIG"];
};
