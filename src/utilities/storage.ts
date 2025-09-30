export const saveDraft = (message: string) => {
  localStorage.setItem('messageDraft', message);
};

export const loadDraft = (): string | null => {
  return localStorage.getItem('messageDraft');
};

export const clearDraft = () => {
  localStorage.removeItem('messageDraft');
};
