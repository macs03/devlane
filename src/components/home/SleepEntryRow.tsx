import { StyleSheet, Text, View } from 'react-native';

import type { SleepEntry } from '@/types/sleepEntry';
import { colors } from '@/theme/colors';
import {
  formatEntryDate,
  formatSleepDuration,
  formatTimeRange,
} from '@/utils/sleepDuration';

type SleepEntryRowProps = {
  entry: SleepEntry;
};

export function SleepEntryRow({ entry }: SleepEntryRowProps) {
  const dateLabel = formatEntryDate(entry.date);
  const timeRange = formatTimeRange(entry.startTime, entry.endTime);
  const duration = formatSleepDuration(entry.startTime, entry.endTime);

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <Text style={styles.date}>{dateLabel}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.timeRange}>{timeRange}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
        {entry.notes ? <Text style={styles.notes}>{entry.notes}</Text> : null}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  date: {
    fontSize: 17,
    fontFamily: 'Georgia',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeRange: {
    fontSize: 15,
    color: colors.textSecondary,
    flex: 1,
  },
  duration: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accentMuted,
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: 20,
  },
});
