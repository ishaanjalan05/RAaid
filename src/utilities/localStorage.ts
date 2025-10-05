const DRAFT_KEY = 'messageDraft';

export const saveDraft = (message: string): void => {
  localStorage.setItem(DRAFT_KEY, message);
};

export const loadDraft = (): string | null => {
  return localStorage.getItem(DRAFT_KEY);
};

export const clearDraft = (): void => {
  localStorage.removeItem(DRAFT_KEY);
};
