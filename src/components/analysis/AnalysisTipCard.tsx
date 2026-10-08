import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type AnalysisTipCardProps = {
  tip: string;
};

export function AnalysisTipCard({ tip }: AnalysisTipCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.tip}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.analysisTipCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.analysisTipBorder,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  tip: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.analysisTipText,
  },
});
