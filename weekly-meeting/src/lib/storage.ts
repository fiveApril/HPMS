import fs from "fs";
import path from "path";

export interface MeetingEntry {
  id: string;
  name: string;
  weekKey: string; // "YYYY-WW" format (ISO week)
  thisWeek: string;
  nextWeek: string;
  shared: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(weekKey: string): string {
  return path.join(DATA_DIR, `${weekKey}.json`);
}

export function getWeekEntries(weekKey: string): MeetingEntry[] {
  ensureDataDir();
  const filePath = getFilePath(weekKey);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as MeetingEntry[];
}

export function saveEntry(entry: MeetingEntry): void {
  ensureDataDir();
  const entries = getWeekEntries(entry.weekKey);
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  fs.writeFileSync(getFilePath(entry.weekKey), JSON.stringify(entries, null, 2), "utf-8");
}

export function deleteEntry(weekKey: string, id: string): void {
  ensureDataDir();
  const entries = getWeekEntries(weekKey).filter((e) => e.id !== id);
  fs.writeFileSync(getFilePath(weekKey), JSON.stringify(entries, null, 2), "utf-8");
}

export function listWeekKeys(): string[] {
  ensureDataDir();
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort();
}
