import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type HomeHeaderProps = {
  babyName: string;
  babyAgeLabel: string;
};

export function HomeHeader({ babyName, babyAgeLabel }: HomeHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.logo}>
          <Text style={styles.logoSleep}>Sleep</Text>
          <Text style={styles.logoLog}>log</Text>
        </Text>
        <View style={styles.profilePill}>
          <Text style={styles.profilePillText}>{babyName} · {babyAgeLabel}</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: '400',
  },
  logoSleep: {
    color: colors.textPrimary,
  },
  logoLog: {
    color: colors.brandIndigo,
  },
  profilePill: {
    backgroundColor: colors.profilePillBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  profilePillText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.profilePillText,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: 0,
  },
});
