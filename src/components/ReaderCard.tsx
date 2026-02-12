import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from './GlassCard';
import { useTheme } from '../context/ThemeContext';

interface ReaderCardProps {
    arabicText: string;
    transliteration?: string;
    translation?: string;
    counter?: React.ReactNode;
}

/**
 * Premium reader card for Adhkar and Dua
 * - Large glass surface
 * - Arabic text with Amiri font
 * - Transliteration and translation
 * - Counter section
 */
export function ReaderCard({
    arabicText,
    transliteration,
    translation,
    counter,
}: ReaderCardProps) {
    const { theme } = useTheme();

    return (
        <GlassCard
            borderRadius={28}
            style={styles.card}
        >
            <View style={styles.content}>
                {/* Arabic Text */}
                <Text
                    style={[
                        styles.arabicText,
                        {
                            color: theme.colors.text,
                        },
                    ]}
                >
                    {arabicText}
                </Text>

                {/* Transliteration */}
                {transliteration && (
                    <Text
                        style={[
                            styles.transliteration,
                            {
                                color: theme.colors.textSecondary,
                                fontFamily: theme.fontFamilies.inter.regular,
                            },
                        ]}
                    >
                        {transliteration}
                    </Text>
                )}

                {/* Translation */}
                {translation && (
                    <Text
                        style={[
                            styles.translation,
                            {
                                color: theme.colors.textSecondary,
                                fontFamily: theme.fontFamilies.inter.regular,
                            },
                        ]}
                    >
                        {translation}
                    </Text>
                )}

                {/* Counter */}
                {counter && (
                    <View style={styles.counterContainer}>
                        {counter}
                    </View>
                )}
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
    },
    content: {
        padding: 24,
        gap: 16,
    },
    arabicText: {
        fontSize: 24,
        lineHeight: 42,
        textAlign: 'right',
        fontFamily: 'Amiri_400Regular',
    },
    transliteration: {
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    translation: {
        fontSize: 14,
        lineHeight: 22,
    },
    counterContainer: {
        marginTop: 8,
        alignItems: 'center',
    },
});
