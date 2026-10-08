import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddSleepButton } from '@/components/home/AddSleepButton';
import { EmptySleepState } from '@/components/home/EmptySleepState';
import { HomeHeader } from '@/components/home/HomeHeader';
import { SleepEntryRow } from '@/components/home/SleepEntryRow';
import { mockSleepEntries } from '@/data/mockSleepEntries';
import { colors } from '@/theme/colors';

const LIST_BOTTOM_PADDING = 96;

export default function HomeScreen() {
  const entries = mockSleepEntries;
  const hasEntries = entries.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <HomeHeader babyName="Mia" babyAgeLabel="4mo" />
        {hasEntries ? (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SleepEntryRow entry={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptySleepState />
        )}
        <AddSleepButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: LIST_BOTTOM_PADDING,
  },
});
