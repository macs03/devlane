import { Stack } from 'expo-router';

import { SleepEntriesProvider } from '@/context/SleepEntriesContext';

export default function RootLayout() {
  return (
    <SleepEntriesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SleepEntriesProvider>
  );
}
