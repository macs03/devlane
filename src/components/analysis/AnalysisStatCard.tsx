import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type AnalysisStatCardProps = {
  label: string;
  value: string;
  subtext: string;
};

export function AnalysisStatCard({ label, value, subtext }: AnalysisStatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.analysisStatCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.analysisStatBorder,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.analysisSectionLabel,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontFamily: 'Georgia',
    fontWeight: '400',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
