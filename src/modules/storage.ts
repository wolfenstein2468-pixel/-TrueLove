export const STORAGE_KEY = 'hinata_interactive_completed_2026';

export const GameStorage = {
  isCompleted(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  },

  saveComplete(): void {
    localStorage.setItem(STORAGE_KEY, 'true');
  },

  resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
