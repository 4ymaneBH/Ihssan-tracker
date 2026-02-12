import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassView } from './GlassView';
import { useTheme } from '../context/ThemeContext';

interface CounterPillProps {
    count: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
    max?: number;
}

/**
 * Premium counter pill for Adhkar
 * - Glass background
 * - Increment/decrement buttons
 * - Smooth interactions
 */
export function CounterPill({ count, onIncrement, onDecrement, max }: CounterPillProps) {
    const { theme } = useTheme();
    const isComplete = max !== undefined && count >= max;

    return (
        <GlassView
            intensity={30}
            borderRadius={24}
            style={styles.pill}
        >
            <View style={styles.container}>
                {/* Decrement */}
                <TouchableOpacity
                    onPress={onDecrement}
                    disabled={count <= 0}
                    style={[
                        styles.button,
                        { opacity: count <= 0 ? 0.3 : 1 },
                    ]}
                >
                    <Ionicons
                        name="remove"
                        size={20}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>

                {/* Count */}
                <View style={styles.countContainer}>
                    <Text
                        style={[
                            styles.count,
                            {
                                color: isComplete ? theme.colors.success.main : theme.colors.text,
                                fontFamily: theme.fontFamilies.inter.semiBold,
                            },
                        ]}
                    >
                        {count}
                    </Text>
                    {max !== undefined && (
                        <Text
                            style={[
                                styles.max,
                                {
                                    color: theme.colors.textTertiary,
                                    fontFamily: theme.fontFamilies.inter.regular,
                                },
                            ]}
                        >
                            / {max}
                        </Text>
                    )}
                </View>

                {/* Increment */}
                <TouchableOpacity
                    onPress={onIncrement}
                    disabled={isComplete}
                    style={[
                        styles.button,
                        { opacity: isComplete ? 0.3 : 1 },
                    ]}
                >
                    <Ionicons
                        name="add"
                        size={20}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
            </View>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    pill: {
        alignSelf: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    button: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        minWidth: 60,
        justifyContent: 'center',
    },
    count: {
        fontSize: 20,
        fontWeight: '600',
    },
    max: {
        fontSize: 14,
    },
});
