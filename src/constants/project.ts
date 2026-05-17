export const SELECTED_PROJECT_ID_STORAGE_KEY = "selectedProjectId";
export const SELECTED_PROJECT_CHANGED_EVENT = "selectedProjectChanged";

export const getStoredProjectId = (): number | null => {
  const rawProjectId = sessionStorage.getItem(SELECTED_PROJECT_ID_STORAGE_KEY);
  const parsedProjectId = rawProjectId == null ? NaN : Number(rawProjectId);
  return Number.isNaN(parsedProjectId) ? null : parsedProjectId;
};

export const setStoredProjectId = (projectId: number | null) => {
  if (projectId == null) {
    sessionStorage.removeItem(SELECTED_PROJECT_ID_STORAGE_KEY);
  } else {
    sessionStorage.setItem(SELECTED_PROJECT_ID_STORAGE_KEY, String(projectId));
  }

  window.dispatchEvent(new CustomEvent(SELECTED_PROJECT_CHANGED_EVENT));
};
