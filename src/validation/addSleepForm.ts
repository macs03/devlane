import { z } from 'zod';

import { dateToIsoString, dateToTimeString, startOfToday } from '@/utils/sleepDuration';

const MIN_DURATION_MINUTES = 1;
const MAX_DURATION_MINUTES = 18 * 60;
const MAX_NOTES_LENGTH = 280;

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function isRealClockTime(date: Date): boolean {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function calendarDayStart(date: Date): Date {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

function oneYearAgoStart(): Date {
  const day = startOfToday();
  day.setFullYear(day.getFullYear() - 1);
  return day;
}

function combineDateAndTime(calendarDate: Date, clockTime: Date): Date {
  const combined = new Date(calendarDate);
  combined.setHours(clockTime.getHours(), clockTime.getMinutes(), 0, 0);
  return combined;
}

function resolveSessionEnd(sessionStart: Date, calendarDate: Date, wakeTime: Date): Date {
  const sessionEnd = combineDateAndTime(calendarDate, wakeTime);
  const wakeMinutes = wakeTime.getHours() * 60 + wakeTime.getMinutes();
  const sleepMinutes = sessionStart.getHours() * 60 + sessionStart.getMinutes();
  if (wakeMinutes <= sleepMinutes) {
    sessionEnd.setDate(sessionEnd.getDate() + 1);
  }
  return sessionEnd;
}

function sessionDurationMinutes(sessionStart: Date, sessionEnd: Date): number {
  return (sessionEnd.getTime() - sessionStart.getTime()) / (60 * 1000);
}

const validDateSchema = z.custom<Date>(
  (value) => isValidDate(value),
  { message: 'Enter a valid date.' },
);

const clockTimeSchema = z.custom<Date>(
  (value) => isValidDate(value) && isRealClockTime(value),
  { message: 'Enter a valid sleep time.' },
);

const wakeTimeSchema = z.custom<Date>(
  (value) => isValidDate(value) && isRealClockTime(value),
  { message: 'Enter a valid wake time.' },
);

export const addSleepFormSchema = z
  .object({
    date: validDateSchema,
    sleepTime: clockTimeSchema,
    wakeTime: wakeTimeSchema,
    notes: z.string(),
  })
  .superRefine((data, ctx) => {
    const today = startOfToday();
    const selectedDay = calendarDayStart(data.date);
    const oldestAllowed = oneYearAgoStart();

    if (selectedDay.getTime() > today.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date cannot be in the future.',
        path: ['date'],
      });
    }

    if (selectedDay.getTime() < oldestAllowed.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date is too far in the past.',
        path: ['date'],
      });
    }

    const sessionStart = combineDateAndTime(data.date, data.sleepTime);
    const sessionEnd = resolveSessionEnd(sessionStart, data.date, data.wakeTime);
    const durationMinutes = sessionDurationMinutes(sessionStart, sessionEnd);
    const now = new Date();

    if (durationMinutes < MIN_DURATION_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sleep duration must be at least 1 minute.',
        path: ['duration'],
      });
    } else if (durationMinutes > MAX_DURATION_MINUTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sleep duration cannot exceed 18 hours.',
        path: ['duration'],
      });
    }

    if (sessionStart.getTime() > now.getTime() || sessionEnd.getTime() > now.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sleep session cannot end in the future.',
        path: ['duration'],
      });
    }

    const trimmedNotes = data.notes.trim();
    if (trimmedNotes.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Notes are required.',
        path: ['notes'],
      });
    } else if (trimmedNotes.length > MAX_NOTES_LENGTH) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Notes must be ${MAX_NOTES_LENGTH} characters or fewer.`,
        path: ['notes'],
      });
    }
  });

export type AddSleepFormInput = z.infer<typeof addSleepFormSchema>;

export type AddSleepFormField = 'date' | 'sleepTime' | 'wakeTime' | 'notes' | 'duration';

export type AddSleepFormFieldErrors = Partial<Record<AddSleepFormField, string>>;

export type ValidatedAddSleepForm = {
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
};

export function fieldErrorsFromZodError(error: z.ZodError): AddSleepFormFieldErrors {
  const errors: AddSleepFormFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      field === 'date' ||
      field === 'sleepTime' ||
      field === 'wakeTime' ||
      field === 'notes' ||
      field === 'duration'
    ) {
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
  }
  return errors;
}

export function validateAddSleepForm(input: AddSleepFormInput):
  | { success: true; data: ValidatedAddSleepForm }
  | { success: false; errors: AddSleepFormFieldErrors } {
  const result = addSleepFormSchema.safeParse(input);
  if (!result.success) {
    return { success: false, errors: fieldErrorsFromZodError(result.error) };
  }

  const trimmedNotes = result.data.notes.trim();
  return {
    success: true,
    data: {
      date: dateToIsoString(result.data.date),
      startTime: dateToTimeString(result.data.sleepTime),
      endTime: dateToTimeString(result.data.wakeTime),
      notes: trimmedNotes,
    },
  };
}
