// Today Screen - Main Dashboard
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore } from '../store';
import { getDateString, formatNumber } from '../utils';
import { SalatName, SalatStatus } from '../types';

// Salat Card Component
const SalatCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logPrayer, getTodayLog, getPrayerStreak } = useSalatStore();

    const todayLog = getTodayLog();
    const streak = getPrayerStreak();
    const today = getDateString(new Date());

    const prayers: { key: SalatName; label: string }[] = [
        { key: 'fajr', label: t('salat.fajr') },
        { key: 'dhuhr', label: t('salat.dhuhr') },
        { key: 'asr', label: t('salat.asr') },
        { key: 'maghrib', label: t('salat.maghrib') },
        { key: 'isha', label: t('salat.isha') },
    ];

    const getStatusColor = (status: SalatStatus) => {
        if (status === 'onTime') return theme.colors.success.main;
        if (status === 'late') return theme.colors.warning.main;
        if (status === 'missed') return theme.colors.error.main;
        return theme.colors.border;
    };

    const getStatusEmoji = (status: SalatStatus) => {
        if (status === 'onTime') return '✓';
        if (status === 'late') return '⏰';
        if (status === 'missed') return '✗';
        return '';
    };

    const cyclePrayerStatus = (prayer: SalatName) => {
        const currentStatus = todayLog?.[prayer];
        let newStatus: SalatStatus;

        if (!currentStatus) newStatus = 'onTime';
        else if (currentStatus === 'onTime') newStatus = 'late';
        else if (currentStatus === 'late') newStatus = 'missed';
        else newStatus = null;

        logPrayer(today, prayer, newStatus);
    };

    const completedCount = prayers.filter(
        (p) => todayLog?.[p.key] && todayLog[p.key] !== 'missed'
    ).length;

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.salat }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.cardEmoji}>🕌</Text>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('salat.title')}
                    </Text>
                </View>
                {streak > 0 && (
                    <View style={[styles.streakBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.streakText, { color: theme.colors.onPrimary }]}>
                            🔥 {formatNumber(streak, i18n.language)}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.prayerGrid}>
                {prayers.map((prayer) => {
                    const status = todayLog?.[prayer.key];
                    return (
                        <TouchableOpacity
                            key={prayer.key}
                            style={[
                                styles.prayerItem,
                                {
                                    backgroundColor: theme.colors.surface,
                                    borderColor: getStatusColor(status),
                                    borderWidth: status ? 2 : 1,
                                },
                            ]}
                            onPress={() => cyclePrayerStatus(prayer.key)}
                        >
                            <Text style={[styles.prayerLabel, { color: theme.colors.text }]}>
                                {prayer.label}
                            </Text>
                            <Text style={[styles.prayerStatus, { color: getStatusColor(status) }]}>
                                {getStatusEmoji(status)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={[styles.cardSubtext, { color: theme.colors.textSecondary }]}>
                {formatNumber(completedCount, i18n.language)}/5 {t('salat.prayersCompleted')}
            </Text>
        </View>
    );
};

// Adhkar Card Component
const AdhkarCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logAdhkar, getAdhkarLog } = useHabitsStore();

    const today = getDateString(new Date());
    const morningLog = getAdhkarLog(today, 'morning');
    const eveningLog = getAdhkarLog(today, 'evening');

    const handleAdhkarPress = (category: 'morning' | 'evening') => {
        const currentLog = category === 'morning' ? morningLog : eveningLog;
        const isComplete = currentLog?.itemsCompleted === currentLog?.totalItems;

        if (!currentLog || !isComplete) {
            logAdhkar(today, category, 10, 10); // Mark as complete
        }
    };

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.adhkar }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.cardEmoji}>📿</Text>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('adhkar.title')}
                    </Text>
                </View>
            </View>

            <View style={styles.adhkarRow}>
                <TouchableOpacity
                    style={[
                        styles.adhkarItem,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: morningLog ? theme.colors.success.main : theme.colors.border,
                            borderWidth: morningLog ? 2 : 1,
                        },
                    ]}
                    onPress={() => handleAdhkarPress('morning')}
                >
                    <Text style={styles.adhkarEmoji}>🌅</Text>
                    <Text style={[styles.adhkarLabel, { color: theme.colors.text }]}>
                        {t('adhkar.morning')}
                    </Text>
                    {morningLog && (
                        <Text style={[styles.checkmark, { color: theme.colors.success.main }]}>✓</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.adhkarItem,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: eveningLog ? theme.colors.success.main : theme.colors.border,
                            borderWidth: eveningLog ? 2 : 1,
                        },
                    ]}
                    onPress={() => handleAdhkarPress('evening')}
                >
                    <Text style={styles.adhkarEmoji}>🌆</Text>
                    <Text style={[styles.adhkarLabel, { color: theme.colors.text }]}>
                        {t('adhkar.evening')}
                    </Text>
                    {eveningLog && (
                        <Text style={[styles.checkmark, { color: theme.colors.success.main }]}>✓</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Qur'an Card Component
const QuranCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logQuranReading, getTodayQuranLog, getWeeklyQuranPages } = useHabitsStore();

    const todayLog = getTodayQuranLog();
    const weeklyPages = getWeeklyQuranPages();

    const handleAddPages = (pages: number) => {
        logQuranReading(pages);
    };

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.quran }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.cardEmoji}>📖</Text>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('quran.title')}
                    </Text>
                </View>
                <Text style={[styles.weeklyCount, { color: theme.colors.textSecondary }]}>
                    {formatNumber(weeklyPages, i18n.language)} {t('quran.pages')} this week
                </Text>
            </View>

            <View style={styles.quranContent}>
                <View style={styles.quranToday}>
                    <Text style={[styles.quranTodayLabel, { color: theme.colors.textSecondary }]}>
                        {t('common.today')}:
                    </Text>
                    <Text style={[styles.quranTodayValue, { color: theme.colors.text }]}>
                        {formatNumber(todayLog?.pages || 0, i18n.language)} {t('quran.pages')}
                    </Text>
                </View>

                <View style={styles.quranButtons}>
                    {[1, 2, 5].map((pages) => (
                        <TouchableOpacity
                            key={pages}
                            style={[styles.quranButton, { backgroundColor: theme.colors.surface }]}
                            onPress={() => handleAddPages(pages)}
                        >
                            <Text style={[styles.quranButtonText, { color: theme.colors.primary }]}>
                                +{formatNumber(pages, i18n.language)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

// Charity Card Component
const CharityCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logCharity, getWeeklyCharityCount } = useHabitsStore();

    const weeklyCount = getWeeklyCharityCount();

    const charityTypes = [
        { type: 'money' as const, emoji: '💰', label: t('charity.money') },
        { type: 'food' as const, emoji: '🍞', label: t('charity.food') },
        { type: 'time' as const, emoji: '⏱️', label: t('charity.time') },
        { type: 'help' as const, emoji: '🤝', label: t('charity.help') },
    ];

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.charity }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.cardEmoji}>❤️</Text>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('charity.sadaqah')}
                    </Text>
                </View>
                <Text style={[styles.weeklyCount, { color: theme.colors.textSecondary }]}>
                    {formatNumber(weeklyCount, i18n.language)} {t('charity.thisWeek')}
                </Text>
            </View>

            <View style={styles.charityGrid}>
                {charityTypes.map((charity) => (
                    <TouchableOpacity
                        key={charity.type}
                        style={[styles.charityItem, { backgroundColor: theme.colors.surface }]}
                        onPress={() => logCharity(charity.type)}
                    >
                        <Text style={styles.charityEmoji}>{charity.emoji}</Text>
                        <Text style={[styles.charityLabel, { color: theme.colors.text }]}>
                            {charity.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// Tahajjud Card Component
const TahajjudCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logTahajjud, getTodayTahajjud, getWeeklyTahajjudNights } = useHabitsStore();

    const todayLog = getTodayTahajjud();
    const weeklyNights = getWeeklyTahajjudNights();

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.tahajjud }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <Text style={styles.cardEmoji}>🌙</Text>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('tahajjud.title')}
                    </Text>
                </View>
                <Text style={[styles.weeklyCount, { color: theme.colors.textSecondary }]}>
                    {formatNumber(weeklyNights, i18n.language)} {t('tahajjud.nights')} {t('tahajjud.thisWeek')}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.tahajjudButton,
                    {
                        backgroundColor: todayLog?.completed
                            ? theme.colors.success.main
                            : theme.colors.surface,
                        borderColor: todayLog?.completed
                            ? theme.colors.success.main
                            : theme.colors.border,
                    },
                ]}
                onPress={() => logTahajjud(!todayLog?.completed)}
            >
                <Text
                    style={[
                        styles.tahajjudButtonText,
                        {
                            color: todayLog?.completed
                                ? theme.colors.onPrimary
                                : theme.colors.text,
                        },
                    ]}
                >
                    {todayLog?.completed ? `✓ ${t('tahajjud.completed')}` : t('tahajjud.nightPrayer')}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// Main Today Screen
const TodayScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();

    const today = new Date();
    const formattedDate = today.toLocaleDateString(
        i18n.language === 'ar' ? 'ar-SA' : 'en-US',
        { weekday: 'long', month: 'long', day: 'numeric' }
    );

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('common.today')}
                </Text>
                <Text style={[styles.headerDate, { color: theme.colors.textSecondary }]}>
                    {formattedDate}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <SalatCard />
                <AdhkarCard />
                <QuranCard />
                <CharityCard />
                <TahajjudCard />

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
    headerDate: {
        fontSize: 15,
        marginTop: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    card: {
        borderRadius: 20,
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardEmoji: {
        fontSize: 24,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    cardSubtext: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
    },
    streakBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    streakText: {
        fontSize: 14,
        fontWeight: '600',
    },
    weeklyCount: {
        fontSize: 13,
    },
    // Prayer grid
    prayerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    prayerItem: {
        width: 60,
        height: 70,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    prayerLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    prayerStatus: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 4,
    },
    // Adhkar
    adhkarRow: {
        flexDirection: 'row',
        gap: 12,
    },
    adhkarItem: {
        flex: 1,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    adhkarEmoji: {
        fontSize: 28,
        marginBottom: 8,
    },
    adhkarLabel: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    checkmark: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 8,
    },
    // Qur'an
    quranContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quranToday: {},
    quranTodayLabel: {
        fontSize: 13,
    },
    quranTodayValue: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 4,
    },
    quranButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    quranButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    quranButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // Charity
    charityGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    charityItem: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    charityEmoji: {
        fontSize: 24,
        marginBottom: 6,
    },
    charityLabel: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
    },
    // Tahajjud
    tahajjudButton: {
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        borderWidth: 1,
    },
    tahajjudButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSpacer: {
        height: 24,
    },
});

export default TodayScreen;
