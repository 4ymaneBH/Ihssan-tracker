// Insights Screen - Weekly summary and progress with monthly export
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore } from '../store';
import { formatNumber, formatPercentage, getFontFamily } from '../utils';
import { ExportModal } from '../components';
import { getCategoryBreakdown, getStreakTrend, calculateMonthlyStats, getDailyCompletionData, CategoryBreakdown, StreakData } from '../services';


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

const screenWidth = Dimensions.get('window').width;

const InsightsScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { getOnTimePercentage, getPrayerStreak, logs: salatLogs } = useSalatStore();
    const {
        getWeeklyQuranPages,
        getWeeklyCharityCount,
        getWeeklyTahajjudNights,
        adhkarLogs,
        quranLogs,
        charityLogs,
        tahajjudLogs,
        customHabits,
        customHabitLogs,
    } = useHabitsStore();

    const [showExportModal, setShowExportModal] = useState(false);
    const isArabic = i18n.language === 'ar';

    // Current month for charts
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Chart data using useMemo for performance
    const categoryData = useMemo(() =>
        getCategoryBreakdown(year, month, salatLogs, adhkarLogs, quranLogs, charityLogs, tahajjudLogs, customHabits, customHabitLogs),
        [year, month, salatLogs, adhkarLogs, quranLogs, charityLogs, tahajjudLogs, customHabits, customHabitLogs]
    );

    const streakData = useMemo(() =>
        getStreakTrend(year, month, salatLogs),
        [year, month, salatLogs]
    );

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

    // Stats configuration with icons
    const stats = [
        {
            icon: 'mosque',
            iconColor: theme.colors.primary,
            title: t('insights.salatOnTime'),
            subtitle: `${formatPercentage(salatOnTimePercent, i18n.language)} ${t('common.today')}`,
            value: formatPercentage(salatOnTimePercent, i18n.language),
            progressValue: salatOnTimePercent,
            progressMax: 100,
            progressColor: theme.colors.primary,
            progressBg: theme.colors.primaryLight,
        },
        {
            icon: 'book-open-page-variant',
            iconColor: theme.colors.success.main,
            title: t('insights.quranPages'),
            subtitle: `${formatNumber(quranPages, i18n.language)}/14 ${t('quran.pages')}`,
            value: formatNumber(quranPages, i18n.language),
            progressValue: quranPages,
            progressMax: 14,
            progressColor: theme.colors.success.main,
            progressBg: theme.colors.success.light,
        },
        {
            icon: 'heart',
            iconColor: theme.colors.error.main,
            title: t('insights.charityCount'),
            subtitle: `${formatNumber(charityCount, i18n.language)}/3 ${t('charity.thisWeek')}`,
            value: formatNumber(charityCount, i18n.language),
            progressValue: charityCount,
            progressMax: 3,
            progressColor: theme.colors.warning.main,
            progressBg: theme.colors.warning.light,
        },
        {
            icon: 'moon-waning-crescent',
            iconColor: theme.colors.info.main,
            title: t('insights.tahajjudNights'),
            subtitle: `${formatNumber(tahajjudNights, i18n.language)}/2 ${t('tahajjud.nights')}`,
            value: formatNumber(tahajjudNights, i18n.language),
            progressValue: tahajjudNights,
            progressMax: 2,
            progressColor: theme.colors.info.main,
            progressBg: theme.colors.info.light,
        },
    ];

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <View style={styles.header}>
                <Text style={[
                    styles.headerTitle,
                    { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }
                ]}>
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
                            <MaterialCommunityIcons name="fire" size={18} color={theme.colors.onPrimary} />
                            <Text style={[styles.streakText, { color: theme.colors.onPrimary }]}>
                                {formatNumber(streak, i18n.language)} {t('habits.days')} {t('habits.streak')}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Detailed Stats */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    {stats.map((stat, index) => (
                        <View key={stat.icon} style={index > 0 ? { marginTop: 24 } : undefined}>
                            <View style={styles.statRow}>
                                <View style={styles.statInfo}>
                                    <View style={[styles.iconContainer, { backgroundColor: stat.iconColor + '20' }]}>
                                        <MaterialCommunityIcons name={stat.icon as any} size={22} color={stat.iconColor} />
                                    </View>
                                    <View>
                                        <Text style={[styles.statTitle, { color: theme.colors.text }]}>
                                            {stat.title}
                                        </Text>
                                        <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
                                            {stat.subtitle}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                                    {stat.value}
                                </Text>
                            </View>
                            <ProgressBar
                                value={stat.progressValue}
                                maxValue={stat.progressMax}
                                color={stat.progressColor}
                                backgroundColor={stat.progressBg}
                            />
                        </View>
                    ))}
                </View>

                {/* Category Breakdown - Simple Bars */}
                {categoryData.length > 0 && (
                    <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'توزيع العبادات' : 'Activity Breakdown'}
                        </Text>

                        {/* Category Bars */}
                        {categoryData.map(cat => {
                            const maxValue = Math.max(...categoryData.map(c => c.value));
                            const barWidth = maxValue > 0 ? (cat.value / maxValue) * 100 : 0;
                            return (
                                <View key={cat.name} style={styles.categoryRow}>
                                    <View style={styles.categoryInfo}>
                                        <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                                        <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                                            {isArabic ? cat.nameAr : cat.name}
                                        </Text>
                                    </View>
                                    <View style={styles.categoryBarContainer}>
                                        <View
                                            style={[
                                                styles.categoryBar,
                                                { backgroundColor: cat.color, width: `${barWidth}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.categoryValue, { color: theme.colors.textSecondary }]}>
                                        {cat.value}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Streak Summary Card */}
                {streakData.length > 0 && (
                    <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'السلسلة الحالية' : 'Current Streak'}
                        </Text>
                        <View style={styles.streakSummary}>
                            <View style={[styles.streakCircle, { backgroundColor: theme.colors.primary }]}>
                                <MaterialCommunityIcons name="fire" size={28} color={theme.colors.onPrimary} />
                            </View>
                            <View>
                                <Text style={[styles.streakNumber, { color: theme.colors.text }]}>
                                    {formatNumber(streakData[streakData.length - 1]?.streak || 0, i18n.language)}
                                </Text>
                                <Text style={[styles.streakLabel, { color: theme.colors.textSecondary }]}>
                                    {isArabic ? 'أيام متتالية' : 'consecutive days'}
                                </Text>
                            </View>
                        </View>

                        {/* Max streak this month */}
                        <View style={[styles.maxStreakRow, { borderTopColor: theme.colors.border }]}>
                            <Text style={[styles.maxStreakLabel, { color: theme.colors.textSecondary }]}>
                                {isArabic ? 'أطول سلسلة هذا الشهر' : 'Longest streak this month'}
                            </Text>
                            <Text style={[styles.maxStreakValue, { color: theme.colors.primary }]}>
                                {formatNumber(Math.max(...streakData.map(d => d.streak)), i18n.language)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Empty State for Charts */}
                {categoryData.length === 0 && (
                    <View style={[styles.section, { backgroundColor: theme.colors.surface, alignItems: 'center', padding: 32 }]}>
                        <MaterialCommunityIcons name="chart-arc" size={48} color={theme.colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            {isArabic ? 'لا توجد بيانات هذا الشهر' : 'No activity data this month'}
                        </Text>
                    </View>
                )}

                {/* Export Button */}
                <TouchableOpacity
                    style={[styles.exportButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    onPress={() => setShowExportModal(true)}
                >
                    <MaterialCommunityIcons name="file-export-outline" size={22} color={theme.colors.primary} />
                    <Text style={[styles.exportButtonText, { color: theme.colors.primary }]}>
                        {isArabic ? 'تصدير التقرير الشهري' : 'Export Monthly Report'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Export Modal */}
            <ExportModal
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
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
    // Export button
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 8,
    },
    exportButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    // Charts
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginHorizontal: -10,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        fontSize: 12,
    },
    emptyText: {
        fontSize: 15,
        marginTop: 12,
        textAlign: 'center',
    },
    // Category breakdown styles
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 90,
        gap: 8,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '500',
    },
    categoryBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginHorizontal: 8,
        overflow: 'hidden',
    },
    categoryBar: {
        height: '100%',
        borderRadius: 4,
    },
    categoryValue: {
        width: 32,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'right',
    },
    // Streak summary styles
    streakSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    streakCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakNumber: {
        fontSize: 32,
        fontWeight: '700',
    },
    streakLabel: {
        fontSize: 14,
        marginTop: 2,
    },
    maxStreakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
    },
    maxStreakLabel: {
        fontSize: 14,
    },
    maxStreakValue: {
        fontSize: 18,
        fontWeight: '700',
    },
});

export default InsightsScreen;
