import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context';

export const AppBackground: React.FC = () => {
    const { isDark } = useTheme();

    if (isDark) {
        // For dark mode, we use a subtle dark gradient
        return (
            <LinearGradient
                colors={['#0f172a', '#1e293b', '#0f172a']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
        );
    }

    // Light mode: "light green blurred gradient" simulation
    // We use a multi-stop gradient to create softness
    return (
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                // Soft teal/green to white
                colors={['#effef5', '#dffceb', '#f0fdf4', '#ffffff']}
                locations={[0, 0.4, 0.7, 1]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
        </View>
    );
};
