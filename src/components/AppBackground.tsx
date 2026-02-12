import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context';

export const AppBackground: React.FC = () => {
    const { isDark } = useTheme();

    if (isDark) {
        // Rich dark mode gradient with subtle blue-green tint
        return (
            <LinearGradient
                colors={['#0B0E14', '#101824', '#0D1520', '#0B0E14']}
                locations={[0, 0.35, 0.7, 1]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
        );
    }

    // Light mode: soft multi-tone gradient with warmth
    return (
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={['#F0FDF4', '#ECFDF5', '#F5F3FF', '#FFFFFF', '#FFF7ED']}
                locations={[0, 0.25, 0.5, 0.75, 1]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
        </View>
    );
};
