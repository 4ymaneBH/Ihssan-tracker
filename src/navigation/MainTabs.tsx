// Bottom Tab Navigation with Material Icons
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
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
    'chart-arc' | 'chart-arc-outline' |
    'cog' | 'cog-outline';

const tabIcons: Record<string, { active: IconName; inactive: IconName }> = {
    Today: { active: 'view-dashboard', inactive: 'view-dashboard-outline' },
    Track: { active: 'calendar-check', inactive: 'calendar-check-outline' },
    Insights: { active: 'chart-arc', inactive: 'chart-arc-outline' },
    Settings: { active: 'cog', inactive: 'cog-outline' },
};

const MainTabs: React.FC = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.tabBarBackground,
                    borderTopColor: theme.colors.tabBarBorder,
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10,
                    elevation: 8,
                    shadowColor: theme.colors.text,
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.tabBarInactive,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = tabIcons[route.name];
                    const iconName = focused ? icons.active : icons.inactive;
                    return (
                        <MaterialCommunityIcons
                            name={iconName}
                            size={24}
                            color={color}
                        />
                    );
                },
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
