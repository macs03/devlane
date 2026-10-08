import type { SleepEntry } from '@/types/sleepEntry';
import {
  formatEntryDate,
  formatMinutesAsDuration,
  formatTime12h,
  sleepDurationMinutes,
} from '@/utils/sleepDuration';

const EVENING_BEDTIME_HOUR = 18;

export type SleepKeyStats = {
  longest: { duration: string; dateLabel: string };
  shortest: { duration: string; dateLabel: string };
  avgDuration: string;
  avgBedtime: string | null;
};

type EntryWithDuration = {
  entry: SleepEntry;
  minutes: number;
};

function entriesWithDuration(entries: SleepEntry[]): EntryWithDuration[] {
  return entries.map((entry) => ({
    entry,
    minutes: sleepDurationMinutes(entry.startTime, entry.endTime),
  }));
}

function averageBedtime(entries: SleepEntry[]): string | null {
  const eveningStarts = entries
    .map((entry) => entry.startTime)
    .filter((startTime) => {
      const hour = Number(startTime.split(':')[0]);
      return hour >= EVENING_BEDTIME_HOUR;
    });

  if (eveningStarts.length === 0) {
    return null;
  }

  const totalMinutes = eveningStarts.reduce((sum, time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return sum + hours * 60 + minutes;
  }, 0);
  const averageMinutes = Math.round(totalMinutes / eveningStarts.length);
  const hours = Math.floor(averageMinutes / 60);
  const minutes = averageMinutes % 60;
  const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return formatTime12h(time);
}

export function computeSleepKeyStats(entries: SleepEntry[]): SleepKeyStats | null {
  if (entries.length === 0) {
    return null;
  }

  const withDuration = entriesWithDuration(entries);
  const longest = withDuration.reduce((best, current) =>
    current.minutes > best.minutes ? current : best,
  );
  const shortest = withDuration.reduce((best, current) =>
    current.minutes < best.minutes ? current : best,
  );
  const totalMinutes = withDuration.reduce((sum, item) => sum + item.minutes, 0);
  const avgMinutes = Math.round(totalMinutes / withDuration.length);

  return {
    longest: {
      duration: formatMinutesAsDuration(longest.minutes),
      dateLabel: formatEntryDate(longest.entry.date),
    },
    shortest: {
      duration: formatMinutesAsDuration(shortest.minutes),
      dateLabel: formatEntryDate(shortest.entry.date),
    },
    avgDuration: formatMinutesAsDuration(avgMinutes),
    avgBedtime: averageBedtime(entries),
  };
}
