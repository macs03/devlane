import type { SleepEntry } from '@/types/sleepEntry';

function parseIsoDateToUtcDay(dateIso: string): number {
  const [year, month, day] = dateIso.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WEEK_DAYS = 7;

function compareEntriesChronologically(a: SleepEntry, b: SleepEntry): number {
  if (a.date !== b.date) {
    return a.date.localeCompare(b.date);
  }
  return a.startTime.localeCompare(b.startTime);
}

export function getLastWeekEntries(entries: SleepEntry[]): SleepEntry[] {
  if (entries.length === 0) {
    return [];
  }

  const sorted = [...entries].sort(compareEntriesChronologically);
  const maxUtcDay = sorted.reduce(
    (max, entry) => Math.max(max, parseIsoDateToUtcDay(entry.date)),
    parseIsoDateToUtcDay(sorted[0].date),
  );
  const windowStartUtcDay = maxUtcDay - (WEEK_DAYS - 1) * MS_PER_DAY;

  return sorted.filter((entry) => {
    const day = parseIsoDateToUtcDay(entry.date);
    return day >= windowStartUtcDay && day <= maxUtcDay;
  });
}

export function getLastWeekDateRange(entries: SleepEntry[]): { start: string; end: string } | null {
  const lastWeek = getLastWeekEntries(entries);
  if (lastWeek.length === 0) {
    return null;
  }
  const start = lastWeek[0].date;
  const end = lastWeek[lastWeek.length - 1].date;
  return { start, end };
}

function formatAnalysisRangePart(dateIso: string): string {
  const [year, monthIndex, day] = dateIso.split('-').map(Number);
  const date = new Date(year, monthIndex - 1, day);
  const monthLabel = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  return `${monthLabel} ${day}`;
}

export function formatLastWeekAnalysisRange(entries: SleepEntry[]): string | null {
  const range = getLastWeekDateRange(entries);
  if (!range) {
    return null;
  }
  if (range.start === range.end) {
    return formatAnalysisRangePart(range.start);
  }
  const startPart = formatAnalysisRangePart(range.start);
  const endDay = Number(range.end.split('-')[2]);
  return `${startPart} – ${endDay}`;
}
