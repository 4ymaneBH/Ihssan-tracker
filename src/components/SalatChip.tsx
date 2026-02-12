import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GlassView } from './GlassView';
import { useTheme } from '../context/ThemeContext';

type SalatStatus = 'not-done' | 'done' | 'missed';

interface SalatChipProps {
    name: string;
    status: SalatStatus;
    onPress?: () => void;
}

/**
 * Premium salat tracking chip
 * - Glass surface
 * - Animated state transitions
 * - Minimal color coding
 */
export function SalatChip({ name, status, onPress }: SalatChipProps) {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        scale.value = withSpring(0.95, {}, () => {
            scale.value = withSpring(1);
        });
        onPress?.();
    };

    const getStatusColor = () => {
        switch (status) {
            case 'done':
                return theme.colors.success.main;
            case 'missed':
                return theme.colors.error.main;
            default:
                return theme.colors.textTertiary;
        }
    };

    const showCheckmark = status === 'done';

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.9}
            style={styles.container}
        >
            <Animated.View style={animatedStyle}>
                <GlassView
                    intensity={30}
                    borderRadius={16}
                    style={[
                        styles.chip,
                        status === 'done' && styles.chipDone,
                    ]}
                >
                    <View style={styles.content}>
                        <Text
                            style={[
                                styles.name,
                                {
                                    color: theme.colors.text,
                                    fontFamily: theme.fontFamilies.inter.medium,
                                },
                            ]}
                        >
                            {name}
                        </Text>

                        {showCheckmark && (
                            <Ionicons
                                name="checkmark-circle"
                                size={18}
                                color={getStatusColor()}
                            />
                        )}

                        {status === 'not-done' && (
                            <View
                                style={[
                                    styles.indicator,
                                    { backgroundColor: getStatusColor() },
                                ]}
                            />
                        )}

                        {status === 'missed' && (
                            <View
                                style={[
                                    styles.indicator,
                                    { backgroundColor: getStatusColor() },
                                ]}
                            />
                        )}
                    </View>
                </GlassView>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        minWidth: 100,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    chipDone: {
        opacity: 0.9,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
