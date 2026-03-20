const ACTION_HISTORY_KEY = "vstats_last_actions";

export const saveActionToHistory = (newAction: unknown) => {
  const history = JSON.parse(sessionStorage.getItem(ACTION_HISTORY_KEY) || "[]");
  const updatedHistory = [newAction, ...history].slice(0, 3);
  sessionStorage.setItem(ACTION_HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const removeLastActionFromHistory = () => {
  const history = JSON.parse(sessionStorage.getItem(ACTION_HISTORY_KEY) || "[]");
  if (history.length > 0) {
    history.shift();
    sessionStorage.setItem(ACTION_HISTORY_KEY, JSON.stringify(history));
  }
};

export const getLastAction = () => {
  const history = JSON.parse(sessionStorage.getItem(ACTION_HISTORY_KEY) || "[]");
  return history.length > 0 ? history[0] : null;
};
