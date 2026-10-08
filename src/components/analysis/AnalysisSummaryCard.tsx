import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type AnalysisSummaryCardProps = {
  metaLabel: string;
  summary: string;
};

export function AnalysisSummaryCard({ metaLabel, summary }: AnalysisSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.meta}>{metaLabel}</Text>
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.analysisSummaryCard,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  meta: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: colors.analysisSummaryMeta,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.analysisSummaryText,
  },
});
