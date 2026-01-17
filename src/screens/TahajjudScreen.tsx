// Tahajjud Screen - Weekly night prayer tracking
import React from 'react';
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
import { useTheme } from '../context';
import { useHabitsStore, useUserPreferencesStore } from '../store';
import { getWeekDates, getDayAbbr, parseDate, formatNumber, isToday, getDateString } from '../utils';

const TahajjudScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { tahajjudLogs, logTahajjud, getWeeklyTahajjudNights } = useHabitsStore();
    const { goals } = useUserPreferencesStore();

    const weekDates = getWeekDates();
    const weeklyNights = getWeeklyTahajjudNights();
    const weeklyGoal = goals?.tahajjudNightsPerWeek || 2;
    const today = getDateString(new Date());
    const isArabic = i18n.language === 'ar';

    const handleToggleNight = (date: string) => {
        // Only allow toggling today or past dates
        const dateObj = parseDate(date);
        const now = new Date();
        if (dateObj <= now) {
            const currentStatus = tahajjudLogs[date]?.completed || false;
            // We need to modify the store to accept a date parameter
            // For now, we'll only allow toggling today
            if (date === today) {
                logTahajjud(!currentStatus);
            }
        }
    };

    const getProgress = () => {
        return Math.min((weeklyNights / weeklyGoal) * 100, 100);
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('tahajjud.title')}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Weekly Goal Card */}
                <View style={[styles.goalCard, { backgroundColor: theme.colors.cards.tahajjud }]}>
                    <View style={styles.goalHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                            <MaterialCommunityIcons
                                name="moon-waning-crescent"
                                size={28}
                                color={theme.colors.primary}
                            />
                        </View>
                        <View style={styles.goalInfo}>
                            <Text style={[styles.goalLabel, { color: theme.colors.textSecondary }]}>
                                {isArabic ? 'الهدف الأسبوعي' : 'Weekly Goal'}
                            </Text>
                            <Text style={[styles.goalValue, { color: theme.colors.text }]}>
                                {formatNumber(weeklyNights, i18n.language)}/{formatNumber(weeklyGoal, i18n.language)} {t('tahajjud.nights')}
                            </Text>
                        </View>
                    </View>

                    {/* Progress bar */}
                    <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${getProgress()}%`,
                                    backgroundColor: weeklyNights >= weeklyGoal
                                        ? theme.colors.success.main
                                        : theme.colors.primary,
                                },
                            ]}
                        />
                    </View>

                    {weeklyNights >= weeklyGoal && (
                        <View style={styles.completedBadge}>
                            <MaterialCommunityIcons name="check-circle" size={18} color={theme.colors.success.main} />
                            <Text style={[styles.completedText, { color: theme.colors.success.main }]}>
                                {isArabic ? 'تم تحقيق الهدف!' : 'Goal achieved!'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Week Calendar */}
                <View style={[styles.weekCard, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        {isArabic ? 'هذا الأسبوع' : 'This Week'}
                    </Text>

                    <View style={styles.weekGrid}>
                        {weekDates.map((dateStr) => {
                            const date = parseDate(dateStr);
                            const isTodayDate = isToday(dateStr);
                            const log = tahajjudLogs[dateStr];
                            const isCompleted = log?.completed || false;
                            const isPast = date < new Date() && !isTodayDate;
                            const isFuture = date > new Date();

                            return (
                                <TouchableOpacity
                                    key={dateStr}
                                    style={[
                                        styles.dayCell,
                                        {
                                            backgroundColor: isCompleted
                                                ? theme.colors.success.light
                                                : isTodayDate
                                                    ? theme.colors.primaryLight
                                                    : theme.colors.background,
                                            borderColor: isTodayDate
                                                ? theme.colors.primary
                                                : isCompleted
                                                    ? theme.colors.success.main
                                                    : theme.colors.border,
                                            opacity: isFuture ? 0.5 : 1,
                                        },
                                    ]}
                                    onPress={() => handleToggleNight(dateStr)}
                                    disabled={isFuture}
                                >
                                    <Text
                                        style={[
                                            styles.dayName,
                                            {
                                                color: isTodayDate
                                                    ? theme.colors.primary
                                                    : theme.colors.textSecondary,
                                            },
                                        ]}
                                    >
                                        {getDayAbbr(date, i18n.language)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.dayNumber,
                                            {
                                                color: isCompleted
                                                    ? theme.colors.success.dark
                                                    : theme.colors.text,
                                            },
                                        ]}
                                    >
                                        {date.getDate()}
                                    </Text>
                                    {isCompleted ? (
                                        <MaterialCommunityIcons
                                            name="check-circle"
                                            size={24}
                                            color={theme.colors.success.main}
                                        />
                                    ) : isPast ? (
                                        <MaterialCommunityIcons
                                            name="close-circle-outline"
                                            size={24}
                                            color={theme.colors.textTertiary}
                                        />
                                    ) : isTodayDate ? (
                                        <MaterialCommunityIcons
                                            name="plus-circle-outline"
                                            size={24}
                                            color={theme.colors.primary}
                                        />
                                    ) : (
                                        <MaterialCommunityIcons
                                            name="circle-outline"
                                            size={24}
                                            color={theme.colors.textTertiary}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Tips */}
                <View style={[styles.tipsCard, { backgroundColor: theme.colors.surface }]}>
                    <MaterialCommunityIcons
                        name="lightbulb-outline"
                        size={20}
                        color={theme.colors.warning.main}
                    />
                    <Text style={[styles.tipsText, { color: theme.colors.textSecondary }]}>
                        {isArabic
                            ? 'صلاة التهجد من أفضل العبادات. حاول أن تصلي ولو ركعتين.'
                            : 'Tahajjud is one of the best forms of worship. Even two rak\'ahs count.'}
                    </Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    // Goal card
    goalCard: {
        borderRadius: 20,
        padding: 20,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalInfo: {
        flex: 1,
    },
    goalLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    goalValue: {
        fontSize: 22,
        fontWeight: '700',
    },
    progressTrack: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
    },
    completedText: {
        fontSize: 14,
        fontWeight: '600',
    },
    // Week card
    weekCard: {
        borderRadius: 20,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    weekGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    dayName: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    // Tips
    tipsCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        borderRadius: 16,
        padding: 16,
    },
    tipsText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    bottomSpacer: {
        height: 24,
    },
});

export default TahajjudScreen;
