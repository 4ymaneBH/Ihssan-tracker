// Root Navigator - handles onboarding vs main app flow with detail screens
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useUserPreferencesStore, useAuthStore } from '../store';
import { useTheme } from '../context';
import { AppBackground } from '../components';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import AdhkarScreen from '../screens/AdhkarScreen';
import DuaScreen from '../screens/DuaScreen';
import TahajjudScreen from '../screens/TahajjudScreen';
import QuranScreen from '../screens/QuranScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import QiblaScreen from '../screens/QiblaScreen';
import KhatamTrackerScreen from '../screens/KhatamTrackerScreen';
import SocialScreen from '../screens/social/SocialScreen';
import CreateGroupScreen from '../screens/social/CreateGroupScreen';
import GroupDetailsScreen from '../screens/social/GroupDetailsScreen';
import JoinGroupScreen from '../screens/social/JoinGroupScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
    const onboardingComplete = useUserPreferencesStore(
        (state) => state.onboardingComplete
    );
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const { theme: appTheme, isDark } = useTheme();

    // Use the base theme and override only colors
    const baseTheme = isDark ? DarkTheme : DefaultTheme;

    const navigationTheme: Theme = {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            primary: appTheme.colors.primary,
            background: 'transparent', // Make navigation background transparent
            card: appTheme.colors.surface,
            text: appTheme.colors.text,
            border: appTheme.colors.border,
            notification: appTheme.colors.primary,
        },
    };

    return (
        <View style={{ flex: 1 }}>
            <AppBackground />
            <NavigationContainer theme={navigationTheme}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'transparent' },
                        animation: 'slide_from_right', // Consistent animation
                    }}
                >
                    {!onboardingComplete ? (
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    ) : !isAuthenticated ? (
                        <>
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="SignUp" component={SignUpScreen} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Main" component={MainTabs} />
                            <Stack.Screen name="Adhkar" component={AdhkarScreen} />
                            <Stack.Screen name="Dua" component={DuaScreen} />
                            <Stack.Screen name="Tahajjud" component={TahajjudScreen} />
                            <Stack.Screen name="Quran" component={QuranScreen} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                            <Stack.Screen name="Qibla" component={QiblaScreen} />
                            <Stack.Screen name="Khatam" component={KhatamTrackerScreen} />
                            <Stack.Screen name="Social" component={SocialScreen} />
                            <Stack.Screen
                                name="CreateGroup"
                                component={CreateGroupScreen}
                                options={{ presentation: 'modal' }}
                            />
                            <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
                            <Stack.Screen
                                name="JoinGroup"
                                component={JoinGroupScreen}
                                options={{ presentation: 'modal' }}
                            />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
};

export default RootNavigator;
