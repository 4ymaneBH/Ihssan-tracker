// AppCard - Standardized card component for consistent styling
import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
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

    const cardStyle: ViewStyle[] = [
        styles.card,
        {
            backgroundColor: backgroundColor || theme.colors.surface,
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            borderWidth: 1,
        },
        !isDark && styles.lightShadow,
        isDark && styles.darkShadow,
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.7}
                testID={testID}
            >
                {children}
            </TouchableOpacity>
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
