export interface HistoryItem {
  action_type: string;
  result: "++" | "+" | "-" | "--";
  slug_team: string;
}

export type GamePhase = "SERVE_OWN" | "RECEIVE_OWN" | "IN_PLAY";

export const getGamePhase = (history: HistoryItem[]): GamePhase => {
  const lastAction = history[0];
  if (!lastAction) return "SERVE_OWN";

  const lastResult = lastAction.result;
  if (lastResult === "++" || lastResult === "--") {
    const weWonPoint = lastResult === "++";
    return weWonPoint ? "SERVE_OWN" : "RECEIVE_OWN";
  }
  return "IN_PLAY";
};

export const getPlayerVisualOffset = (position: number, isSetter: boolean, phase: GamePhase, isHome: boolean, setterPos: number) => {
  const dirX = isHome ? 1 : -1;
  let x = 0;
  let y = 0;

  if (phase === "SERVE_OWN") {
    if (position === 1) {
      x = -120 * dirX;
      y = 0;
    } else if (isSetter) {
      x = position > 3 ? 50 * dirX : 80 * dirX;
    } else if ([2, 3, 4].includes(position)) {
      x = 40 * dirX;
    } else {
      x = 20 * dirX;
    }
  } else if (phase === "RECEIVE_OWN") {
    switch (setterPos) {
      case 1:
        if (position === 1) {
          x = 80 * dirX;
          y = -50;
        } else if (position === 2) {
          x = 40 * dirX;
          y = -30;
        } else if (position === 3) {
          x = 40 * dirX;
          y = 20;
        } else if (position === 4) {
          x = -40 * dirX;
          y = 40;
        } else if (position === 5) {
          x = -60 * dirX;
          y = 20;
        } else if (position === 6) {
          x = -60 * dirX;
          y = -10;
        }
        break;

      case 2:
        if (position === 2) {
          x = 50 * dirX;
          y = -20;
        } else if (position === 3) {
          x = 40 * dirX;
          y = 20;
        } else if (position === 4) {
          x = -10 * dirX;
          y = 30;
        } else if (position === 5) {
          x = -50 * dirX;
          y = 30;
        } else if (position === 6) {
          x = -50 * dirX;
          y = 0;
        } else if (position === 1) {
          x = -50 * dirX;
          y = -30;
        }
        break;

      case 3:
        if (position === 3) {
          x = 60 * dirX;
          y = -10;
        } else if (position === 2) {
          x = 40 * dirX;
          y = -40;
        } else if (position === 4) {
          x = 20 * dirX;
          y = 30;
        } else if (position === 5) {
          x = -50 * dirX;
          y = 20;
        } else if (position === 6) {
          x = -50 * dirX;
          y = 0;
        } else if (position === 1) {
          x = -50 * dirX;
          y = -20;
        }
        break;

      case 4:
        if (position === 4) {
          x = 60 * dirX;
          y = 20;
        } else if (position === 3) {
          x = 40 * dirX;
          y = -10;
        } else if (position === 2) {
          x = 20 * dirX;
          y = -30;
        } else if (position === 5) {
          x = -30 * dirX;
          y = 30;
        } else if (position === 6) {
          x = -60 * dirX;
          y = 0;
        } else if (position === 1) {
          x = -60 * dirX;
          y = -30;
        }
        break;

      case 5:
        if (position === 5) {
          x = 80 * dirX;
          y = 30;
        } else if (position === 4) {
          x = 50 * dirX;
          y = 40;
        } else if (position === 3) {
          x = 50 * dirX;
          y = -10;
        } else if (position === 2) {
          x = -30 * dirX;
          y = -40;
        } else if (position === 6) {
          x = -60 * dirX;
          y = 20;
        } else if (position === 1) {
          x = -60 * dirX;
          y = -20;
        }
        break;

      case 6:
        if (position === 6) {
          x = 80 * dirX;
          y = 0;
        } else if (position === 3) {
          x = 50 * dirX;
          y = 20;
        } else if (position === 4) {
          x = -30 * dirX;
          y = 40;
        } else if (position === 2) {
          x = 30 * dirX;
          y = -40;
        } else if (position === 5) {
          x = -60 * dirX;
          y = 20;
        } else if (position === 1) {
          x = -60 * dirX;
          y = -20;
        }
        break;

      default:
        x = -40 * dirX;
        break;
    }
  }

  return { transform: `translate(${x}%, ${y}%)` };
};
