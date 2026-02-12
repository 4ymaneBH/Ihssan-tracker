// Today Screen - Premium Glassmorphism Dashboard
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    GradientBackground,
    GlassHeader,
    IconCircleButton,
    TrackerModuleCard,
    GlassCard,
} from '../components';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore, useKhatamStore } from '../store';
import { getDateString, formatNumber, getFontFamily } from '../utils';
import { getHijriDate } from '../utils/dateUtils';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TodayScreen() {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const isArabic = i18n.language === 'ar';

    // Stores
    const { getTodayLog, getPrayerStreak } = useSalatStore();
    const { getAdhkarLog, getCustomHabitLog } = useHabitsStore();
    const { currentSession } = useKhatamStore();

    // Data
    const today = getDateString(new Date());
    const todayLog = getTodayLog();
    const streak = getPrayerStreak();
    const hijriDate = getHijriDate(new Date(), isArabic ? 'ar' : 'en');

    // Calculate Salat progress
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
    const completedPrayers = prayers.filter(
        (p) => todayLog?.[p] && todayLog[p] !== 'missed'
    ).length;

    // Adhkar data
    const morningDone = !!getAdhkarLog(today, 'morning');
    const eveningDone = !!getAdhkarLog(today, 'evening');
    const adhkarProgress = (morningDone ? 1 : 0) + (eveningDone ? 1 : 0);

    // Quran data
    const quranProgress = currentSession?.dailyLogs?.[today] || 0;

    // Get overall progress
    const totalTasks = 8; // 5 prayers + 2 adhkar + 1 quran
    const completedTasks = completedPrayers + adhkarProgress + (quranProgress > 0 ? 1 : 0);
    const overallProgress = completedTasks / totalTasks;

    return (
        <GradientBackground>
            {/* Glass Header */}
            <GlassHeader
                left={
                    <View>
                        <Text
                            style={[
                                styles.greeting,
                                {
                                    color: theme.colors.text,
                                    fontFamily: isArabic ? theme.fontFamilies.arabic.bold : theme.fontFamilies.inter.semiBold,
                                    textAlign: isArabic ? 'right' : 'left',
                                },
                            ]}
                        >
                            {t('today.greeting')}
                        </Text>
                        <Text
                            style={[
                                styles.date,
                                {
                                    color: theme.colors.textSecondary,
                                    fontFamily: isArabic ? theme.fontFamilies.arabic.regular : theme.fontFamilies.inter.regular,
                                    textAlign: isArabic ? 'right' : 'left',
                                },
                            ]}
                        >
                            {hijriDate}
                        </Text>
                    </View>
                }
                right={
                    <IconCircleButton
                        icon="settings-outline"
                        onPress={() => navigation.navigate('Settings')}
                    />
                }
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Progress Card */}
                <GlassCard
                    borderRadius={28}
                    style={styles.heroCard}
                >
                    <View style={styles.heroContent}>
                        <View style={styles.heroHeader}>
                            <Text
                                style={[
                                    styles.heroTitle,
                                    {
                                        color: theme.colors.text,
                                        fontFamily: isArabic ? theme.fontFamilies.arabic.bold : theme.fontFamilies.inter.bold,
                                        textAlign: isArabic ? 'right' : 'left',
                                    },
                                ]}
                            >
                                {t('today.todayProgress')}
                            </Text>
                            
                            {/* Streak Badge */}
                            {streak > 0 && (
                                <View
                                    style={[
                                        styles.streakChip,
                                        { backgroundColor: theme.colors.primary + '20' },
                                    ]}
                                >
                                    <Ionicons
                                        name="flame"
                                        size={16}
                                        color={theme.colors.primary}
                                    />
                                    <Text
                                        style={[
                                            styles.streakText,
                                            {
                                                color: theme.colors.primary,
                                                fontFamily: isArabic ? theme.fontFamilies.arabic.semiBold : theme.fontFamilies.inter.semiBold,
                                            },
                                        ]}
                                    >
                                        {formatNumber(streak, i18n.language)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Progress Ring/Bar */}
                        <View style={styles.progressContainer}>
                            <View
                                style={[
                                    styles.progressCircle,
                                    { borderColor: theme.colors.border },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.progressPercentage,
                                        {
                                            color: theme.colors.text,
                                            fontFamily: isArabic ? theme.fontFamilies.arabic.bold : theme.fontFamilies.inter.bold,
                                        },
                                    ]}
                                >
                                    {Math.round(overallProgress * 100)}%
                                </Text>
                            </View>

                            <View style={styles.progressStats}>
                                <View style={styles.statItem}>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            {
                                                color: theme.colors.text,
                                                fontFamily: isArabic ? theme.fontFamilies.arabic.bold : theme.fontFamilies.inter.bold,
                                            },
                                        ]}
                                    >
                                        {completedTasks}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            {
                                                color: theme.colors.textSecondary,
                                                fontFamily: isArabic ? theme.fontFamilies.arabic.regular : theme.fontFamilies.inter.regular,
                                                textAlign: 'center',
                                            },
                                        ]}
                                    >
                                        {t('today.completed')}
                                    </Text>
                                </View>

                                <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

                                <View style={styles.statItem}>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            {
                                                color: theme.colors.text,
                                                fontFamily: isArabic ? theme.fontFamilies.arabic.bold : theme.fontFamilies.inter.bold,
                                            },
                                        ]}
                                    >
                                        {totalTasks - completedTasks}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            {
                                                color: theme.colors.textSecondary,
                                                fontFamily: isArabic ? theme.fontFamilies.arabic.regular : theme.fontFamilies.inter.regular,
                                                textAlign: 'center',
                                            },
                                        ]}
                                    >
                                        {t('today.remaining')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </GlassCard>

                {/* Module Grid */}
                <View style={styles.moduleGrid}>
                    <TrackerModuleCard
                        title={t('salat.title')}
                        icon="moon"
                        progress={completedPrayers}
                        total={5}
                        accentColor={theme.colors.accents.salat}
                        onPress={() => navigation.navigate('Track')}
                    />

                    <TrackerModuleCard
                        title={t('adhkar.title')}
                        icon="book-outline"
                        progress={adhkarProgress}
                        total={2}
                        accentColor={theme.colors.accents.adhkar}
                        onPress={() => navigation.navigate('Adhkar')}
                    />

                    <TrackerModuleCard
                        title={t('quran.title')}
                        icon="book"
                        progress={quranProgress}
                        total={1}
                        accentColor={theme.colors.accents.quran}
                        onPress={() => navigation.navigate('Quran')}
                    />

                    <TrackerModuleCard
                        title={t('charity.title')}
                        icon="heart-outline"
                        progress={0}
                        total={1}
                        accentColor={theme.colors.accents.charity}
                        onPress={() => navigation.navigate('Track')}
                    />

                    <TrackerModuleCard
                        title={t('tahajjud.title')}
                        icon="moon-outline"
                        progress={0}
                        total={1}
                        accentColor={theme.colors.accents.tahajjud}
                        onPress={() => navigation.navigate('Tahajjud')}
                    />

                    <TrackerModuleCard
                        title={t('habits.custom')}
                        icon="list-outline"
                        progress={0}
                        total={1}
                        accentColor={theme.colors.accents.custom}
                        onPress={() => navigation.navigate('CustomHabits')}
                    />
                </View>
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        gap: 16,
        paddingBottom: 100,
    },
    greeting: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    date: {
        fontSize: 14,
        marginTop: 4,
        opacity: 0.9,
    },
    heroCard: {
        marginBottom: 4,
    },
    heroContent: {
        padding: 20,
        gap: 16,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    streakChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    streakText: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    progressCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressPercentage: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -1,
    },
    progressStats: {
        flex: 1,
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flex: 1,
        gap: 6,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 13,
        letterSpacing: 0.2,
    },
    divider: {
        width: 1,
        height: 50,
        opacity: 0.3,
    },
    moduleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
});
