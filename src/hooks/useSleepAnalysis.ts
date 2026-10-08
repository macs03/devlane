import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSleepEntries } from '@/context/SleepEntriesContext';
import type { SleepAnalysis } from '@/types/sleepAnalysis';
import type { SleepEntry } from '@/types/sleepEntry';
import { analyzeSleepEntries, SleepAnalysisError } from '@/utils/analyzeSleepEntries';
import { getLastWeekEntries } from '@/utils/lastWeekEntries';

export type SleepAnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export type UseSleepAnalysisResult = {
  status: SleepAnalysisStatus;
  analysis: SleepAnalysis | null;
  error: string | null;
  entryCount: number;
  lastWeekEntries: SleepEntry[];
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

function weekEntryIdsSignature(weekEntries: SleepEntry[]): string {
  return [...weekEntries].map((entry) => entry.id).sort().join('|');
}

export function useSleepAnalysis(): UseSleepAnalysisResult {
  const { entries } = useSleepEntries();
  const lastWeekEntries = useMemo(() => getLastWeekEntries(entries), [entries]);
  const [status, setStatus] = useState<SleepAnalysisStatus>('idle');
  const [analysis, setAnalysis] = useState<SleepAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const analyzedIdsRef = useRef<Set<string>>(new Set());
  const loadingSignatureRef = useRef<string | null>(null);
  const entriesRef = useRef(entries);
  const analysisRef = useRef<SleepAnalysis | null>(null);
  const statusRef = useRef<SleepAnalysisStatus>('idle');
  useEffect(() => {
    entriesRef.current = entries;
    analysisRef.current = analysis;
    statusRef.current = status;
  }, [entries, analysis, status]);

  const runAnalysis = useCallback(
    async (weekEntries: SleepEntry[], signature: string, force = false) => {
      if (!force && loadingSignatureRef.current === signature) {
        return;
      }

      const requestId = ++requestIdRef.current;
      loadingSignatureRef.current = signature;
      setStatus('loading');
      setError(null);

      try {
        const result = await analyzeSleepEntries(weekEntries);
        if (requestId !== requestIdRef.current) {
          return;
        }
        analyzedIdsRef.current = new Set(weekEntries.map((entry) => entry.id));
        setAnalysis(result);
        analysisRef.current = result;
        setStatus('success');
        statusRef.current = 'success';
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        setError(toErrorMessage(err));
        setStatus('error');
        statusRef.current = 'error';
      } finally {
        if (requestId === requestIdRef.current) {
          loadingSignatureRef.current = null;
        }
      }
    },
    [],
  );

  const evaluateAndRun = useCallback(
    (force: boolean) => {
      const weekEntries = getLastWeekEntries(entriesRef.current);
      if (weekEntries.length === 0) {
        setStatus('idle');
        statusRef.current = 'idle';
        setError(null);
        return;
      }

      const signature = weekEntryIdsSignature(weekEntries);
      const analyzedIds = analyzedIdsRef.current;
      const hasCachedAnalysis =
        analysisRef.current !== null && statusRef.current === 'success';
      const allIdsAnalyzed = weekEntries.every((entry) => analyzedIds.has(entry.id));

      if (!force && hasCachedAnalysis && allIdsAnalyzed) {
        return;
      }

      void runAnalysis(weekEntries, signature, force);
    },
    [runAnalysis],
  );

  useFocusEffect(
    useCallback(() => {
      evaluateAndRun(false);
    }, [evaluateAndRun]),
  );

  const refresh = useCallback(() => {
    evaluateAndRun(true);
  }, [evaluateAndRun]);

  return {
    status,
    analysis,
    error,
    entryCount: lastWeekEntries.length,
    lastWeekEntries,
    refresh,
  };
}
