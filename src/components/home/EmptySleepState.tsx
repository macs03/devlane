import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function EmptySleepState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <FontAwesome name="moon-o" size={36} color={colors.textPrimary} />
      </View>
      <Text style={styles.title}>No entries yet</Text>
      <Text style={styles.subtitle}>Tap + to log your first sleep</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: colors.accentLavender,
    borderWidth: 1,
    borderColor: colors.accentLavenderBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Georgia',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.accentMuted,
    textAlign: 'center',
  },
});
