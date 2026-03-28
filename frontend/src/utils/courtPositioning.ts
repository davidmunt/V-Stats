export interface HistoryItem {
  action_type: string;
  result: "++" | "+" | "-" | "--";
  slug_team: string;
}

export type GamePhase = "SERVE_OWN" | "RECEIVE_OWN" | "IN_PLAY_AFTER_SERVE" | "IN_PLAY_AFTER_RECEIVE";

export const getGamePhase = (history: HistoryItem[]): GamePhase => {
  const lastAction = history[0];
  if (!lastAction) return "SERVE_OWN";

  const lastResult = lastAction.result;

  if (lastResult === "++" || lastResult === "--") {
    const weWonPoint = lastResult === "++";
    return weWonPoint ? "SERVE_OWN" : "RECEIVE_OWN";
  }

  let rallyStartAction = null;

  for (let i = 0; i < history.length; i++) {
    if (history[i].result === "++" || history[i].result === "--") {
      break;
    }
    rallyStartAction = history[i];
  }

  if (rallyStartAction) {
    if (rallyStartAction.action_type === "SERVE") return "IN_PLAY_AFTER_SERVE";
    if (rallyStartAction.action_type === "RECEPTION") return "IN_PLAY_AFTER_RECEIVE";
  }

  return "IN_PLAY_AFTER_SERVE";
};

export const getPlayerVisualOffset = (position: number, isSetter: boolean, phase: GamePhase, isHome: boolean, setterPos: number) => {
  const dirX = isHome ? 1 : -1;
  let x = 0;
  let y = 0;

  // =========================================================
  // 1. FASE DE SAQUE (K2 - Antes de sacar)
  // =========================================================
  if (phase === "SERVE_OWN") {
    switch (setterPos) {
      case 1:
        if (position === 1) {
          x = -150 * dirX;
          y = 0;
        } else if ([2, 3, 4].includes(position)) {
          x = 40 * dirX;
          y = 0;
        } else if ([5, 6].includes(position)) {
          x = 0;
          y = 0;
        }
        break;

      case 2:
        if (position === 1) {
          x = -150 * dirX;
          y = 0;
        } else if ([2, 3, 4].includes(position)) {
          x = 40 * dirX;
          y = 0;
        } else if ([5, 6].includes(position)) {
          x = 0;
          y = 0;
        }
        break;

      case 3:
        if (position === 1) {
          x = -150 * dirX;
          y = 0;
        } else if ([2, 3, 4].includes(position)) {
          x = 40 * dirX;
          y = 0;
        } else if ([5, 6].includes(position)) {
          x = 0;
          y = 0;
        }
        break;

      case 4:
        if (position === 1) {
          x = -150 * dirX;
          y = 0;
        } else if ([2, 3, 4].includes(position)) {
          x = 40 * dirX;
          y = 0;
        } else if ([5, 6].includes(position)) {
          x = 0;
          y = 0;
        }
        break;

      case 5:
        if (position === 1) {
          x = -150 * dirX;
          y = 0;
        } else if ([2, 3, 4].includes(position)) {
          x = 40 * dirX;
          y = 0;
        } else if ([5, 6].includes(position)) {
          x = 0;
          y = 0;
        }
        break;

      case 6:
        if (position === 1) {
          x = -150 * dirX;
          y = 0;
        } else if (position === 2) {
          x = 40 * dirX;
          y = 0;
        } else if (position === 3) {
          x = 40 * dirX;
          y = 0;
        } else if (position === 4) {
          x = 40 * dirX;
          y = 0;
        } else if (position === 5) {
          x = 0;
          y = 0;
        } else if (position === 6) {
          x = 0;
          y = 0;
        }
        break;

      default:
        break;
    }
  }

  // =========================================================
  // 2. FASE EN JUEGO TRAS SAQUE (K2 - Defensa y Bloqueo)
  // =========================================================
  else if (phase === "IN_PLAY_AFTER_SERVE") {
    switch (setterPos) {
      case 1:
        if (position === 4) {
          x = 0;
          y = 400;
        } else if (position === 2) {
          x = 0;
          y = -400;
        } else if (position === 5) {
          x = 0;
          y = 200;
        } else if (position === 6) {
          x = 0;
          y = -200;
        } else if (position === 1 || position === 3) {
          x = 0;
          y = 0;
        }
        break;

      case 2:
        if (position === 4) {
          x = 0;
          y = 200;
        } else if (position === 3) {
          x = 0;
          y = -200;
        } else if (position === 5) {
          x = 0;
          y = 400;
        } else if (position === 1) {
          x = 0;
          y = -400;
        } else if (position === 2 || position === 6) {
          x = 0;
          y = 0;
        }
        break;

      case 3:
        if (position === 3) {
          x = 0;
          y = 200;
        } else if (position === 2) {
          x = 0;
          y = -200;
        } else if (position === 6) {
          x = 0;
          y = 200;
        } else if (position === 1) {
          x = 0;
          y = -200;
        } else if (position === 4) {
          x = 0;
          y = 0;
        } else if (position === 5) {
          x = 0;
          y = 0;
        }
        break;

      case 4:
        if (position === 4) {
          x = 0;
          y = 400;
        } else if (position === 2) {
          x = 0;
          y = -400;
        } else if (position === 5) {
          x = 0;
          y = 200;
        } else if (position === 6) {
          x = 0;
          y = -200;
        } else if (position === 1 || position === 3) {
          x = 0;
          y = 0;
        }
        break;

      case 5:
        if (position === 5) {
          x = 0;
          y = 400;
        } else if (position === 1) {
          x = 0;
          y = -400;
        } else if (position === 4) {
          x = 0;
          y = 200;
        } else if (position === 3) {
          x = 0;
          y = -200;
        } else if (position === 6 || position === 2) {
          x = 0;
          y = 0;
        }
        break;

      case 6:
        if (position === 1) {
          x = 0;
          y = -200;
        } else if (position === 2) {
          x = 0;
          y = -200;
        } else if (position === 3) {
          x = 0;
          y = 200;
        } else if (position === 4) {
          x = 0;
          y = 0;
        } else if (position === 5) {
          x = 0;
          y = 0;
        } else if (position === 6) {
          x = 0;
          y = 200;
        }
        break;

      default:
        break;
    }

    // =========================================================
    // 3. FASE EN JUEGO TRAS RECIBIR (K1 - Ataque y Cobertura)
    // =========================================================
  } else if (phase === "IN_PLAY_AFTER_RECEIVE") {
    switch (setterPos) {
      case 1:
        if (position === 5) {
          x = 0;
          y = 200;
        } else if (position === 6) {
          x = 0;
          y = -200;
        } else if ([1, 2, 3, 4].includes(position)) {
          x = 0;
          y = 0;
        }
        break;

      case 2:
        if (position === 3) {
          x = 0;
          y = -200;
        } else if (position === 4) {
          x = 0;
          y = 200;
        } else if (position === 5) {
          x = 0;
          y = 400;
        } else if (position === 1) {
          x = 0;
          y = -400;
        } else if (position === 2 || position === 6) {
          x = 0;
          y = 0;
        }
        break;

      case 3:
        if (position === 3) {
          x = 0;
          y = 200;
        } else if (position === 2) {
          x = 0;
          y = -200;
        } else if (position === 6) {
          x = 0;
          y = 200;
        } else if (position === 1) {
          x = 0;
          y = -200;
        } else if (position === 5) {
          x = 0;
          y = 0;
        } else if (position === 4) {
          x = 0;
          y = 0;
        }
        break;

      case 4:
        if (position === 4) {
          x = 0;
          y = 400;
        } else if (position === 2) {
          x = 0;
          y = -400;
        } else if (position === 6) {
          x = 0;
          y = -200;
        } else if (position === 5) {
          x = 0;
          y = 200;
        } else if (position === 1 || position === 3) {
          x = 0;
          y = 0;
        }
        break;

      case 5:
        if (position === 5) {
          x = 0;
          y = 400;
        } else if (position === 1) {
          x = 0;
          y = -400;
        } else if (position === 3) {
          x = 0;
          y = -200;
        } else if (position === 4) {
          x = 0;
          y = 200;
        } else if (position === 2 || position === 6) {
          x = 0;
          y = 0;
        }
        break;

      case 6:
        if (position === 5) {
          x = 0;
          y = 0;
        } else if (position === 1) {
          x = -50;
          y = -200;
        } else if (position === 6) {
          x = 0;
          y = 200;
        } else if (position === 4) {
          x = 0;
          y = 0;
        } else if (position === 3) {
          x = 0;
          y = 200;
        } else if (position === 2) {
          x = 0;
          y = -200;
        }
        break;
    }
  }

  // =========================================================
  // 4. FASE DE RECEPCIÓN (K1 - Antes de recibir)
  // =========================================================
  else if (phase === "RECEIVE_OWN") {
    switch (setterPos) {
      case 1:
        if (position === 1) {
          x = -130;
          y = 110;
        } else if (position === 2) {
          x = -250 * dirX;
          y = 50;
        } else if (position === 6) {
          x = -30 * dirX;
          y = 30;
        } else if (position === 3) {
          x = 0;
          y = 60;
        } else if (position === 5) {
          x = 30;
          y = 0;
        } else if (position === 4) {
          x = 0;
          y = 0;
        }
        break;

      case 2:
        if (position === 2 || position === 1) {
          x = 0;
          y = 0;
        } else if (position === 6) {
          x = 0;
          y = -30;
        } else if (position === 5) {
          x = -150 * dirX;
          y = 70;
        } else if (position === 4) {
          x = 0;
          y = -70;
        } else if (position === 3) {
          x = -230 * dirX;
          y = -250;
        }
        break;

      case 3:
        if (position === 3) {
          x = 70 * dirX;
          y = -20;
        } else if (position === 2) {
          x = 50;
          y = -100;
        } else if (position === 6) {
          x = -150 * dirX;
          y = 200;
        } else if (position === 5) {
          x = 20 * dirX;
          y = 200;
        } else if (position === 4) {
          x = -200;
          y = 0;
        } else if (position === 1) {
          x = 0;
          y = 0;
        }
        break;

      case 4:
        if (position === 4) {
          x = 100 * dirX;
          y = -70;
        } else if (position === 3) {
          x = 0;
          y = -200;
        } else if (position === 2) {
          x = -250 * dirX;
          y = -400;
        } else if (position === 6) {
          x = -40;
          y = 280;
        } else if (position === 5) {
          x = 0;
          y = 280;
        } else if (position === 1) {
          x = -140 * dirX;
          y = 100;
        }
        break;

      case 5:
        if (position === 5) {
          x = 250 * dirX;
          y = -10;
        } else if (position === 4) {
          x = 100 * dirX;
          y = -70;
        } else if (position === 3) {
          x = -250 * dirX;
          y = -200;
        } else if ([1, 2, 6].includes(position)) {
          x = 0;
          y = 0;
        }
        break;

      case 6:
        if (position === 6) {
          x = 200 * dirX;
          y = 50;
        } else if (position === 3) {
          x = 50 * dirX;
          y = 90;
        } else if (position === 5) {
          x = 0;
          y = 200;
        } else if (position === 4) {
          x = -300;
          y = 0;
        } else if (position === 2) {
          x = 0;
          y = 0;
        } else if (position === 1) {
          x = 0;
          y = 0;
        }
        break;
    }
  }

  return { transform: `translate(${x}%, ${y}%)` };
};
