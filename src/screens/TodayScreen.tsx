// Today Screen - Main Dashboard
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore } from '../store';
import { getDateString, formatNumber } from '../utils';
import { SalatName, SalatStatus, RootStackParamList } from '../types';
import { ResetModal } from '../components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Salat Card Component
const SalatCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logPrayer, getTodayLog, getPrayerStreak } = useSalatStore();
    const [showReset, setShowReset] = useState(false);

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

    const getStatusColor = (status: SalatStatus | undefined) => {
        if (status === 'onTime') return theme.colors.success.main;
        if (status === 'late') return theme.colors.warning.main;
        if (status === 'missed') return theme.colors.error.main;
        return theme.colors.border;
    };

    const getStatusIcon = (status: SalatStatus | undefined): string => {
        if (status === 'onTime') return 'check-circle';
        if (status === 'late') return 'clock-alert';
        if (status === 'missed') return 'close-circle';
        return 'circle-outline';
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
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <MaterialCommunityIcons name="mosque" size={22} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('salat.title')}
                    </Text>
                </View>
                <View style={styles.cardActions}>
                    {streak > 0 && (
                        <View style={[styles.streakBadge, { backgroundColor: theme.colors.primary }]}>
                            <MaterialCommunityIcons name="fire" size={14} color={theme.colors.onPrimary} />
                            <Text style={[styles.streakText, { color: theme.colors.onPrimary }]}>
                                {formatNumber(streak, i18n.language)}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity onPress={() => setShowReset(true)} style={styles.menuButton}>
                        <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
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
                            <MaterialCommunityIcons
                                name={getStatusIcon(status)}
                                size={18}
                                color={getStatusColor(status)}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={[styles.cardSubtext, { color: theme.colors.textSecondary }]}>
                {formatNumber(completedCount, i18n.language)}/5 {t('salat.prayersCompleted')}
            </Text>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="salat"
                habitName={t('salat.title')}
            />
        </View>
    );
};

// Adhkar Card Component
const AdhkarCard: React.FC = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { getAdhkarLog } = useHabitsStore();
    const [showReset, setShowReset] = useState(false);

    const today = getDateString(new Date());
    const morningLog = getAdhkarLog(today, 'morning');
    const eveningLog = getAdhkarLog(today, 'evening');

    const handleAdhkarPress = (category: 'morning' | 'evening') => {
        // Navigate to AdhkarScreen with category
        navigation.navigate('Adhkar', { category });
    };

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.adhkar }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <MaterialCommunityIcons name="hands-pray" size={22} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('adhkar.title')}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => setShowReset(true)} style={styles.menuButton}>
                    <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
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
                    <MaterialCommunityIcons name="weather-sunny" size={28} color={theme.colors.warning.main} />
                    <Text style={[styles.adhkarLabel, { color: theme.colors.text }]}>
                        {t('adhkar.morning')}
                    </Text>
                    {morningLog && (
                        <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.success.main} />
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
                    <MaterialCommunityIcons name="weather-night" size={28} color={theme.colors.primary} />
                    <Text style={[styles.adhkarLabel, { color: theme.colors.text }]}>
                        {t('adhkar.evening')}
                    </Text>
                    {eveningLog && (
                        <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.success.main} />
                    )}
                </TouchableOpacity>
            </View>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="adhkar-morning"
                habitName={t('adhkar.title')}
            />
        </View>
    );
};

// Qur'an Card Component
const QuranCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { logQuranReading, getTodayQuranLog, getWeeklyQuranPages } = useHabitsStore();
    const [showReset, setShowReset] = useState(false);

    const todayLog = getTodayQuranLog();
    const weeklyPages = getWeeklyQuranPages();

    const handleAddPages = (pages: number) => {
        logQuranReading(pages);
    };

    const handleOpenQuranScreen = () => {
        navigation.navigate('Quran');
    };

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.quran }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <MaterialCommunityIcons name="book-open-page-variant" size={22} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('quran.title')}
                    </Text>
                </View>
                <View style={styles.cardActions}>
                    <Text style={[styles.weeklyCount, { color: theme.colors.textSecondary }]}>
                        {formatNumber(weeklyPages, i18n.language)} {t('quran.pages')} this week
                    </Text>
                    <TouchableOpacity onPress={() => setShowReset(true)} style={styles.menuButton}>
                        <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
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

            {/* View Details Button */}
            <TouchableOpacity
                style={[styles.viewDetailsButton, { backgroundColor: theme.colors.surface }]}
                onPress={handleOpenQuranScreen}
            >
                <Text style={[styles.viewDetailsText, { color: theme.colors.primary }]}>
                    {i18n.language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="quran"
                habitName={t('quran.title')}
            />
        </View>
    );
};

// Charity Card Component
const CharityCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logCharity, getWeeklyCharityCount } = useHabitsStore();
    const [showReset, setShowReset] = useState(false);

    const weeklyCount = getWeeklyCharityCount();

    const charityTypes = [
        { type: 'money' as const, icon: 'cash-multiple', label: t('charity.money') },
        { type: 'food' as const, icon: 'food-apple', label: t('charity.food') },
        { type: 'time' as const, icon: 'clock-outline', label: t('charity.time') },
        { type: 'help' as const, icon: 'hand-heart', label: t('charity.help') },
    ];

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.charity }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.error.main + '20' }]}>
                        <MaterialCommunityIcons name="heart" size={22} color={theme.colors.error.main} />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('charity.sadaqah')}
                    </Text>
                </View>
                <View style={styles.cardActions}>
                    <Text style={[styles.weeklyCount, { color: theme.colors.textSecondary }]}>
                        {formatNumber(weeklyCount, i18n.language)} {t('charity.thisWeek')}
                    </Text>
                    <TouchableOpacity onPress={() => setShowReset(true)} style={styles.menuButton}>
                        <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.charityGrid}>
                {charityTypes.map((charity) => (
                    <TouchableOpacity
                        key={charity.type}
                        style={[styles.charityItem, { backgroundColor: theme.colors.surface }]}
                        onPress={() => logCharity(charity.type)}
                    >
                        <MaterialCommunityIcons name={charity.icon as any} size={24} color={theme.colors.primary} />
                        <Text style={[styles.charityLabel, { color: theme.colors.text }]}>
                            {charity.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="charity"
                habitName={t('charity.sadaqah')}
            />
        </View>
    );
};

// Tahajjud Card Component
const TahajjudCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { logTahajjud, getTodayTahajjud, getWeeklyTahajjudNights } = useHabitsStore();
    const [showReset, setShowReset] = useState(false);

    const todayLog = getTodayTahajjud();
    const weeklyNights = getWeeklyTahajjudNights();

    const handleOpenTahajjudScreen = () => {
        navigation.navigate('Tahajjud');
    };

    return (
        <View
            style={[styles.card, { backgroundColor: theme.colors.cards.tahajjud }]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <MaterialCommunityIcons name="moon-waning-crescent" size={22} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('tahajjud.title')}
                    </Text>
                </View>
                <View style={styles.cardActions}>
                    <Text style={[styles.weeklyCount, { color: theme.colors.textSecondary }]}>
                        {formatNumber(weeklyNights, i18n.language)} {t('tahajjud.nights')} {t('tahajjud.thisWeek')}
                    </Text>
                    <TouchableOpacity onPress={() => setShowReset(true)} style={styles.menuButton}>
                        <MaterialCommunityIcons name="dots-vertical" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
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
                    {todayLog?.completed ? t('tahajjud.completed') : t('tahajjud.nightPrayer')}
                </Text>
            </TouchableOpacity>

            {/* View Details Link */}
            <TouchableOpacity
                style={styles.viewDetailsLink}
                onPress={handleOpenTahajjudScreen}
            >
                <Text style={[styles.viewDetailsLinkText, { color: theme.colors.primary }]}>
                    {i18n.language === 'ar' ? 'عرض الأسبوع' : 'View Week'}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.primary} />
            </TouchableOpacity>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="tahajjud"
                habitName={t('tahajjud.title')}
            />
        </View>
    );
};

// Custom Habits Card Component
const CustomHabitsCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const isArabic = i18n.language === 'ar';

    const getTodayCustomHabits = useHabitsStore((state) => state.getTodayCustomHabits);
    const logCustomHabit = useHabitsStore((state) => state.logCustomHabit);
    const getCustomHabitLog = useHabitsStore((state) => state.getCustomHabitLog);

    const todayHabits = getTodayCustomHabits();
    const today = getDateString(new Date());

    const handleToggleHabit = (habitId: string, targetCount: number) => {
        const log = getCustomHabitLog(today, habitId);
        const currentCount = log?.count || 0;
        const newCount = currentCount >= targetCount ? 0 : targetCount;
        logCustomHabit(habitId, newCount);
    };

    const handleOpenCustomHabits = () => {
        navigation.navigate('Main', { screen: 'Track' } as any);
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <View style={[styles.iconContainer, { backgroundColor: '#8B5CF6' + '20' }]}>
                        <MaterialCommunityIcons name="checkbox-multiple-marked" size={22} color="#8B5CF6" />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {isArabic ? 'العادات المخصصة' : 'Custom Habits'}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleOpenCustomHabits}>
                    <MaterialCommunityIcons name="plus" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Empty State */}
            {todayHabits.length === 0 ? (
                <TouchableOpacity
                    style={[styles.emptyHabitState, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                    onPress={handleOpenCustomHabits}
                >
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color={theme.colors.textSecondary} />
                    <Text style={[styles.emptyHabitText, { color: theme.colors.textSecondary }]}>
                        {isArabic ? 'أضف عادتك الأولى' : 'Add your first habit'}
                    </Text>
                </TouchableOpacity>
            ) : (
                /* Habit Items */
                todayHabits.map((habit) => {
                    const log = getCustomHabitLog(today, habit.id);
                    const isComplete = (log?.count || 0) >= habit.targetCount;
                    const habitName = isArabic ? (habit.nameAr || habit.name) : habit.name;

                    return (
                        <TouchableOpacity
                            key={habit.id}
                            style={[
                                styles.customHabitItem,
                                {
                                    backgroundColor: isComplete ? habit.color + '15' : theme.colors.background,
                                    borderColor: isComplete ? habit.color : theme.colors.border,
                                },
                            ]}
                            onPress={() => handleToggleHabit(habit.id, habit.targetCount)}
                        >
                            <View style={[styles.customHabitIcon, { backgroundColor: habit.color + '20' }]}>
                                <MaterialCommunityIcons
                                    name={habit.icon as any}
                                    size={20}
                                    color={habit.color}
                                />
                            </View>
                            <Text
                                style={[styles.customHabitName, { color: theme.colors.text }]}
                                numberOfLines={1}
                            >
                                {habitName}
                            </Text>
                            {isComplete && (
                                <MaterialCommunityIcons
                                    name="check-circle"
                                    size={20}
                                    color={habit.color}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })
            )}
        </View>
    );
};

// Main Today Screen
const TodayScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();

    const today = new Date();
    const formattedDate = today.toLocaleDateString(
        i18n.language === 'ar' ? 'ar-SA' : 'en-US',
        { weekday: 'long', month: 'long', day: 'numeric' }
    );

    const handleOpenProfile = () => {
        navigation.navigate('Profile');
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        {t('common.today')}
                    </Text>
                    <Text style={[styles.headerDate, { color: theme.colors.textSecondary }]}>
                        {formattedDate}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.profileButton, { backgroundColor: theme.colors.surface }]}
                    onPress={handleOpenProfile}
                >
                    <MaterialCommunityIcons name="account-circle" size={32} color={theme.colors.primary} />
                </TouchableOpacity>
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
                <CustomHabitsCard />

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    headerDate: {
        fontSize: 14,
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
        gap: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
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
    // View Details
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 12,
    },
    viewDetailsText: {
        fontSize: 14,
        fontWeight: '600',
    },
    viewDetailsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        marginTop: 12,
    },
    viewDetailsLinkText: {
        fontSize: 13,
        fontWeight: '500',
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Custom Habits
    customHabitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 10,
        gap: 12,
    },
    customHabitIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customHabitName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    emptyHabitState: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginTop: 10,
        gap: 10,
    },
    emptyHabitText: {
        fontSize: 14,
        fontWeight: '500',
    },
    // Reset menu styles
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuButton: {
        padding: 4,
    },
});

export default TodayScreen;
