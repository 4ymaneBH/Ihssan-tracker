import React from 'react';
import { StyleSheet, View, Text, Platform, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
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
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
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
            <View style={[styles.headerContent, isArabic && styles.headerContentRTL]}>
                <View style={[styles.headerSection, isArabic && styles.headerSectionLeft]}>
                    {isArabic ? right : left}
                </View>

                <View style={[styles.headerSection, styles.headerCenter]}>
                    {center || (title && (
                        <Text style={[
                            styles.headerTitle,
                            {
                                color: theme.colors.text,
                                fontFamily: isArabic ? theme.fontFamilies.arabic.semiBold : theme.fontFamilies.inter.semiBold,
                            },
                        ]}>
                            {title}
                        </Text>
                    ))}
                </View>

                <View style={[styles.headerSection, isArabic && styles.headerSectionRight]}>
                    {isArabic ? left : right}
                </View>
            </View>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        minHeight: 60,
    },
    headerSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerSectionLeft: {
        justifyContent: 'flex-end',
    },
    headerSectionRight: {
        justifyContent: 'flex-start',
    },
    headerContentRTL: {
        flexDirection: 'row-reverse',
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
