import { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type AnalysisLoadingStateProps = {
  entryCount: number;
};

function SkeletonLine({
  width,
  tone,
}: {
  width: `${number}%` | number;
  tone: 'dark' | 'light';
}) {
  return (
    <View
      style={[
        styles.skeletonLine,
        { width },
        tone === 'dark' ? styles.skeletonLineDark : styles.skeletonLineLight,
      ]}
    />
  );
}

export function AnalysisLoadingState({ entryCount }: AnalysisLoadingStateProps) {
  const progress = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, [progress]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['35%', '85%'],
  });

  const entryLabel = entryCount === 1 ? 'ENTRY' : 'ENTRIES';

  return (
    <View style={styles.wrapper}>
      <Text style={styles.status}>
        ANALYZING {entryCount} {entryLabel}...
      </Text>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: fillWidth }]} />
      </View>

      <View style={styles.summarySkeleton}>
        <SkeletonLine width="42%" tone="dark" />
        <SkeletonLine width="100%" tone="dark" />
        <SkeletonLine width="88%" tone="dark" />
      </View>

      <View style={styles.tipSkeleton}>
        <SkeletonLine width="100%" tone="light" />
        <SkeletonLine width="92%" tone="light" />
        <SkeletonLine width="78%" tone="light" />
      </View>

      <View style={styles.statSkeleton}>
        <SkeletonLine width="38%" tone="light" />
        <SkeletonLine width="55%" tone="light" />
      </View>
      <View style={styles.statSkeleton}>
        <SkeletonLine width="42%" tone="light" />
        <SkeletonLine width="48%" tone="light" />
      </View>
      <View style={styles.statSkeleton}>
        <SkeletonLine width="36%" tone="light" />
        <SkeletonLine width="52%" tone="light" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.analysisStatusText,
    marginTop: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.analysisProgressTrack,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.analysisProgressFill,
  },
  summarySkeleton: {
    backgroundColor: colors.skeletonSummaryCard,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 12,
  },
  tipSkeleton: {
    backgroundColor: colors.analysisTipCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.analysisTipBorder,
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 12,
  },
  statSkeleton: {
    backgroundColor: colors.analysisStatCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.analysisStatBorder,
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 14,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
  },
  skeletonLineDark: {
    backgroundColor: colors.skeletonOnDark,
  },
  skeletonLineLight: {
    backgroundColor: colors.skeletonOnLight,
  },
});
