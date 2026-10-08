import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { mockSleepEntries } from '@/data/mockSleepEntries';
import type { SleepEntry } from '@/types/sleepEntry';

type SleepEntriesContextValue = {
  entries: SleepEntry[];
  addEntry: (entry: SleepEntry) => void;
};

const SleepEntriesContext = createContext<SleepEntriesContextValue | null>(null);

export function SleepEntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<SleepEntry[]>(mockSleepEntries);

  const addEntry = useCallback((entry: SleepEntry) => {
    setEntries((current) => [entry, ...current]);
  }, []);

  const value = useMemo(
    () => ({
      entries,
      addEntry,
    }),
    [entries, addEntry],
  );

  return <SleepEntriesContext.Provider value={value}>{children}</SleepEntriesContext.Provider>;
}

export function useSleepEntries(): SleepEntriesContextValue {
  const context = useContext(SleepEntriesContext);
  if (!context) {
    throw new Error('useSleepEntries must be used within SleepEntriesProvider');
  }
  return context;
}
