// Quran Reading Screen - Premium Glassmorphism Design
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Book, Plus, ChevronLeft, Timer, CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context';
import { useHabitsStore, useUserPreferencesStore } from '../store';
import { formatNumber } from '../utils';
import { GradientBackground, GlassCard, IconCircleButton, PrimaryGradientButton, ProgressBar } from '../components';
import * as Haptics from 'expo-haptics';

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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
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
    const quickPages = [1, 2, 5, 10];

    const handleQuickLog = (pages: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPagesInput(String(pages));
    };

    return (
        <View style={styles.container}>
            <GradientBackground />
            
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <IconCircleButton
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            navigation.goBack();
                        }}
                    >
                        <ChevronLeft size={22} color={theme.colors.text} />
                    </IconCircleButton>
                    
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        {t('quran.title')}
                    </Text>
                    
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Weekly Progress Hero Card */}
                    <GlassCard
                        style={styles.heroCard}
                        intensity="medium"
                    >
                        <View style={styles.heroHeader}>
                            <View style={[styles.heroIcon, { backgroundColor: theme.colors.emerald + '20' }]}>
                                <Book size={28} color={theme.colors.emerald} />
                            </View>
                            <View style={styles.heroInfo}>
                                <Text style={[styles.heroLabel, { color: theme.colors.textSecondary }]}>
                                    {isArabic ? 'الهدف الأسبوعي' : 'Weekly Goal'}
                                </Text>
                                <Text style={[styles.heroValue, { color: theme.colors.text }]}>
                                    {formatNumber(weeklyPages, i18n.language)}<Text style={styles.heroTotal}> / {formatNumber(weeklyGoal, i18n.language)}</Text>
                                </Text>
                            </View>
                        </View>

                        <ProgressBar
                            progress={getWeeklyProgress()}
                            color={weeklyPages >= weeklyGoal ? theme.colors.emerald : theme.colors.purple}
                            style={styles.progressBar}
                        />

                        {/* Completion estimate */}
                        {completionMonths && (
                            <View style={styles.estimateRow}>
                                <Timer size={14} color={theme.colors.textTertiary} />
                                <Text style={[styles.estimateText, { color: theme.colors.textTertiary }]}>
                                    {isArabic
                                        ? `بهذا المعدل، ستختم القرآن في ${completionMonths} شهر`
                                        : `At this pace, ${completionMonths} months to complete`}
                                </Text>
                            </View>
                        )}

                        {weeklyPages >= weeklyGoal && (
                            <View style={styles.completedBadge}>
                                <CheckCircle2 size={16} color={theme.colors.emerald} />
                                <Text style={[styles.completedText, { color: theme.colors.emerald }]}>
                                    {isArabic ? 'تم تحقيق الهدف!' : 'Goal achieved!'}
                                </Text>
                            </View>
                        )}
                    </GlassCard>

                    {/* Today's Reading */}
                    {todayLog && (
                        <GlassCard style={styles.todayCard} intensity="light">
                            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                                {isArabic ? 'قراءة اليوم' : "Today's Reading"}
                            </Text>
                            <View style={styles.todayStats}>
                                <View style={styles.todayStat}>
                                    <Text style={[styles.todayValue, { color: theme.colors.purple }]}>
                                        {formatNumber(todayLog.pages, i18n.language)}
                                    </Text>
                                    <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                                        {t('quran.pages')}
                                    </Text>
                                </View>
                                {todayLog.minutes && (
                                    <>
                                        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                                        <View style={styles.todayStat}>
                                            <Text style={[styles.todayValue, { color: theme.colors.purple }]}>
                                                {formatNumber(todayLog.minutes, i18n.language)}
                                            </Text>
                                            <Text style={[styles.todayLabel, { color: theme.colors.textSecondary }]}>
                                                {isArabic ? 'دقيقة' : 'min'}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </GlassCard>
                    )}

                    {/* Log Reading Card */}
                    <GlassCard style={styles.logCard} intensity="medium">
                        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'تسجيل القراءة' : 'Log Reading'}
                        </Text>

                        {/* Tracking mode toggle */}
                        <View style={styles.modeToggle}>
                            <TouchableOpacity
                                style={[
                                    styles.modeButton,
                                    trackingMode === 'pages' && styles.modeButtonActive,
                                    {
                                        backgroundColor: trackingMode === 'pages'
                                            ? theme.colors.purple + '30'
                                            : theme.colors.glassBackground,
                                        borderColor: trackingMode === 'pages'
                                            ? theme.colors.purple
                                            : 'transparent',
                                    },
                                ]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setTrackingMode('pages');
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modeText,
                                        { color: trackingMode === 'pages' ? theme.colors.purple : theme.colors.textSecondary },
                                    ]}
                                >
                                    {t('quran.pages')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modeButton,
                                    trackingMode === 'hizb' && styles.modeButtonActive,
                                    {
                                        backgroundColor: trackingMode === 'hizb'
                                            ? theme.colors.purple + '30'
                                            : theme.colors.glassBackground,
                                        borderColor: trackingMode === 'hizb'
                                            ? theme.colors.purple
                                            : 'transparent',
                                    },
                                ]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setTrackingMode('hizb');
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modeText,
                                        { color: trackingMode === 'hizb' ? theme.colors.purple : theme.colors.textSecondary },
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
                                    style={[styles.quickButton, { backgroundColor: theme.colors.glassBackground }]}
                                    onPress={() => handleQuickLog(num)}
                                >
                                    <Text style={[styles.quickButtonText, { color: theme.colors.purple }]}>
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
                                            backgroundColor: theme.colors.glassBackground,
                                            color: theme.colors.text,
                                            borderColor: theme.colors.glassStroke,
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
                                    {isArabic ? 'دقائق' : 'Minutes'}
                                </Text>
                                <TextInput
                                    style={[
                                        styles.textInput,
                                        {
                                            backgroundColor: theme.colors.glassBackground,
                                            color: theme.colors.text,
                                            borderColor: theme.colors.glassStroke,
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
                        <PrimaryGradientButton
                            onPress={handleLogReading}
                            style={styles.logButton}
                        >
                            <View style={styles.logButtonContent}>
                                <Plus size={20} color="#FFFFFF" />
                                <Text style={styles.logButtonText}>
                                    {isArabic ? 'تسجيل' : 'Log Reading'}
                                </Text>
                            </View>
                        </PrimaryGradientButton>
                    </GlassCard>

                    {/* Info card */}
                    <View style={[styles.infoCard, { backgroundColor: theme.colors.glassBackground }]}>
                        <Text style={[styles.infoText, { color: theme.colors.textTertiary }]}>
                            {isArabic
                                ? `القرآن يحتوي على ${TOTAL_PAGES} صفحة و ${TOTAL_HIZB} حزب`
                                : `The Quran has ${TOTAL_PAGES} pages and ${TOTAL_HIZB} hizb`}
                        </Text>
                    </View>

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
        gap: 16,
    },
    // Hero card
    heroCard: {
        padding: 20,
    },
    heroHeader: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    heroIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroInfo: {
        flex: 1,
    },
    heroLabel: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 4,
        letterSpacing: 0.2,
    },
    heroValue: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    heroTotal: {
        fontSize: 20,
        fontWeight: '600',
        opacity: 0.5,
    },
    progressBar: {
        marginBottom: 14,
    },
    estimateRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    estimateText: {
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    completedBadge: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(52, 211, 153, 0.15)',
        borderRadius: 10,
        marginTop: 10,
    },
    completedText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    // Today card
    todayCard: {
        padding: 20,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 14,
        letterSpacing: 0.2,
    },
    todayStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 20,
    },
    todayStat: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    todayValue: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    todayLabel: {
        fontSize: 12,
        letterSpacing: 0.2,
    },
    divider: {
        width: 1,
        height: 40,
        opacity: 0.3,
    },
    // Log card
    logCard: {
        padding: 20,
    },
    modeToggle: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        gap: 10,
        marginBottom: 16,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
    },
    modeButtonActive: {
        borderWidth: 2,
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    quickButtons: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        gap: 10,
        marginBottom: 16,
    },
    quickButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    quickButtonText: {
        fontSize: 17,
        fontWeight:5,
        fontWeight: '6 0.2,
    },
    inputRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        gap: 12,
        marginBottom: 16,
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight:3,
        fontWeight: '600',
        letterSpacing: 0.2,
        marginBottom: 8
    textInput: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        borderWidth: 1.5,
    },
    logButton: {
        marginTop: 0,
    },
    logButtonContent: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },
    // Info card
    infoCard: {
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    infoText: {
        fontSize: 12,
        textAlign: 'center',
        letterSpacing: 0.2,
        lineHeight: 18,
    },
    bottomSpacer: {
        height: 20,
    },
});

export default QuranScreen;
