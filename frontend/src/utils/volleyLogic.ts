import type { LineupPosition } from "@/interfaces/lineupPosition.interface";

export type ActionType = "SERVE" | "RECEPTION" | "SET" | "ATTACK" | "BLOCK" | "DIG";

interface ActionHistoryItem {
  slug_team: string;
  action_type: ActionType;
  result: "++" | "+" | "-" | "--";
}

export const getAllowedActions = (history: ActionHistoryItem[], selectedPlayer: LineupPosition): ActionType[] => {
  const lastAction = history[0];
  const currentPos = selectedPlayer.current_position;
  let allowedActions: ActionType[] = [];

  if (!lastAction) {
    allowedActions = ["SERVE", "RECEPTION"];
  } else {
    const lastResult = lastAction.result;
    const lastType = lastAction.action_type;

    if (lastResult === "++" || lastResult === "--") {
      if (lastResult === "++") {
        allowedActions = ["SERVE"];
      } else {
        if (currentPos === 3 || currentPos === 6) {
          allowedActions = ["RECEPTION", "SET"];
        } else {
          allowedActions = ["RECEPTION"];
        }
      }
    } else if ((lastType === "RECEPTION" || lastType === "DIG") && ["+", "-"].includes(lastResult)) {
      allowedActions = ["SET", "ATTACK"];
    } else if (lastType === "SET" && ["+", "-"].includes(lastResult)) {
      allowedActions = ["ATTACK"];
    } else if ((lastType === "ATTACK" || lastType === "BLOCK" || lastType === "SERVE") && ["+", "-"].includes(lastResult)) {
      allowedActions = ["BLOCK", "DIG", "SET"];
    } else {
      allowedActions = ["RECEPTION", "SET", "ATTACK", "BLOCK", "DIG"];
    }
  }

  if ([1, 5, 6].includes(currentPos)) {
    allowedActions = allowedActions.filter((action) => action !== "BLOCK");
  }
  if (currentPos !== 1) {
    allowedActions = allowedActions.filter((action) => action !== "SERVE");
  }

  return allowedActions;
};
