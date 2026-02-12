// Adhkar Screen - Premium Reader Experience
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useTranslation } from 'react-i18next';
import {
    GradientBackground,
    GlassHeader,
    IconCircleButton,
    ReaderCard,
    CounterPill,
    PrimaryGradientButton,
    GlassView,
} from '../components';
import { useTheme } from '../context';
import { useHabitsStore } from '../store';
import { getDateString } from '../utils';
import { adhkarContent } from '../data';

const { width } = Dimensions.get('window');

interface AdhkarScreenProps {
    route?: {
        params?: {
            category?: 'morning' | 'evening';
        };
    };
}

export default function AdhkarScreen({ route }: AdhkarScreenProps) {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logAdhkar } = useHabitsStore();

    const category = route?.params?.category || 'morning';
    const [currentPage, setCurrentPage] = useState(0);
    const [counts, setCounts] = useState<Record<number, number>>({});

    const adhkars = adhkarContent[category];
    const today = getDateString(new Date());

    const handleIncrement = (index: number, max: number) => {
        const current = counts[index] || 0;
        if (current < max) {
            setCounts({ ...counts, [index]: current + 1 });
        }
    };

    const handleDecrement = (index: number) => {
        const current = counts[index] || 0;
        if (current > 0) {
            setCounts({ ...counts, [index]: current - 1 });
        }
    };

    const currentAdhkar = adhkars[currentPage];
    const currentCount = counts[currentPage] || 0;
    const isComplete = currentCount >= currentAdhkar.repeatCount;

    const handleComplete = () => {
        const itemsCompleted = Object.values(counts).filter((c) => c > 0).length;
        logAdhkar(today, category, itemsCompleted, adhkars.length);
        // Navigate back or show completion
    };

    return (
        <GradientBackground>
            <GlassHeader
                title={t(`adhkar.${category}`)}
                left={<IconCircleButton icon="arrow-back" />}
                right={<IconCircleButton icon="search-outline" />}
            />

            {/* Progress Indicator */}
            <GlassView
                intensity={30}
                borderRadius={0}
                style={styles.progressBar}
            >
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${((currentPage + 1) / adhkars.length) * 100}%`,
                            backgroundColor: theme.colors.primary,
                        },
                    ]}
                />
            </GlassView>

            <View style={styles.pagerContainer}>
                <PagerView
                    style={styles.pager}
                    initialPage={0}
                    onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
                >
                    {adhkars.map((adhkar, index) => (
                        <View key={index} style={styles.page}>
                            <ScrollView
                                contentContainerStyle={styles.pageContent}
                                showsVerticalScrollIndicator={false}
                            >
                                <ReaderCard
                                    arabicText={adhkar.arabic}
                                    transliteration={adhkar.transliteration}
                                    translation={adhkar.translation}
                                    counter={
                                        <CounterPill
                                            count={counts[index] || 0}
                                            max={adhkar.count}
                                            onIncrement={() => handleIncrement(index, adhkar.count)}
                                            onDecrement={() => handleDecrement(index)}
                                        />
                                    }
                                />
                            </ScrollView>
                        </View>
                    ))}
                </PagerView>
            </View>

            {/* Complete Button */}
            {currentPage === adhkars.length - 1 && isComplete && (
                <View style={styles.completeContainer}>
                    <PrimaryGradientButton
                        title={t('adhkar.markComplete')}
                        onPress={handleComplete}
                    />
                </View>
            )}

            {/* Page Indicator */}
            <View style={styles.pageIndicator}>
                <Text
                    style={[
                        styles.pageText,
                        {
                            color: theme.colors.textSecondary,
                            fontFamily: theme.fontFamilies.inter.medium,
                        },
                    ]}
                >
                    {currentPage + 1} / {adhkars.length}
                </Text>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    progressBar: {
        height: 4,
        width: '100%',
    },
    progressFill: {
        height: '100%',
    },
    pagerContainer: {
        flex: 1,
    },
    pager: {
        flex: 1,
    },
    page: {
        width,
        flex: 1,
    },
    pageContent: {
        paddingVertical: 20,
        paddingBottom: 40,
    },
    completeContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    pageIndicator: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    pageText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
