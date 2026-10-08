import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddSleepButton } from '@/components/home/AddSleepButton';
import { EmptySleepState } from '@/components/home/EmptySleepState';
import { HomeHeader } from '@/components/home/HomeHeader';
import { colors } from '@/theme/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <HomeHeader babyName="Mia" babyAgeLabel="4mo" />
        <EmptySleepState />
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
});
