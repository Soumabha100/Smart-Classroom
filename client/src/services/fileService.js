// src/services/fileService.js
const STORAGE_KEY = "mock_drive_files_v1";

function readStore() {
  const s = localStorage.getItem(STORAGE_KEY);
  return s ? JSON.parse(s) : [];
}
function writeStore(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

export async function getFiles() {
  return readStore();
}

export async function uploadFile(file) {
  const files = readStore();
  const newFile = {
    id: Date.now().toString(),
    name: file.name,
    size: file.size,
    type: file.type.split("/")[0] || "file",
  };
  files.unshift(newFile);
  writeStore(files);
  return newFile;
}

export async function deleteFile(id) {
  const files = readStore().filter((f) => f.id !== id);
  writeStore(files);
  return true;
}
