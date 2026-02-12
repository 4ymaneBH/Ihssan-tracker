import React from 'react';
import { StyleSheet, View, Text, Platform, StatusBar } from 'react-native';
import { GlassView } from './GlassView';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GlassHeaderProps {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
    title?: string;
}

/**
 * Premium glass header bar
 * - Blur background
 * - Safe area support
 * - Flexible content sections
 */
export function GlassHeader({ left, center, right, title }: GlassHeaderProps) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <GlassView
            intensity={40}
            borderRadius={0}
            style={[
                styles.header,
                {
                    paddingTop: insets.top + 12,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                },
            ]}
        >
            <View style={styles.headerContent}>
                <View style={styles.headerSection}>
                    {left}
                </View>

                <View style={[styles.headerSection, styles.headerCenter]}>
                    {center || (title && (
                        <Text style={[
                            styles.headerTitle,
                            {
                                color: theme.colors.text,
                                fontFamily: theme.fontFamilies.inter.semiBold,
                            },
                        ]}>
                            {title}
                        </Text>
                    ))}
                </View>

                <View style={styles.headerSection}>
                    {right}
                </View>
            </View>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        minHeight: 44,
    },
    headerSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
});
