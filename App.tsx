// Main App Entry Point
import React from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold
} from '@expo-google-fonts/cairo';

import { ThemeProvider, useTheme } from './src/context';
import { RootNavigator } from './src/navigation';
import { ErrorBoundary } from './src/components';
import './src/i18n';

const AppContent: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <ErrorBoundary screenName="App">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <RootNavigator />
    </ErrorBoundary>
  );
};

export default function App() {
  // Load fonts: Amiri for Qur'an/Du'a, Cairo for modern Arabic UI
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    // Create aliases for easier use
    'Amiri': Amiri_400Regular,
    'Amiri-Bold': Amiri_700Bold,
    'Cairo': Cairo_400Regular,
    'Cairo-Medium': Cairo_500Medium,
    'Cairo-SemiBold': Cairo_600SemiBold,
    'Cairo-Bold': Cairo_700Bold,
  });


  // Show loading indicator while fonts load
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D0F12' }}>
        <ActivityIndicator size="large" color="#A4D96C" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
