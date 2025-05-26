export function loadSettings(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveSettings(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
} 