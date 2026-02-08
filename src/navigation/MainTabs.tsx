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
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#212529',  // Dark background from reference
                    borderTopWidth: 0,           // No border
                    height: 70,                  // Compact height
                    paddingBottom: 16,           // Space for labels
                    paddingTop: 8,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                },
                tabBarActiveTintColor: '#A4D96C',     // Neon green
                tabBarInactiveTintColor: '#6C757D',   // Gray
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = tabIcons[route.name];
                    const iconName = focused ? icons.active : icons.inactive;
                    return (
                        <MaterialCommunityIcons
                            name={iconName}
                            size={focused ? 24 : 22}
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
