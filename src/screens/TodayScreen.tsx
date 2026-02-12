// Today Screen - Main Dashboard - Premium Redesign
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore, useUserPreferencesStore } from '../store';
import { getDateString, formatNumber, getFontFamily } from '../utils';
import { getHijriDate } from '../utils/dateUtils';
import { SalatName, SalatStatus, RootStackParamList } from '../types';
import { ResetModal, AppCard, PrayerPill, QuickActionButton } from '../components';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ========================================
// Card Header Component - Reusable
// ========================================
interface CardHeaderProps {
    title: string;
    icon: string;
    iconColor: string;
    badge?: React.ReactNode;
    onMenuPress?: () => void;
    subtitle?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    icon,
    iconColor,
    badge,
    onMenuPress,
    subtitle,
}) => {
    const { theme } = useTheme();
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    return (
        <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
                <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    <MaterialCommunityIcons name={icon as any} size={22} color={iconColor} />
                </View>
                <View>
                    <Text style={[
                        styles.cardTitle,
                        { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }
                    ]}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text style={[
                            styles.cardSubtitle,
                            { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }
                        ]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            <View style={styles.cardActions}>
                {badge}
                {onMenuPress && (
                    <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                        <MaterialCommunityIcons
                            name="dots-vertical"
                            size={20}
                            color={theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};


// ========================================
// Progress Bar Component
// ========================================
interface ProgressBarProps {
    progress: number; // 0-1
    height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 6 }) => {
    const { theme } = useTheme();
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    return (
        <View style={[styles.progressBarContainer, { height, backgroundColor: theme.colors.progressBarBackground }]}>
            <View
                style={[
                    styles.progressBarFill,
                    {
                        width: `${clampedProgress * 100}%`,
                        backgroundColor: theme.colors.progressBarFill,
                    },
                ]}
            />
        </View>
    );
};

// ========================================
// Salat Card Component - Premium Redesign
// ========================================
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

    const streakBadge = streak > 0 ? (
        <View style={[styles.streakBadge, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="fire" size={14} color={theme.colors.onPrimary} />
            <Text style={[styles.streakText, { color: theme.colors.onPrimary }]}>
                {formatNumber(streak, i18n.language)}
            </Text>
        </View>
    ) : null;

    return (
        <AppCard backgroundColor={theme.colors.cards.salat}>
            <CardHeader
                title={t('salat.title')}
                icon="mosque"
                iconColor={theme.colors.accents.salat}
                badge={streakBadge}
                onMenuPress={() => setShowReset(true)}
            />

            {/* Progress indicator */}
            <View style={styles.progressSection}>
                <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                    {formatNumber(completedCount, i18n.language)}/5 {t('salat.prayersCompleted')}
                </Text>
                <ProgressBar progress={completedCount / 5} />
            </View>

            {/* Prayer Pills - 2 rows */}
            <View style={styles.prayerGrid}>
                <View style={styles.prayerRow}>
                    {prayers.slice(0, 2).map((prayer) => (
                        <PrayerPill
                            key={prayer.key}
                            label={prayer.label}
                            status={todayLog?.[prayer.key]}
                            onPress={() => cyclePrayerStatus(prayer.key)}
                        />
                    ))}
                </View>
                <View style={styles.prayerRow}>
                    {prayers.slice(2).map((prayer) => (
                        <PrayerPill
                            key={prayer.key}
                            label={prayer.label}
                            status={todayLog?.[prayer.key]}
                            onPress={() => cyclePrayerStatus(prayer.key)}
                        />
                    ))}
                </View>
            </View>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="salat"
                habitName={t('salat.title')}
            />
        </AppCard>
    );
};

// ========================================
// Adhkar Card Component - Premium Redesign
// ========================================
const AdhkarCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { getAdhkarLog } = useHabitsStore();
    const [showReset, setShowReset] = useState(false);

    const today = getDateString(new Date());
    const morningLog = getAdhkarLog(today, 'morning');
    const eveningLog = getAdhkarLog(today, 'evening');
    const isArabic = i18n.language === 'ar';

    const handleAdhkarPress = (category: 'morning' | 'evening') => {
        navigation.navigate('Adhkar', { category });
    };

    return (
        <AppCard backgroundColor={theme.colors.cards.adhkar}>
            <CardHeader
                title={t('adhkar.title')}
                icon="hands-pray"
                iconColor={theme.colors.accents.adhkar}
                onMenuPress={() => setShowReset(true)}
            />

            <View style={styles.adhkarButtons}>
                <QuickActionButton
                    label={t('adhkar.morning')}
                    icon="weather-sunny"
                    iconColor={theme.colors.warning.main}
                    completed={!!morningLog}
                    subtitle={isArabic ? 'ابدأ الآن' : 'Start now'}
                    onPress={() => handleAdhkarPress('morning')}
                />
                <QuickActionButton
                    label={t('adhkar.evening')}
                    icon="weather-night"
                    iconColor={theme.colors.primary}
                    completed={!!eveningLog}
                    subtitle={isArabic ? 'ابدأ الآن' : 'Start now'}
                    onPress={() => handleAdhkarPress('evening')}
                />
            </View>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="adhkar-morning"
                habitName={t('adhkar.title')}
            />
        </AppCard>
    );
};

// ========================================
// Du'a Card Component - Quick Access
// ========================================
const DuaCard: React.FC = () => {
    const { i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const isArabic = i18n.language === 'ar';

    const handleOpenDuas = () => {
        navigation.navigate('Dua');
    };

    return (
        <AppCard backgroundColor={theme.colors.cards.adhkar} onPress={handleOpenDuas}>
            <View style={styles.duaCardContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.info.main + '20' }]}>
                    <MaterialCommunityIcons
                        name="book-open-page-variant"
                        size={24}
                        color={theme.colors.info.main}
                    />
                </View>
                <View style={styles.duaCardText}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {isArabic ? 'الأدعية' : "Du'a Collection"}
                    </Text>
                    <Text style={[styles.duaCardSubtitle, { color: theme.colors.textSecondary }]}>
                        {isArabic ? 'أدعية لكل مناسبة' : 'Supplications for all occasions'}
                    </Text>
                </View>
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={theme.colors.textTertiary}
                />
            </View>
        </AppCard>
    );
};

// ========================================
// Qur'an Card Component - Premium Tracker Block
// ========================================
const QuranCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { logQuranReading, getTodayQuranLog, getWeeklyQuranPages } = useHabitsStore();
    const { goals } = useUserPreferencesStore();
    const [showReset, setShowReset] = useState(false);

    const todayLog = getTodayQuranLog();
    const weeklyPages = getWeeklyQuranPages();
    const weeklyGoal = goals.quranPagesPerDay * 7; // Calculate weekly goal from daily goal
    const isArabic = i18n.language === 'ar';

    const handleAddPages = (pages: number) => {
        logQuranReading(pages);
    };

    const handleOpenQuranScreen = () => {
        navigation.navigate('Quran');
    };

    const weeklyText = isArabic
        ? `هذا الأسبوع: ${formatNumber(weeklyPages, i18n.language)} صفحات`
        : `This week: ${formatNumber(weeklyPages, i18n.language)} pages`;

    return (
        <AppCard backgroundColor={theme.colors.cards.quran}>
            <CardHeader
                title={t('quran.title')}
                icon="book-open-page-variant"
                iconColor={theme.colors.accents.quran}
                subtitle={weeklyText}
                onMenuPress={() => setShowReset(true)}
            />

            {/* Weekly Progress */}
            <View style={styles.quranProgress}>
                <ProgressBar progress={weeklyPages / weeklyGoal} height={8} />
                <Text style={[styles.goalText, { color: theme.colors.textSecondary }]}>
                    {isArabic
                        ? `الهدف: ${formatNumber(weeklyGoal, i18n.language)} صفحة/أسبوع`
                        : `Goal: ${formatNumber(weeklyGoal, i18n.language)} pages/week`}
                </Text>
            </View>

            {/* Today's Count & Quick Actions */}
            <View style={styles.quranContent}>
                <View style={styles.quranToday}>
                    <Text style={[styles.quranTodayLabel, { color: theme.colors.textSecondary }]}>
                        {t('common.today')}
                    </Text>
                    <Text style={[styles.quranTodayValue, { color: theme.colors.text }]}>
                        {formatNumber(todayLog?.pages || 0, i18n.language)}
                    </Text>
                    <Text style={[styles.quranTodayUnit, { color: theme.colors.textSecondary }]}>
                        {t('quran.pages')}
                    </Text>
                </View>

                <View style={styles.quranButtons}>
                    {[1, 2, 5].map((pages) => (
                        <TouchableOpacity
                            key={pages}
                            style={[styles.quranButton, {
                                backgroundColor: theme.colors.surface,
                                borderColor: theme.colors.cardBorder,
                            }]}
                            onPress={() => handleAddPages(pages)}
                        >
                            <Text style={[styles.quranButtonText, { color: theme.colors.primary }]}>
                                +{formatNumber(pages, i18n.language)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Footer Links */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleOpenQuranScreen}>
                    <Text style={[styles.viewDetailsLinkText, { color: theme.colors.primary }]}>
                        {isArabic ? 'عرض التفاصيل' : 'View Details'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    onPress={() => navigation.navigate('Khatam')}
                >
                    <MaterialCommunityIcons name="book-check-outline" size={16} color={theme.colors.primary} />
                    <Text style={[styles.viewDetailsLinkText, { color: theme.colors.primary }]}>
                        {isArabic ? 'متابعة الختمة' : 'Track Khatam'}
                    </Text>
                    <MaterialCommunityIcons
                        name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                        size={18}
                        color={theme.colors.primary}
                    />
                </TouchableOpacity>
            </View>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="quran"
                habitName={t('quran.title')}
            />
        </AppCard>
    );
};

// ========================================
// Charity Card Component
// ========================================
const CharityCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logCharity, getWeeklyCharityCount } = useHabitsStore();
    const { goals } = useUserPreferencesStore();
    const [showReset, setShowReset] = useState(false);

    const weeklyCount = getWeeklyCharityCount();
    const weeklyGoal = goals.charityPerWeek;
    const isArabic = i18n.language === 'ar';

    const charityTypes = [
        { type: 'money' as const, icon: 'cash-multiple', label: t('charity.money') },
        { type: 'food' as const, icon: 'food-apple', label: t('charity.food') },
        { type: 'time' as const, icon: 'clock-outline', label: t('charity.time') },
        { type: 'help' as const, icon: 'hand-heart', label: t('charity.help') },
    ];

    const weeklyText = isArabic
        ? `${formatNumber(weeklyCount, i18n.language)}/${formatNumber(weeklyGoal, i18n.language)} ${t('charity.thisWeek')}`
        : `${formatNumber(weeklyCount, i18n.language)}/${formatNumber(weeklyGoal, i18n.language)} ${t('charity.thisWeek')}`;

    return (
        <AppCard backgroundColor={theme.colors.cards.charity}>
            <CardHeader
                title={t('charity.sadaqah')}
                icon="heart"
                iconColor={theme.colors.accents.charity}
                subtitle={weeklyText}
                onMenuPress={() => setShowReset(true)}
            />

            <View style={styles.charityGrid}>
                {charityTypes.map((charity) => (
                    <TouchableOpacity
                        key={charity.type}
                        style={[styles.charityItem, {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.cardBorder,
                        }]}
                        onPress={() => logCharity(charity.type)}
                    >
                        <MaterialCommunityIcons
                            name={charity.icon as any}
                            size={28}
                            color={theme.colors.accents.charity}
                        />
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
        </AppCard>
    );
};

// ========================================
// Tahajjud Card Component
// ========================================
const TahajjudCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { logTahajjud, getTodayTahajjud, getWeeklyTahajjudNights } = useHabitsStore();
    const { goals } = useUserPreferencesStore();
    const [showReset, setShowReset] = useState(false);

    const todayLog = getTodayTahajjud();
    const weeklyNights = getWeeklyTahajjudNights();
    const weeklyGoal = goals.tahajjudNightsPerWeek;
    const isArabic = i18n.language === 'ar';

    const handleOpenTahajjudScreen = () => {
        navigation.navigate('Tahajjud');
    };

    const weeklyText = isArabic
        ? `${formatNumber(weeklyNights, i18n.language)}/${formatNumber(weeklyGoal, i18n.language)} ${t('tahajjud.nights')} ${t('tahajjud.thisWeek')}`
        : `${formatNumber(weeklyNights, i18n.language)}/${formatNumber(weeklyGoal, i18n.language)} ${t('tahajjud.nights')} ${t('tahajjud.thisWeek')}`;

    return (
        <AppCard backgroundColor={theme.colors.cards.tahajjud}>
            <CardHeader
                title={t('tahajjud.title')}
                icon="moon-waning-crescent"
                iconColor={theme.colors.accents.tahajjud}
                subtitle={weeklyText}
                onMenuPress={() => setShowReset(true)}
            />

            <TouchableOpacity
                style={[
                    styles.tahajjudButton,
                    {
                        backgroundColor: todayLog?.completed
                            ? theme.colors.success.main
                            : theme.colors.surface,
                        borderColor: todayLog?.completed
                            ? theme.colors.success.main
                            : theme.colors.cardBorder,
                    },
                ]}
                onPress={() => logTahajjud(!todayLog?.completed)}
            >
                {todayLog?.completed && (
                    <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color="#FFFFFF"
                        style={{ marginRight: 8 }}
                    />
                )}
                <Text
                    style={[
                        styles.tahajjudButtonText,
                        {
                            color: todayLog?.completed ? '#FFFFFF' : theme.colors.text,
                        },
                    ]}
                >
                    {todayLog?.completed ? t('tahajjud.completed') : t('tahajjud.nightPrayer')}
                </Text>
            </TouchableOpacity>

            {/* View Week Link */}
            <TouchableOpacity style={styles.viewDetailsLink} onPress={handleOpenTahajjudScreen}>
                <Text style={[styles.viewDetailsLinkText, { color: theme.colors.primary }]}>
                    {isArabic ? 'عرض الأسبوع' : 'View Week'}
                </Text>
                <MaterialCommunityIcons
                    name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                    size={18}
                    color={theme.colors.primary}
                />
            </TouchableOpacity>

            <ResetModal
                visible={showReset}
                onClose={() => setShowReset(false)}
                habitType="tahajjud"
                habitName={t('tahajjud.title')}
            />
        </AppCard>
    );
};

// ========================================
// Custom Habits Card Component
// ========================================
const CustomHabitsCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
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
        <AppCard backgroundColor={theme.colors.cards.custom}>
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.accents.custom + '20' }]}>
                        <MaterialCommunityIcons
                            name="checkbox-multiple-marked"
                            size={22}
                            color={theme.colors.accents.custom}
                        />
                    </View>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {isArabic ? 'العادات المخصصة' : 'Custom Habits'}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleOpenCustomHabits} style={styles.addButton}>
                    <MaterialCommunityIcons name="plus" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Empty State */}
            {todayHabits.length === 0 ? (
                <TouchableOpacity
                    style={[styles.emptyHabitState, {
                        backgroundColor: isDark ? theme.colors.surface : theme.colors.background,
                        borderColor: theme.colors.cardBorder,
                    }]}
                    onPress={handleOpenCustomHabits}
                >
                    <MaterialCommunityIcons
                        name="plus-circle-outline"
                        size={24}
                        color={theme.colors.textSecondary}
                    />
                    <Text style={[styles.emptyHabitText, { color: theme.colors.textSecondary }]}>
                        {isArabic ? 'أضف عادتك الأولى' : 'Add your first habit'}
                    </Text>
                </TouchableOpacity>
            ) : (
                /* Habit Items */
                <View style={styles.habitsContainer}>
                    {todayHabits.map((habit) => {
                        const log = getCustomHabitLog(today, habit.id);
                        const isComplete = (log?.count || 0) >= habit.targetCount;
                        const habitName = isArabic ? (habit.nameAr || habit.name) : habit.name;

                        return (
                            <TouchableOpacity
                                key={habit.id}
                                style={[
                                    styles.customHabitItem,
                                    {
                                        backgroundColor: isComplete ? habit.color + '15' : theme.colors.surface,
                                        borderColor: isComplete ? habit.color : theme.colors.cardBorder,
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
                    })}
                </View>
            )}
        </AppCard>
    );
};

// ========================================
// ========================================
// Qibla Card Component
// ========================================
const QiblaCard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const isArabic = i18n.language === 'ar';

    const handleOpenQibla = () => {
        navigation.navigate('Qibla');
    };

    return (
        <AppCard backgroundColor={theme.colors.cards.salat} onPress={handleOpenQibla}>
            <View style={styles.duaCardContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                    <MaterialCommunityIcons
                        name="compass"
                        size={24}
                        color={theme.colors.primary}
                    />
                </View>
                <View style={styles.duaCardText}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {t('qiblaCompass')}
                    </Text>
                    <Text style={[styles.duaCardSubtitle, { color: theme.colors.textSecondary }]}>
                        {t('qiblaDirection')}
                    </Text>
                </View>
                <MaterialCommunityIcons
                    name={isArabic ? 'chevron-left' : 'chevron-right'}
                    size={24}
                    color={theme.colors.textTertiary}
                />
            </View>
        </AppCard>
    );
};

// ========================================
// Main Today Screen
// ========================================
const TodayScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const isArabic = i18n.language === 'ar';

    const today = new Date();
    const formattedDate = today.toLocaleDateString(
        isArabic ? 'ar-SA' : 'en-US',
        { weekday: 'long', month: 'long', day: 'numeric' }
    );
    const hijriDate = getHijriDate(today, isArabic ? 'ar' : 'en');


    const handleOpenProfile = () => {
        navigation.navigate('Profile');
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[
                        styles.headerTitle,
                        { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }
                    ]}>
                        {t('common.today')}
                    </Text>
                    <Text style={[
                        styles.headerDate,
                        { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }
                    ]}>
                        {formattedDate} • {hijriDate}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.profileButton, {
                        backgroundColor: theme.colors.surface,
                        borderColor: isDark ? 'transparent' : theme.colors.cardBorder,
                        borderWidth: isDark ? 0 : 1,
                    }]}
                    onPress={handleOpenProfile}
                >
                    <MaterialCommunityIcons name="account-circle" size={28} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <SalatCard />
                <QiblaCard />
                <AdhkarCard />
                <DuaCard />
                <QuranCard />
                <CharityCard />
                <TahajjudCard />
                <CustomHabitsCard />


                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

// ========================================
// Styles
// ========================================
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
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
    },
    headerDate: {
        fontSize: 14,
        marginTop: 4,
        fontWeight: '400',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    // Card Header
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
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
        fontWeight: '700',
    },
    cardSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuButton: {
        padding: 4,
    },
    addButton: {
        padding: 4,
    },
    // Progress Bar
    progressBarContainer: {
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressSection: {
        marginBottom: 16,
        gap: 8,
    },
    progressLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    // Streak Badge
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 4,
    },
    streakText: {
        fontSize: 13,
        fontWeight: '600',
    },
    // Prayer Grid
    prayerGrid: {
        gap: 10,
    },
    prayerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        flexWrap: 'wrap',
    },
    // Adhkar
    adhkarButtons: {
        gap: 12,
        width: '100%',
    },
    // Qur'an
    quranProgress: {
        marginBottom: 16,
        gap: 6,
    },
    goalText: {
        fontSize: 12,
        textAlign: 'center',
    },
    quranContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quranToday: {
        alignItems: 'flex-start',
    },
    quranTodayLabel: {
        fontSize: 12,
    },
    quranTodayValue: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: 2,
    },
    quranTodayUnit: {
        fontSize: 12,
        marginTop: 2,
    },
    quranButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    quranButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    quranButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // Charity
    charityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    charityItem: {
        width: '48%',
        flexGrow: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        gap: 8,
    },
    charityLabel: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    // Tahajjud
    tahajjudButton: {
        flexDirection: 'row',
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    tahajjudButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // View Details Link
    viewDetailsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 14,
        paddingVertical: 4,
    },
    viewDetailsLinkText: {
        fontSize: 14,
        fontWeight: '500',
    },
    // Profile Button
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Custom Habits
    habitsContainer: {
        gap: 10,
    },
    customHabitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
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
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        gap: 10,
    },
    emptyHabitText: {
        fontSize: 14,
        fontWeight: '500',
    },
    // Du'a Card
    duaCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    duaCardText: {
        flex: 1,
    },
    duaCardSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    bottomSpacer: {
        height: 90,
    },
});

export default TodayScreen;
