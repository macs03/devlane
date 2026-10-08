import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

type AddSleepButtonProps = {
  onPress?: () => void;
};

export function AddSleepButton({ onPress }: AddSleepButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Log sleep"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
      <FontAwesome name="plus" size={28} color={colors.background} />
    </Pressable>
  );
}

const FAB_SIZE = 56;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: 16,
    backgroundColor: colors.fabBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.fabShadow,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
