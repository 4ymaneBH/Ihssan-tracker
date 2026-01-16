// Root Navigator - handles onboarding vs main app flow
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager } from 'react-native';
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
    const { theme, isDark } = useTheme();

    return (
        <NavigationContainer
            theme={{
                dark: isDark,
                colors: {
                    primary: theme.colors.primary,
                    background: theme.colors.background,
                    card: theme.colors.surface,
                    text: theme.colors.text,
                    border: theme.colors.border,
                    notification: theme.colors.primary,
                },
            }}
        >
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
