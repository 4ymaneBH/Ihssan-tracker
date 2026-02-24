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
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore, useUserPreferencesStore } from '../store';
import { formatNumber, formatPercentage, getFontFamily, getWeekDates } from '../utils';
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
    const { goals } = useUserPreferencesStore();

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

    // Calculate weekly adhkar completion percentage
    const getWeeklyAdhkarCompletion = () => {
        const weekDates = getWeekDates();
        let completed = 0;
        let total = 0;

        weekDates.forEach(date => {
            ['morning', 'evening', 'general', 'sleep'].forEach(category => {
                const log = adhkarLogs[`adhkar-${date}-${category}`];
                if (log) {
                    completed += log.itemsCompleted;
                    total += log.totalItems;
                }
            });
        });

        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const weeklyAdhkarPercent = getWeeklyAdhkarCompletion();

    // Get user's weekly goals from settings
    const weeklyQuranGoal = (goals?.quranPagesPerDay || 2) * 7;
    const weeklyCharityGoal = goals?.charityPerWeek || 3;
    const weeklyTahajjudGoal = goals?.tahajjudNightsPerWeek || 2;

    // Calculate overall score (simple average)
    const overallScore = Math.round(
        (salatOnTimePercent +
            (quranPages / weeklyQuranGoal) * 100 +
            (charityCount / weeklyCharityGoal) * 100 +
            (tahajjudNights / weeklyTahajjudGoal) * 100 +
            weeklyAdhkarPercent) / 5 // Include adhkar in score
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
            icon: 'hands-pray',
            iconColor: theme.colors.success.dark,
            title: t('insights.adhkarCompletion'),
            subtitle: `${formatPercentage(weeklyAdhkarPercent, i18n.language)} ${t('charity.thisWeek')}`,
            value: formatPercentage(weeklyAdhkarPercent, i18n.language),
            progressValue: weeklyAdhkarPercent,
            progressMax: 100,
            progressColor: theme.colors.success.dark,
            progressBg: theme.colors.success.light,
        },
        {
            icon: 'book-open-page-variant',
            iconColor: theme.colors.success.main,
            title: t('insights.quranPages'),
            subtitle: `${formatNumber(quranPages, i18n.language)}/${formatNumber(weeklyQuranGoal, i18n.language)} ${t('quran.pages')}`,
            value: formatNumber(quranPages, i18n.language),
            progressValue: quranPages,
            progressMax: weeklyQuranGoal,
            progressColor: theme.colors.success.main,
            progressBg: theme.colors.success.light,
        },
        {
            icon: 'heart',
            iconColor: theme.colors.error.main,
            title: t('insights.charityCount'),
            subtitle: `${formatNumber(charityCount, i18n.language)}/${formatNumber(weeklyCharityGoal, i18n.language)} ${t('charity.thisWeek')}`,
            value: formatNumber(charityCount, i18n.language),
            progressValue: charityCount,
            progressMax: weeklyCharityGoal,
            progressColor: theme.colors.warning.main,
            progressBg: theme.colors.warning.light,
        },
        {
            icon: 'moon-waning-crescent',
            iconColor: theme.colors.info.main,
            title: t('insights.tahajjudNights'),
            subtitle: `${formatNumber(tahajjudNights, i18n.language)}/${formatNumber(weeklyTahajjudGoal, i18n.language)} ${t('tahajjud.nights')}`,
            value: formatNumber(tahajjudNights, i18n.language),
            progressValue: tahajjudNights,
            progressMax: weeklyTahajjudGoal,
            progressColor: theme.colors.info.main,
            progressBg: theme.colors.info.light,
        },
    ];

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
        >
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                        {t('insights.title')}
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                        {isArabic ? 'ملخص هذا الأسبوع' : 'This week\'s summary'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.exportIconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder }]}
                    onPress={() => setShowExportModal(true)}
                >
                    <MaterialCommunityIcons name="file-export-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>


            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Overall Score Card */}
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primary + 'CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.scoreCard}
                >
                    <View style={styles.scoreLeft}>
                        <Text style={[styles.scoreLabel, { color: theme.colors.onPrimary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                            {t('insights.weeklyReport')}
                        </Text>
                        <Text style={[styles.scoreValue, { color: theme.colors.onPrimary, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {formatNumber(Math.min(overallScore, 100), i18n.language)}%
                        </Text>
                        <Text style={[styles.scoreMessage, { color: 'rgba(255,255,255,0.85)', fontFamily: getFontFamily(isArabic, 'regular') }]}>
                            {getMotivationalMessage()}
                        </Text>
                        {streak > 0 && (
                            <View style={styles.scoreBadge}>
                                <MaterialCommunityIcons name="fire" size={15} color={theme.colors.primary} />
                                <Text style={[styles.scoreBadgeText, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                                    {formatNumber(streak, i18n.language)} {t('habits.days')}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.scoreRing}>
                        <View style={[styles.scoreRingInner, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                            <MaterialCommunityIcons name="star-four-points" size={28} color="rgba(255,255,255,0.9)" />
                        </View>
                    </View>
                </LinearGradient>

                {/* Detailed Stats */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.cardBorder }]}>
                    {stats.map((stat, index) => (
                        <View key={stat.icon} style={[
                            index > 0 && { marginTop: 20, paddingTop: 20, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderLight },
                        ]}>
                            <View style={styles.statRow}>
                                <View style={styles.statInfo}>
                                    <View style={[styles.iconContainer, { backgroundColor: stat.iconColor + '18' }]}>
                                        <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.iconColor} />
                                    </View>
                                    <View>
                                        <Text style={[styles.statTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                                            {stat.title}
                                        </Text>
                                        <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                            {stat.subtitle}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.statValuePill, { backgroundColor: stat.progressColor + '15' }]}>
                                    <Text style={[styles.statValue, { color: stat.progressColor, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                        {stat.value}
                                    </Text>
                                </View>
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
                    <View style={[styles.section, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.cardBorder }]}>
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
                    <LinearGradient
                        colors={['#F97316' + '22', '#EF4444' + '10']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.streakBanner, { borderColor: '#F97316' + '30' }]}
                    >
                        <View style={[styles.streakCircle, { backgroundColor: '#F97316' }]}>
                            <MaterialCommunityIcons name="fire" size={26} color="#FFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.streakNumber, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                {formatNumber(streakData[streakData.length - 1]?.streak || 0, i18n.language)} {isArabic ? 'يوم' : 'days'}
                            </Text>
                            <Text style={[styles.streakLabel, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                {isArabic ? 'أيام متتالية — أطول: ' : 'streak — best: '}
                                {formatNumber(Math.max(...streakData.map(d => d.streak)), i18n.language)}
                            </Text>
                        </View>
                    </LinearGradient>
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
    // Header
    headerSubtitle: { fontSize: 13, marginTop: 2 },
    exportIconBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Score card
    scoreCard: {
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreLeft: { flex: 1, gap: 6 },
    scoreLabel: { fontSize: 13, opacity: 0.9 },
    scoreValue: { fontSize: 52, lineHeight: 60 },
    scoreMessage: { fontSize: 14, lineHeight: 20 },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    scoreBadgeText: { fontSize: 13 },
    scoreRing: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
    scoreRingInner: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Stat value pill
    statValuePill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    // Streak banner
    streakBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    streakText: { fontSize: 15, fontWeight: '600' },
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
        height: 90,
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
