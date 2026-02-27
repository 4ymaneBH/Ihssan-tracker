// Bottom Tab Navigation - Premium floating tab bar
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MainTabParamList } from '../types';
import { useTheme } from '../context';

// Screens
import TodayScreen from '../screens/TodayScreen';
import TrackScreen from '../screens/TrackScreen';
import InsightsScreen from '../screens/InsightsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Better, clearer icon set
type IconName =
    | 'home-variant' | 'home-variant-outline'
    | 'calendar-month' | 'calendar-month-outline'
    | 'chart-line' | 'chart-line-variant'
    | 'tune-variant' | 'tune';

const tabIcons: Record<string, { active: IconName; inactive: IconName }> = {
    Today:    { active: 'home-variant',     inactive: 'home-variant-outline' },
    Track:    { active: 'calendar-month',   inactive: 'calendar-month-outline' },
    Insights: { active: 'chart-line',       inactive: 'chart-line-variant' },
    Settings: { active: 'tune-variant',     inactive: 'tune' },
};

const MainTabs: React.FC = () => {
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    // Icon rendered per tab — solid pill on active, plain icon on inactive
    const getTabBarIcon = React.useCallback(
        ({ route, focused }: { route: { name: string }; focused: boolean }) => {
            const icons = tabIcons[route.name];
            const iconName = focused ? icons.active : icons.inactive;
            const activeColor   = theme.colors.onPrimary;          // contrasting color on pill
            const inactiveColor = isDark
                ? 'rgba(255,255,255,0.45)'
                : 'rgba(0,0,0,0.35)';

            if (focused) {
                return (
                    <View style={[styles.activePill, { backgroundColor: theme.colors.primary }]}>
                        <MaterialCommunityIcons name={iconName} size={20} color={activeColor} />
                    </View>
                );
            }
            return (
                <View style={styles.inactiveIcon}>
                    <MaterialCommunityIcons name={iconName} size={22} color={inactiveColor} />
                </View>
            );
        },
        [theme.colors, isDark],
    );

    const screenOptions = React.useMemo(() => ({
        headerShown: false,
        // Override label — we hide the default label and render nothing
        // (label is already provided via tabBarLabel on each screen)
        tabBarActiveTintColor:   theme.colors.primary,
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)',
        tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600' as const,
            marginTop: 0,
            letterSpacing: 0.2,
        },
        tabBarStyle: {
            position: 'absolute' as const,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: 76,
            paddingBottom: 12,
            paddingTop: 10,
            elevation: 0,
        },
        tabBarBackground: () => (
            <View style={[StyleSheet.absoluteFill, styles.tabBarBg]}>
                {Platform.OS === 'ios' ? (
                    <BlurView
                        tint={isDark ? 'dark' : 'light'}
                        intensity={isDark ? 80 : 90}
                        style={StyleSheet.absoluteFill}
                    />
                ) : null}
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: isDark
                                ? 'rgba(7,14,10,0.96)'
                                : 'rgba(255,255,255,0.95)',
                            borderTopWidth: 1,
                            borderTopColor: isDark
                                ? 'rgba(14,165,113,0.1)'
                                : 'rgba(0,0,0,0.08)',
                        },
                    ]}
                />
            </View>
        ),
    }), [theme.colors, isDark]);

    return (
        <Tab.Navigator
            key={isDark ? 'dark' : 'light'}
            screenOptions={({ route }) => ({
                ...screenOptions,
                tabBarIcon: ({ focused }) => getTabBarIcon({ route, focused }),
            })}
        >
            <Tab.Screen
                name="Today"
                component={TodayScreen}
                options={{ tabBarLabel: t('common.today') }}
            />
            <Tab.Screen
                name="Track"
                component={TrackScreen}
                options={{ tabBarLabel: t('common.track') }}
            />
            <Tab.Screen
                name="Insights"
                component={InsightsScreen}
                options={{ tabBarLabel: t('common.insights') }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ tabBarLabel: t('common.settings') }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarBg: {
        // Lifted shadow on Android
        ...Platform.select({
            android: {
                elevation: 24,
                shadowColor: '#000',
            },
        }),
    },
    activePill: {
        width: 52,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        // subtle shadow so pill floats
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
    },
    inactiveIcon: {
        width: 52,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MainTabs;
