// Root Navigator - handles onboarding vs main app flow
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useUserPreferencesStore } from '../store';
import { useTheme } from '../context';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
    const onboardingComplete = useUserPreferencesStore(
        (state) => state.onboardingComplete
    );
    const { theme: appTheme, isDark } = useTheme();

    // Use the base theme and override only colors
    const baseTheme = isDark ? DarkTheme : DefaultTheme;

    const navigationTheme: Theme = {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            primary: appTheme.colors.primary,
            background: appTheme.colors.background,
            card: appTheme.colors.surface,
            text: appTheme.colors.text,
            border: appTheme.colors.border,
            notification: appTheme.colors.primary,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!onboardingComplete ? (
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                ) : (
                    <Stack.Screen name="Main" component={MainTabs} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;


