import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" /> 
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="teams/page" />
        <Stack.Screen name="teams/[id]/page" />
        <Stack.Screen name="match/[id]/page" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="mordu" />
      </Stack>
    </>
  );
}