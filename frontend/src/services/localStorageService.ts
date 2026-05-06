type StorageCallback = (
  newValue: string | null,
  oldValue: string | null
) => void;

class LocalStorageService {
  private listeners: Map<string, StorageCallback[]> = new Map();

  constructor() {
    window.addEventListener("storage", this.handleStorageChange);
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (!event.key) return;
    if (this.listeners.has(event.key)) {
      const callbacks = this.listeners.get(event.key) || [];
      callbacks.forEach((cb) => cb(event.newValue, event.oldValue));
    }
  };

  addListener(key: string, callback: StorageCallback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)?.push(callback);
  }

  removeListener(key: string, callback: StorageCallback) {
    if (this.listeners.has(key)) {
      const updatedCallbacks =
        this.listeners.get(key)?.filter((cb) => cb !== callback) || [];
      if (updatedCallbacks.length > 0) {
        this.listeners.set(key, updatedCallbacks);
      } else {
        this.listeners.delete(key);
      }
    }
  }

  setItem(key: string, value: string) {
    const oldValue = localStorage.getItem(key);
    localStorage.setItem(key, value);
    this.handleStorageChange(
      new StorageEvent("storage", { key, newValue: value, oldValue })
    );
  }

  getItem(key: string) {
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    const oldValue = localStorage.getItem(key);
    localStorage.removeItem(key);
    this.handleStorageChange(
      new StorageEvent("storage", { key, newValue: null, oldValue })
    );
  }

  clearStore() {
    Object.keys(this.listeners).forEach((key) => localStorage.removeItem(key));
  }
}

export const localStorageService = new LocalStorageService();
