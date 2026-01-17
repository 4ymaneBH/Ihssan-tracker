// Root Navigator - handles onboarding vs main app flow with detail screens
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useUserPreferencesStore } from '../store';
import { useTheme } from '../context';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import AdhkarScreen from '../screens/AdhkarScreen';
import TahajjudScreen from '../screens/TahajjudScreen';
import QuranScreen from '../screens/QuranScreen';
import ProfileScreen from '../screens/ProfileScreen';
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
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen
                            name="Adhkar"
                            component={AdhkarScreen}
                            options={{ presentation: 'card' }}
                        />
                        <Stack.Screen
                            name="Tahajjud"
                            component={TahajjudScreen}
                            options={{ presentation: 'card' }}
                        />
                        <Stack.Screen
                            name="Quran"
                            component={QuranScreen}
                            options={{ presentation: 'card' }}
                        />
                        <Stack.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{ presentation: 'card' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
