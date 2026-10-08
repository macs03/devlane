import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSleepAnalysis } from '@/hooks/useSleepAnalysis';
import { colors } from '@/theme/colors';

export default function AnalysisScreen() {
  const { status, analysis, error, entryCount, refresh } = useSleepAnalysis();

  const isLoading = status === 'loading' || status === 'idle';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Weekly analysis</Text>
        <Text style={styles.subtitle}>
          Based on {entryCount} {entryCount === 1 ? 'entry' : 'entries'} from the last 7 days of
          your log
        </Text>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.brandIndigo} />
            <Text style={styles.loadingText}>Analyzing sleep patterns…</Text>
          </View>
        ) : null}

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

        {status === 'success' && analysis ? (
          <View style={styles.content}>
            <View style={styles.summaryCard}>
              <Text style={styles.sectionLabel}>Summary</Text>
              <Text style={styles.summaryText}>{analysis.summary}</Text>
            </View>
            {analysis.insights.length > 0 ? (
              <View style={styles.insightsCard}>
                <Text style={styles.sectionLabel}>Insights</Text>
                {analysis.insights.map((insight, index) => (
                  <View key={`${index}-${insight.slice(0, 24)}`} style={styles.insightRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Refresh analysis"
              onPress={refresh}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}>
              <Text style={styles.secondaryButtonText}>Refresh</Text>
            </Pressable>
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    gap: 16,
  },
  summaryCard: {
    backgroundColor: colors.accentLavender,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.accentLavenderBorder,
  },
  insightsCard: {
    backgroundColor: colors.fieldBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accentMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.brandIndigo,
  },
  insightText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
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
  secondaryButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonPressed: {
    opacity: 0.7,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.brandIndigo,
  },
});
