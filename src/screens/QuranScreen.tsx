// Quran Reading Screen - Structured progress tracking
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context';
import { useHabitsStore, useUserPreferencesStore } from '../store';
import { formatNumber, getDateString } from '../utils';

// Quran constants
const TOTAL_PAGES = 604;
const TOTAL_HIZB = 60;
const PAGES_PER_HIZB = TOTAL_PAGES / TOTAL_HIZB; // ~10.07

const QuranScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { logQuranReading, getTodayQuranLog, getWeeklyQuranPages } = useHabitsStore();
    const { goals } = useUserPreferencesStore();

    const [pagesInput, setPagesInput] = useState('');
    const [minutesInput, setMinutesInput] = useState('');
    const [trackingMode, setTrackingMode] = useState<'pages' | 'hizb'>('pages');

    const isArabic = i18n.language === 'ar';
    const todayLog = getTodayQuranLog();
    const weeklyPages = getWeeklyQuranPages();
    const weeklyGoal = (goals?.quranPagesPerDay || 2) * 7; // Default 2 pages/day = 14/week

    const handleLogReading = () => {
        const value = parseInt(pagesInput) || 0;
        if (value <= 0) {
            Alert.alert(
                isArabic ? 'خطأ' : 'Error',
                isArabic ? 'أدخل عدد صفحات صحيح' : 'Please enter a valid number'
            );
            return;
        }

        // Convert hizb to pages if needed
        const pages = trackingMode === 'hizb' ? Math.round(value * PAGES_PER_HIZB) : value;
        const minutes = parseInt(minutesInput) || undefined;

        logQuranReading(pages, minutes);
        setPagesInput('');
        setMinutesInput('');

        Alert.alert(
            isArabic ? 'تم الحفظ' : 'Saved',
            isArabic
                ? `تم تسجيل ${pages} صفحة`
                : `Logged ${pages} pages`,
            [{ text: isArabic ? 'حسناً' : 'OK' }]
        );
    };

    const getWeeklyProgress = () => {
        return Math.min((weeklyPages / weeklyGoal) * 100, 100);
    };

    const getCompletionEstimate = () => {
        if (weeklyPages === 0) return null;
        const pagesPerDay = weeklyPages / 7;
        if (pagesPerDay === 0) return null;
        const daysToFinish = Math.ceil(TOTAL_PAGES / pagesPerDay);
        const monthsToFinish = Math.round(daysToFinish / 30);
        return monthsToFinish;
    };

    const completionMonths = getCompletionEstimate();

    // Quick log buttons
    const quickPages = [1, 2, 5, 10];

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
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
                    {t('quran.title')}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Weekly Progress Card */}
                <View style={[styles.progressCard, { backgroundColor: theme.colors.cards.quran }]}>
                    <View style={styles.progressHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.success.main + '20' }]}>
                            <MaterialCommunityIcons
                                name="book-open-page-variant"
                                size={28}
                                color={theme.colors.success.main}
                            />
                        </View>
                        <View style={styles.progressInfo}>
                            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                                {isArabic ? 'الهدف الأسبوعي' : 'Weekly Goal'}
                            </Text>
                            <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                                {formatNumber(weeklyPages, i18n.language)}/{formatNumber(weeklyGoal, i18n.language)} {t('quran.pages')}
                            </Text>
                        </View>
                    </View>

                    {/* Progress bar */}
                    <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${getWeeklyProgress()}%`,
                                    backgroundColor: weeklyPages >= weeklyGoal
                                        ? theme.colors.success.main
                                        : theme.colors.success.dark,
                                },
                            ]}
                        />
                    </View>

                    {/* Completion estimate */}
                    {completionMonths && (
                        <View style={styles.estimateRow}>
                            <MaterialCommunityIcons
                                name="timer-sand"
                                size={16}
                                color={theme.colors.textSecondary}
                            />
                            <Text style={[styles.estimateText, { color: theme.colors.textSecondary }]}>
                                {isArabic
                                    ? `بهذا المعدل، ستختم القرآن في ${completionMonths} شهر`
                                    : `At this pace, you'll complete the Quran in ${completionMonths} months`}
                            </Text>
                        </View>
                    )}

                    {weeklyPages >= weeklyGoal && (
                        <View style={styles.completedBadge}>
                            <MaterialCommunityIcons name="check-circle" size={18} color={theme.colors.success.main} />
                            <Text style={[styles.completedText, { color: theme.colors.success.main }]}>
                                {isArabic ? 'تم تحقيق الهدف!' : 'Goal achieved!'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Today's Reading */}
                {todayLog && (
                    <View style={[styles.todayCard, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'قراءة اليوم' : "Today's Reading"}
                        </Text>
                        <View style={styles.todayStats}>
                            <View style={styles.todayStat}>
                                <Text style={[styles.todayValue, { color: theme.colors.primary }]}>
                                    {formatNumber(todayLog.pages, i18n.language)}
                                </Text>
                                <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                                    {t('quran.pages')}
                                </Text>
                            </View>
                            {todayLog.minutes && (
                                <View style={styles.todayStat}>
                                    <Text style={[styles.todayValue, { color: theme.colors.primary }]}>
                                        {formatNumber(todayLog.minutes, i18n.language)}
                                    </Text>
                                    <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                                        {isArabic ? 'دقيقة' : 'min'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Log Reading Card */}
                <View style={[styles.logCard, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        {isArabic ? 'تسجيل القراءة' : 'Log Reading'}
                    </Text>

                    {/* Tracking mode toggle */}
                    <View style={styles.modeToggle}>
                        <TouchableOpacity
                            style={[
                                styles.modeButton,
                                {
                                    backgroundColor: trackingMode === 'pages'
                                        ? theme.colors.primary
                                        : theme.colors.background,
                                },
                            ]}
                            onPress={() => setTrackingMode('pages')}
                        >
                            <Text
                                style={[
                                    styles.modeText,
                                    { color: trackingMode === 'pages' ? theme.colors.onPrimary : theme.colors.text },
                                ]}
                            >
                                {t('quran.pages')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.modeButton,
                                {
                                    backgroundColor: trackingMode === 'hizb'
                                        ? theme.colors.primary
                                        : theme.colors.background,
                                },
                            ]}
                            onPress={() => setTrackingMode('hizb')}
                        >
                            <Text
                                style={[
                                    styles.modeText,
                                    { color: trackingMode === 'hizb' ? theme.colors.onPrimary : theme.colors.text },
                                ]}
                            >
                                {isArabic ? 'حزب' : 'Hizb'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick buttons */}
                    <View style={styles.quickButtons}>
                        {quickPages.map((num) => (
                            <TouchableOpacity
                                key={num}
                                style={[styles.quickButton, { backgroundColor: theme.colors.primaryLight }]}
                                onPress={() => setPagesInput(String(num))}
                            >
                                <Text style={[styles.quickButtonText, { color: theme.colors.primary }]}>
                                    +{num}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Input fields */}
                    <View style={styles.inputRow}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                                {trackingMode === 'pages' ? t('quran.pages') : (isArabic ? 'حزب' : 'Hizb')}
                            </Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border,
                                    },
                                ]}
                                value={pagesInput}
                                onChangeText={setPagesInput}
                                keyboardType="number-pad"
                                placeholder="0"
                                placeholderTextColor={theme.colors.textTertiary}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                                {isArabic ? 'دقائق (اختياري)' : 'Minutes (optional)'}
                            </Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    {
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.text,
                                        borderColor: theme.colors.border,
                                    },
                                ]}
                                value={minutesInput}
                                onChangeText={setMinutesInput}
                                keyboardType="number-pad"
                                placeholder="0"
                                placeholderTextColor={theme.colors.textTertiary}
                            />
                        </View>
                    </View>

                    {/* Log button */}
                    <TouchableOpacity
                        style={[styles.logButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleLogReading}
                    >
                        <MaterialCommunityIcons name="plus" size={20} color={theme.colors.onPrimary} />
                        <Text style={[styles.logButtonText, { color: theme.colors.onPrimary }]}>
                            {isArabic ? 'تسجيل' : 'Log Reading'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Info card */}
                <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
                    <MaterialCommunityIcons
                        name="information-outline"
                        size={20}
                        color={theme.colors.info.main}
                    />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                        {isArabic
                            ? `القرآن يحتوي على ${TOTAL_PAGES} صفحة و ${TOTAL_HIZB} حزب`
                            : `The Quran has ${TOTAL_PAGES} pages and ${TOTAL_HIZB} hizb`}
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
    // Progress card
    progressCard: {
        borderRadius: 20,
        padding: 20,
    },
    progressHeader: {
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
    progressInfo: {
        flex: 1,
    },
    progressLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    progressValue: {
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
    estimateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
    },
    estimateText: {
        fontSize: 13,
        flex: 1,
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
    // Today card
    todayCard: {
        borderRadius: 20,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    todayStats: {
        flexDirection: 'row',
        gap: 32,
    },
    todayStat: {
        alignItems: 'center',
    },
    todayValue: {
        fontSize: 32,
        fontWeight: '700',
    },
    todayLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    // Log card
    logCard: {
        borderRadius: 20,
        padding: 20,
    },
    modeToggle: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    modeText: {
        fontSize: 15,
        fontWeight: '600',
    },
    quickButtons: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    quickButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    quickButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 13,
        marginBottom: 6,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    logButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
    },
    logButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // Info card
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        borderRadius: 16,
        padding: 16,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    bottomSpacer: {
        height: 24,
    },
});

export default QuranScreen;
