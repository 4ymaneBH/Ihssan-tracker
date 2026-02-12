// Bottom Tab Navigation with Frosted Glass Effect
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
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

// Tab icon mapping
type IconName = 'view-dashboard' | 'view-dashboard-outline' |
    'calendar-check' | 'calendar-check-outline' |
    'chart-donut' | 'chart-donut-variant' |
    'cog' | 'cog-outline';

const tabIcons: Record<string, { active: IconName; inactive: IconName }> = {
    Today: { active: 'view-dashboard', inactive: 'view-dashboard-outline' },
    Track: { active: 'calendar-check', inactive: 'calendar-check-outline' },
    Insights: { active: 'chart-donut', inactive: 'chart-donut-variant' },
    Settings: { active: 'cog', inactive: 'cog-outline' },
};

const MainTabs: React.FC = () => {
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    // Memoize screen options to ensure they update when theme changes
    const screenOptions = React.useMemo(() => ({
        headerShown: false,
        tabBarStyle: {
            position: 'absolute' as const,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: 72,
            paddingBottom: 14,
            paddingTop: 8,
            elevation: 0,
        },
        tabBarBackground: () => (
            <View style={StyleSheet.absoluteFill}>
                {Platform.OS === 'ios' ? (
                    <BlurView
                        tint={isDark ? 'dark' : 'light'}
                        intensity={isDark ? 60 : 80}
                        style={StyleSheet.absoluteFill}
                    />
                ) : null}
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: theme.colors.tabBarBackground,
                            borderTopWidth: StyleSheet.hairlineWidth,
                            borderTopColor: theme.colors.tabBarBorder,
                        },
                    ]}
                />
            </View>
        ),
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600' as const,
            marginTop: 2,
        },
    }), [theme.colors, isDark]);

    const getTabBarIcon = React.useCallback(({ route, focused, color }: any) => {
        const icons = tabIcons[route.name];
        const iconName = focused ? icons.active : icons.inactive;
        return (
            <View style={styles.iconWrapper}>
                {focused && (
                    <View style={[styles.activeIndicator, { backgroundColor: color + '20' }]} />
                )}
                <MaterialCommunityIcons
                    name={iconName}
                    size={focused ? 24 : 22}
                    color={color}
                />
            </View>
        );
    }, []);

    return (
        <Tab.Navigator
            key={isDark ? 'dark' : 'light'}
            screenOptions={({ route }) => ({
                ...screenOptions,
                tabBarIcon: (props) => getTabBarIcon({ route, ...props }),
            })}
        >
            <Tab.Screen
                name="Today"
                component={TodayScreen}
                options={{
                    tabBarLabel: t('common.today'),
                }}
            />
            <Tab.Screen
                name="Track"
                component={TrackScreen}
                options={{
                    tabBarLabel: t('common.track'),
                }}
            />
            <Tab.Screen
                name="Insights"
                component={InsightsScreen}
                options={{
                    tabBarLabel: t('common.insights'),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: t('common.settings'),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 32,
    },
    activeIndicator: {
        position: 'absolute',
        width: 48,
        height: 32,
        borderRadius: 16,
    },
});

export default MainTabs;
