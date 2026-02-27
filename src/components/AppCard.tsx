// AppCard - Standardized card component with press-scale animation
import React, { useRef } from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context';

interface AppCardProps {
    children: React.ReactNode;
    backgroundColor?: string;
    style?: ViewStyle;
    onPress?: () => void;
    testID?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
    children,
    backgroundColor,
    style,
    onPress,
    testID,
}) => {
    const { theme, isDark } = useTheme();
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 30,
            bounciness: 6,
        }).start();
    };

    const cardStyle: ViewStyle[] = [
        styles.card,
        {
            backgroundColor: backgroundColor || theme.colors.surface,
            borderColor: isDark ? 'rgba(14,165,113,0.1)' : 'rgba(0,0,0,0.04)',
            borderWidth: 1,
        },
        !isDark && styles.lightShadow,
        isDark && styles.darkShadow,
        style,
    ];

    if (onPress) {
        return (
            <Animated.View style={{ transform: [{ scale }] }}>
                <TouchableOpacity
                    style={cardStyle}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                    testID={testID}
                >
                    {children}
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <View style={cardStyle} testID={testID}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
    },
    lightShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    darkShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
});
