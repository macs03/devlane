import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnalysisLoadingState } from '@/components/analysis/AnalysisLoadingState';
import { AnalysisStatCard } from '@/components/analysis/AnalysisStatCard';
import { AnalysisSummaryCard } from '@/components/analysis/AnalysisSummaryCard';
import { useSleepAnalysis } from '@/hooks/useSleepAnalysis';
import { colors } from '@/theme/colors';
import { formatLastWeekAnalysisRange } from '@/utils/lastWeekEntries';
import { computeSleepKeyStats } from '@/utils/sleepKeyStats';

export default function AnalysisScreen() {
  const { status, analysis, error, entryCount, lastWeekEntries, refresh } = useSleepAnalysis();

  const keyStats = useMemo(() => computeSleepKeyStats(lastWeekEntries), [lastWeekEntries]);
  const rangeLabel = useMemo(
    () => formatLastWeekAnalysisRange(lastWeekEntries),
    [lastWeekEntries],
  );

  const isEmptyWeek = entryCount === 0;
  const isLoading = !isEmptyWeek && (status === 'loading' || status === 'idle');
  const showResults = status === 'success' && analysis !== null && keyStats !== null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Analysis</Text>
        <View style={styles.titleDivider} />

        {isEmptyWeek ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No entries this week</Text>
            <Text style={styles.emptyMessage}>
              Log sleep in the last 7 days to see AI analysis and key stats.
            </Text>
          </View>
        ) : null}

        {isLoading && entryCount > 0 ? <AnalysisLoadingState entryCount={entryCount} /> : null}

        {status === 'error' && error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Could not load analysis</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Try again"
              onPress={refresh}
              style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}>
              <Text style={styles.retryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : null}

        {showResults ? (
          <View style={styles.content}>
            <Text style={styles.sectionLabel}>Summary</Text>
            <AnalysisSummaryCard
              metaLabel={rangeLabel ? `AI · ${rangeLabel}` : 'AI'}
              summary={analysis.summary}
            />

            <Text style={[styles.sectionLabel, styles.statsSectionLabel]}>Key stats</Text>
            <View style={styles.statsList}>
              <AnalysisStatCard
                label="Longest sleep"
                value={keyStats.longest.duration}
                subtext={keyStats.longest.dateLabel}
              />
              <AnalysisStatCard
                label="Shortest sleep"
                value={keyStats.shortest.duration}
                subtext={keyStats.shortest.dateLabel}
              />
              <AnalysisStatCard
                label="Avg duration"
                value={keyStats.avgDuration}
                subtext="this week"
              />
              {keyStats.avgBedtime ? (
                <AnalysisStatCard
                  label="Avg bedtime"
                  value={keyStats.avgBedtime}
                  subtext="this week"
                />
              ) : null}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Georgia',
    fontWeight: '400',
    color: colors.analysisTitle,
    marginTop: 8,
  },
  titleDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginTop: 16,
    marginBottom: 20,
  },
  content: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.analysisSectionLabel,
    textTransform: 'uppercase',
  },
  statsSectionLabel: {
    marginTop: 8,
  },
  statsList: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: colors.fieldBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  errorCard: {
    backgroundColor: colors.fieldBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandIndigo,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
