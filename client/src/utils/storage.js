// src/utils/storage.js
export const save = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const load = (key, fallback) => {
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : fallback;
};

export const genId = () => {
  // Simple unique id generator: timestamp + random suffix
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
