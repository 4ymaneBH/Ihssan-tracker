// Bottom Tab Navigation with Glassmorphism
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
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
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.colors.glassBackground,
            borderTopWidth: 1,
            borderTopColor: theme.colors.glassStroke,
            height: 70,
            paddingBottom: 16,
            paddingTop: 8,
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
        },
        tabBarBackground: () => 
            Platform.OS === 'ios' ? (
                <BlurView
                    intensity={60}
                    tint={isDark ? 'dark' : 'light'}
                    style={StyleSheet.absoluteFill}
                />
            ) : null,
        tabBarActiveTintColor: theme.colors.purple,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600' as const,
            marginTop: 4,
            letterSpacing: 0.2,
        },
    }), [theme, isDark]);

    const getTabBarIcon = React.useCallback(({ route, focused, color }: any) => {
        const icons = tabIcons[route.name];
        const iconName = focused ? icons.active : icons.inactive;
        return (
            <MaterialCommunityIcons
                name={iconName}
                size={focused ? 24 : 22}
                color={color}
            />
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
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
});

export default MainTabs;
