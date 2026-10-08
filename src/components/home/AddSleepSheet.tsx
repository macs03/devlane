import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SleepEntry } from '@/types/sleepEntry';
import { colors } from '@/theme/colors';
import {
  dateToIsoString,
  dateToTimeString,
  formatSheetDate,
  formatSleepDuration,
  formatTime12hFromDate,
  startOfToday,
  timeAt,
} from '@/utils/sleepDuration';

type PickerField = 'date' | 'sleep' | 'wake';

type AddSleepSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (entry: SleepEntry) => void;
};

type FormState = {
  date: Date;
  sleepTime: Date;
  wakeTime: Date;
  notes: string;
};

function createInitialFormState(): FormState {
  return {
    date: startOfToday(),
    sleepTime: timeAt(20, 45),
    wakeTime: timeAt(5, 20),
    notes: '',
  };
}

type FieldRowProps = {
  label: string;
  value: string;
  active: boolean;
  onPress: () => void;
};

function FieldRow({ label, value, active, onPress }: FieldRowProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={[styles.fieldInput, active && styles.fieldInputActive]}>
        <Text style={styles.fieldValue}>{value}</Text>
        <FontAwesome name="chevron-down" size={12} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

export function AddSleepSheet({ visible, onClose, onSubmit }: AddSleepSheetProps) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<FormState>(createInitialFormState);
  const [activePicker, setActivePicker] = useState<PickerField | null>(null);

  const handleClose = () => {
    setForm(createInitialFormState());
    setActivePicker(null);
    onClose();
  };

  const startTime = dateToTimeString(form.sleepTime);
  const endTime = dateToTimeString(form.wakeTime);
  const durationLabel = useMemo(
    () => formatSleepDuration(startTime, endTime),
    [startTime, endTime],
  );

  const handlePickerChange = (field: PickerField) => (event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS === 'android') {
      setActivePicker(null);
      if (event.type === 'dismissed' || !value) {
        return;
      }
    } else if (!value) {
      return;
    }
    setForm((current) => {
      if (field === 'date') {
        return { ...current, date: value };
      }
      if (field === 'sleep') {
        return { ...current, sleepTime: value };
      }
      return { ...current, wakeTime: value };
    });
  };

  const handleSubmit = () => {
    const trimmedNotes = form.notes.trim();
    const entry: SleepEntry = {
      id: String(Date.now()),
      date: dateToIsoString(form.date),
      startTime,
      endTime,
      ...(trimmedNotes ? { notes: trimmedNotes } : {}),
    };
    onSubmit(entry);
    handleClose();
  };

  const pickerMode = activePicker === 'date' ? 'date' : 'time';
  const pickerValue =
    activePicker === 'date'
      ? form.date
      : activePicker === 'sleep'
        ? form.sleepTime
        : form.wakeTime;

  const showIosInlinePicker = Platform.OS === 'ios' && activePicker !== null;
  const showAndroidPicker = Platform.OS === 'android' && activePicker !== null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <Pressable style={styles.overlay} onPress={handleClose} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add Sleep Entry</Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <FieldRow
              label="DATE"
              value={formatSheetDate(form.date)}
              active={activePicker === 'date'}
              onPress={() => setActivePicker('date')}
            />
            {showIosInlinePicker && activePicker === 'date' ? (
              <DateTimePicker
                value={form.date}
                mode="date"
                display="spinner"
                onChange={handlePickerChange('date')}
              />
            ) : null}

            <FieldRow
              label="SLEEP TIME"
              value={formatTime12hFromDate(form.sleepTime)}
              active={activePicker === 'sleep'}
              onPress={() => setActivePicker('sleep')}
            />
            {showIosInlinePicker && activePicker === 'sleep' ? (
              <DateTimePicker
                value={form.sleepTime}
                mode="time"
                display="spinner"
                onChange={handlePickerChange('sleep')}
              />
            ) : null}

            <FieldRow
              label="WAKE TIME"
              value={formatTime12hFromDate(form.wakeTime)}
              active={activePicker === 'wake'}
              onPress={() => setActivePicker('wake')}
            />
            {showIosInlinePicker && activePicker === 'wake' ? (
              <DateTimePicker
                value={form.wakeTime}
                mode="time"
                display="spinner"
                onChange={handlePickerChange('wake')}
              />
            ) : null}

            <Text style={styles.duration}>
              Duration: <Text style={styles.durationValue}>{durationLabel}</Text>
            </Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>NOTES (OPTIONAL)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="e.g. woke once at 3am..."
                placeholderTextColor={colors.inputPlaceholder}
                value={form.notes}
                onChangeText={(text) => setForm((current) => ({ ...current, notes: text }))}
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            onPress={handleSubmit}
            style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]}>
            <Text style={styles.submitButtonText}>Add entry</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {showAndroidPicker && activePicker ? (
        <DateTimePicker
          value={pickerValue}
          mode={pickerMode}
          onChange={handlePickerChange(activePicker)}
        />
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.sheetOverlay,
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 20,
    maxHeight: '92%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Georgia',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.fieldLabel,
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  fieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.fieldBackground,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fieldInputActive: {
    backgroundColor: colors.accentLavender,
    borderColor: colors.accentLavenderBorder,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  durationValue: {
    fontWeight: '600',
    color: colors.accentMuted,
  },
  notesInput: {
    minHeight: 96,
    backgroundColor: colors.fieldBackground,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.fabBackground,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonPressed: {
    opacity: 0.92,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.background,
  },
});
