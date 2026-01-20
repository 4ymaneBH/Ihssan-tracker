// Skeleton Loader Component - Animated loading placeholders
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../context';

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
}) => {
    const { theme, isDark } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 750,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();

        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    opacity,
                    backgroundColor: isDark ? '#3A3A3A' : '#E0E0E0',
                },
                style,
            ]}
        />
    );
};

// Card Skeleton - For habit cards
interface CardSkeletonProps {
    style?: ViewStyle;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ style }) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.cardSkeleton,
                { backgroundColor: theme.colors.surface },
                style,
            ]}
        >
            {/* Header */}
            <View style={styles.skeletonHeader}>
                <Skeleton width={40} height={40} borderRadius={12} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Skeleton width="60%" height={18} />
                    <Skeleton width="40%" height={14} style={{ marginTop: 6 }} />
                </View>
            </View>

            {/* Content */}
            <View style={styles.skeletonContent}>
                <Skeleton width="100%" height={8} style={{ marginBottom: 12 }} />
                <View style={styles.skeletonRow}>
                    <Skeleton width="30%" height={40} borderRadius={12} />
                    <Skeleton width="30%" height={40} borderRadius={12} />
                    <Skeleton width="30%" height={40} borderRadius={12} />
                </View>
            </View>
        </View>
    );
};

// Prayer Pill Skeleton
export const PrayerPillSkeleton: React.FC = () => {
    return (
        <View style={styles.prayerPillSkeleton}>
            <Skeleton width={60} height={70} borderRadius={16} />
        </View>
    );
};

// Insights Chart Skeleton
export const ChartSkeleton: React.FC = () => {
    const { theme } = useTheme();

    return (
        <View style={[styles.chartSkeleton, { backgroundColor: theme.colors.surface }]}>
            <Skeleton width="40%" height={20} style={{ marginBottom: 16 }} />
            <View style={styles.barsContainer}>
                {[60, 80, 45, 90, 70].map((height, index) => (
                    <Skeleton
                        key={index}
                        width={40}
                        height={height}
                        borderRadius={4}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardSkeleton: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    skeletonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    skeletonContent: {
        marginTop: 8,
    },
    skeletonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    prayerPillSkeleton: {
        flex: 1,
    },
    chartSkeleton: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    barsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 100,
    },
});
