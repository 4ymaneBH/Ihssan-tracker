// Reusable Card Component with gradient backgrounds and soft shadows
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../context';

interface CardProps {
    children: ReactNode;
    backgroundColor?: string;
    emoji?: string;
    title?: string;
    subtitle?: string;
    rightContent?: ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
    children,
    backgroundColor,
    emoji,
    title,
    subtitle,
    rightContent,
    onPress,
    style,
}) => {
    const { theme } = useTheme();

    const content = (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: backgroundColor || theme.colors.surface,
                    shadowColor: theme.colors.text,
                },
                style,
            ]}
        >
            {(emoji || title || rightContent) && (
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
                        <View style={styles.titleContainer}>
                            {title && (
                                <Text style={[styles.title, { color: theme.colors.text }]}>
                                    {title}
                                </Text>
                            )}
                            {subtitle && (
                                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                    </View>
                    {rightContent}
                </View>
            )}
            {children}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    emoji: {
        fontSize: 28,
        marginRight: 12,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 13,
        marginTop: 2,
    },
});

export default Card;
