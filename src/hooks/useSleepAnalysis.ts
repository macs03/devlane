import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSleepEntries } from '@/context/SleepEntriesContext';
import type { SleepAnalysis } from '@/types/sleepAnalysis';
import { analyzeSleepEntries, SleepAnalysisError } from '@/utils/analyzeSleepEntries';
import { getLastWeekEntries } from '@/utils/lastWeekEntries';

export type SleepAnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export type UseSleepAnalysisResult = {
  status: SleepAnalysisStatus;
  analysis: SleepAnalysis | null;
  error: string | null;
  entryCount: number;
  refresh: () => void;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof SleepAnalysisError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong while analyzing sleep entries.';
}

export function useSleepAnalysis(): UseSleepAnalysisResult {
  const { entries } = useSleepEntries();
  const lastWeekEntries = useMemo(() => getLastWeekEntries(entries), [entries]);
  const [status, setStatus] = useState<SleepAnalysisStatus>('idle');
  const [analysis, setAnalysis] = useState<SleepAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const [refreshToken, setRefreshToken] = useState(0);

  const refresh = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    void (async () => {
      setStatus('loading');
      setError(null);

      try {
        const weekEntries = getLastWeekEntries(entries);
        const result = await analyzeSleepEntries(weekEntries);
        if (requestId !== requestIdRef.current) {
          return;
        }
        setAnalysis(result);
        setStatus('success');
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setAnalysis(null);
        setError(toErrorMessage(err));
        setStatus('error');
      }
    })();
  }, [entries, refreshToken]);

  return {
    status,
    analysis,
    error,
    entryCount: lastWeekEntries.length,
    refresh,
  };
}
