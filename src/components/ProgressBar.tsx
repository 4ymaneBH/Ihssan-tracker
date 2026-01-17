// Progress Bar Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context';

interface ProgressBarProps {
    progress: number; // 0-100
    label?: string;
    value?: string;
    height?: number;
    color?: string;
    showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    label,
    value,
    height = 8,
    color,
    showPercentage = false,
}) => {
    const { theme } = useTheme();
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const progressColor = color || theme.colors.primary;

    return (
        <View style={styles.container}>
            {label && (
                <View style={styles.labelRow}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
                    {(value || showPercentage) && (
                        <Text style={[styles.value, { color: theme.colors.textSecondary }]}>
                            {value || `${Math.round(clampedProgress)}%`}
                        </Text>
                    )}
                </View>
            )}
            <View
                style={[
                    styles.track,
                    {
                        height,
                        backgroundColor: theme.colors.border,
                    },
                ]}
            >
                <View
                    style={[
                        styles.fill,
                        {
                            width: `${clampedProgress}%`,
                            height,
                            backgroundColor: progressColor,
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    value: {
        fontSize: 13,
        fontWeight: '500',
    },
    track: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    fill: {
        borderRadius: 10,
    },
});

export default ProgressBar;
