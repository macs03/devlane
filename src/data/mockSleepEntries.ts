import type { SleepEntry } from '@/types/sleepEntry';

export const mockSleepEntries: SleepEntry[] = [
  {
    id: '1',
    date: '2026-10-08',
    startTime: '06:30',
    endTime: '08:15',
    notes: 'Woke up happy',
  },
  {
    id: '2',
    date: '2026-10-07',
    startTime: '19:00',
    endTime: '06:45',
    notes: 'Night sleep',
  },
  {
    id: '3',
    date: '2026-10-07',
    startTime: '13:00',
    endTime: '14:30',
  },
  {
    id: '4',
    date: '2026-10-06',
    startTime: '18:45',
    endTime: '06:30',
  },
  {
    id: '5',
    date: '2026-10-06',
    startTime: '10:00',
    endTime: '11:20',
    notes: 'Car nap',
  },
  {
    id: '6',
    date: '2026-10-05',
    startTime: '19:15',
    endTime: '07:00',
    notes: 'One brief wake-up around 2am',
  },
  {
    id: '7',
    date: '2026-10-05',
    startTime: '14:00',
    endTime: '15:45',
  },
];
