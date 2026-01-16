// Insights Screen - Weekly summary and progress
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore } from '../store';
import { formatNumber, formatPercentage } from '../utils';

interface ProgressBarProps {
    value: number;
    maxValue: number;
    color: string;
    backgroundColor: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    maxValue,
    color,
    backgroundColor,
}) => {
    const percentage = Math.min((value / maxValue) * 100, 100);

    return (
        <View style={[styles.progressBar, { backgroundColor }]}>
            <View
                style={[
                    styles.progressFill,
                    { backgroundColor: color, width: `${percentage}%` },
                ]}
            />
        </View>
    );
};

const InsightsScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { getOnTimePercentage, getPrayerStreak } = useSalatStore();
    const { getWeeklyQuranPages, getWeeklyCharityCount, getWeeklyTahajjudNights } = useHabitsStore();

    const salatOnTimePercent = getOnTimePercentage(7);
    const streak = getPrayerStreak();
    const quranPages = getWeeklyQuranPages();
    const charityCount = getWeeklyCharityCount();
    const tahajjudNights = getWeeklyTahajjudNights();

    // Calculate overall score (simple average)
    const overallScore = Math.round(
        (salatOnTimePercent +
            (quranPages / 14) * 100 + // Assuming 2 pages/day goal
            (charityCount / 3) * 100 + // Assuming 3/week goal
            (tahajjudNights / 2) * 100) / 4 // Assuming 2/week goal
    );

    const getMotivationalMessage = () => {
        if (overallScore >= 80) return t('insights.greatWeek');
        return t('insights.keepGoing');
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('insights.title')}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Overall Score Card */}
                <View
                    style={[
                        styles.scoreCard,
                        { backgroundColor: theme.colors.primary },
                    ]}
                >
                    <Text style={[styles.scoreLabel, { color: theme.colors.onPrimary }]}>
                        {t('insights.weeklyReport')}
                    </Text>
                    <Text style={[styles.scoreValue, { color: theme.colors.onPrimary }]}>
                        {formatNumber(Math.min(overallScore, 100), i18n.language)}%
                    </Text>
                    <Text style={[styles.scoreMessage, { color: theme.colors.onPrimary }]}>
                        {getMotivationalMessage()}
                    </Text>
                    {streak > 0 && (
                        <View style={styles.streakRow}>
                            <Text style={[styles.streakText, { color: theme.colors.onPrimary }]}>
                                🔥 {formatNumber(streak, i18n.language)} {t('habits.days')} {t('habits.streak')}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Detailed Stats */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    {/* Salat */}
                    <View style={styles.statRow}>
                        <View style={styles.statInfo}>
                            <Text style={styles.statEmoji}>🕌</Text>
                            <View>
                                <Text style={[styles.statTitle, { color: theme.colors.text }]}>
                                    {t('insights.salatOnTime')}
                                </Text>
                                <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
                                    {formatPercentage(salatOnTimePercent, i18n.language)} {t('common.today')}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {formatPercentage(salatOnTimePercent, i18n.language)}
                        </Text>
                    </View>
                    <ProgressBar
                        value={salatOnTimePercent}
                        maxValue={100}
                        color={theme.colors.primary}
                        backgroundColor={theme.colors.primaryLight}
                    />

                    {/* Qur'an */}
                    <View style={[styles.statRow, { marginTop: 20 }]}>
                        <View style={styles.statInfo}>
                            <Text style={styles.statEmoji}>📖</Text>
                            <View>
                                <Text style={[styles.statTitle, { color: theme.colors.text }]}>
                                    {t('insights.quranPages')}
                                </Text>
                                <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
                                    {formatNumber(quranPages, i18n.language)}/14 {t('quran.pages')}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {formatNumber(quranPages, i18n.language)}
                        </Text>
                    </View>
                    <ProgressBar
                        value={quranPages}
                        maxValue={14}
                        color={theme.colors.success.main}
                        backgroundColor={theme.colors.success.light}
                    />

                    {/* Charity */}
                    <View style={[styles.statRow, { marginTop: 20 }]}>
                        <View style={styles.statInfo}>
                            <Text style={styles.statEmoji}>❤️</Text>
                            <View>
                                <Text style={[styles.statTitle, { color: theme.colors.text }]}>
                                    {t('insights.charityCount')}
                                </Text>
                                <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
                                    {formatNumber(charityCount, i18n.language)}/3 {t('charity.thisWeek')}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {formatNumber(charityCount, i18n.language)}
                        </Text>
                    </View>
                    <ProgressBar
                        value={charityCount}
                        maxValue={3}
                        color={theme.colors.warning.main}
                        backgroundColor={theme.colors.warning.light}
                    />

                    {/* Tahajjud */}
                    <View style={[styles.statRow, { marginTop: 20 }]}>
                        <View style={styles.statInfo}>
                            <Text style={styles.statEmoji}>🌙</Text>
                            <View>
                                <Text style={[styles.statTitle, { color: theme.colors.text }]}>
                                    {t('insights.tahajjudNights')}
                                </Text>
                                <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
                                    {formatNumber(tahajjudNights, i18n.language)}/2 {t('tahajjud.nights')}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                            {formatNumber(tahajjudNights, i18n.language)}
                        </Text>
                    </View>
                    <ProgressBar
                        value={tahajjudNights}
                        maxValue={2}
                        color={theme.colors.info.main}
                        backgroundColor={theme.colors.info.light}
                    />
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    // Score card
    scoreCard: {
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 14,
        fontWeight: '500',
        opacity: 0.9,
    },
    scoreValue: {
        fontSize: 64,
        fontWeight: '700',
        marginTop: 8,
    },
    scoreMessage: {
        fontSize: 16,
        marginTop: 8,
        opacity: 0.9,
    },
    streakRow: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    streakText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // Section
    section: {
        borderRadius: 20,
        padding: 20,
    },
    // Stat row
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statEmoji: {
        fontSize: 28,
    },
    statTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    statSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    // Progress bar
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    bottomSpacer: {
        height: 24,
    },
});

export default InsightsScreen;
