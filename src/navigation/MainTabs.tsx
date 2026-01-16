// Bottom Tab Navigation
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MainTabParamList } from '../types';
import { useTheme } from '../context';

// Screens
import TodayScreen from '../screens/TodayScreen';
import TrackScreen from '../screens/TrackScreen';
import InsightsScreen from '../screens/InsightsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Simple icon components
const TabIcon: React.FC<{ name: string; color: string; focused: boolean }> = ({
    name,
    color,
    focused,
}) => {
    const iconPaths: Record<string, string> = {
        today: '📋',
        track: '📊',
        insights: '💡',
        settings: '⚙️',
    };

    return (
        <View style={[styles.iconContainer, focused && styles.iconFocused]}>
            <View style={styles.icon}>
                <View style={{ opacity: focused ? 1 : 0.7 }}>
                    <View style={styles.iconText}>
                        {/* Using emoji as placeholder - can be replaced with custom icons */}
                    </View>
                </View>
            </View>
        </View>
    );
};

const MainTabs: React.FC = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.tabBarBackground,
                    borderTopColor: theme.colors.tabBarBorder,
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: theme.colors.tabBarActive,
                tabBarInactiveTintColor: theme.colors.tabBarInactive,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Today"
                component={TodayScreen}
                options={{
                    tabBarLabel: t('common.today'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="today" color={color} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Track"
                component={TrackScreen}
                options={{
                    tabBarLabel: t('common.track'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="track" color={color} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Insights"
                component={InsightsScreen}
                options={{
                    tabBarLabel: t('common.insights'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="insights" color={color} focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarLabel: t('common.settings'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="settings" color={color} focused={focused} />
                    ),
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
    iconFocused: {},
    icon: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 20,
    },
});

export default MainTabs;
