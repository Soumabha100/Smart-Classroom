// src/services/learningService.js
const MOCK = [
  { id: "m1", title: "React Basics", type: "lesson", done: false },
  { id: "m2", title: "Hooks Challenge", type: "challenge", done: false },
  { id: "m3", title: "AI Ethics Quiz", type: "quiz", done: false },
  { id: "m4", title: "AI Ethics puzzle", type: "puzzle", done: false },
];

export async function getPath() {
  return MOCK;
}

export async function markDone(id) {
  const item = MOCK.find((m) => m.id === id);
  if (item) item.done = true;
  return item;
}
