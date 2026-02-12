import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassView } from './GlassView';
import { useTheme } from '../context/ThemeContext';

interface IconCircleButtonProps extends Omit<TouchableOpacityProps, 'children'> {
    icon: keyof typeof Ionicons.glyphMap;
    size?: number;
    iconSize?: number;
    onPress?: () => void;
    haptic?: boolean;
}

/**
 * Circular glass button with icon
 * - Blur background
 * - Haptic feedback
 * - Premium interactions
 */
export function IconCircleButton({
    icon,
    size = 44,
    iconSize = 20,
    onPress,
    haptic = true,
    style,
    ...props
}: IconCircleButtonProps) {
    const { theme } = useTheme();

    const handlePress = () => {
        if (haptic) {
            Vibration.vibrate(10);
        }
        onPress?.();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={[styles.button, { width: size, height: size }, style]}
            {...props}
        >
            <GlassView
                intensity={30}
                borderRadius={size / 2}
                style={styles.glassContainer}
            >
                <Ionicons
                    name={icon}
                    size={iconSize}
                    color={theme.colors.text}
                />
            </GlassView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        overflow: 'hidden',
    },
    glassContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
