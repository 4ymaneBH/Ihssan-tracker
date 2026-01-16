// Track Screen - Full history and detailed views
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore } from '../store';
import { getWeekDates, getDayAbbr, parseDate, formatNumber, isToday } from '../utils';
import { SalatName, SalatStatus } from '../types';

const TrackScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logs: salatLogs, getOnTimePercentage } = useSalatStore();
    const { getWeeklyQuranPages, getWeeklyCharityCount, getWeeklyTahajjudNights } = useHabitsStore();

    const weekDates = getWeekDates();
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

    const onTimePercent = getOnTimePercentage(7);

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('common.track')}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Salat Week Grid */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {t('salat.title')} - {t('insights.weeklyReport')}
                        </Text>
                        <View style={[styles.percentBadge, { backgroundColor: theme.colors.primaryLight }]}>
                            <Text style={[styles.percentText, { color: theme.colors.primary }]}>
                                {formatNumber(onTimePercent, i18n.language)}% {t('salat.onTime')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.weekGrid}>
                        {/* Header row with day names */}
                        <View style={styles.gridRow}>
                            <View style={styles.prayerLabelCell} />
                            {weekDates.map((dateStr) => {
                                const date = parseDate(dateStr);
                                const isTodayDate = isToday(dateStr);
                                return (
                                    <View
                                        key={dateStr}
                                        style={[
                                            styles.dayHeaderCell,
                                            isTodayDate && { backgroundColor: theme.colors.primaryLight },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayHeaderText,
                                                { color: isTodayDate ? theme.colors.primary : theme.colors.textSecondary },
                                            ]}
                                        >
                                            {getDayAbbr(date, i18n.language)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Prayer rows */}
                        {prayers.map((prayer) => (
                            <View key={prayer.key} style={styles.gridRow}>
                                <View style={styles.prayerLabelCell}>
                                    <Text style={[styles.prayerLabelText, { color: theme.colors.text }]}>
                                        {prayer.label}
                                    </Text>
                                </View>
                                {weekDates.map((dateStr) => {
                                    const log = salatLogs[dateStr];
                                    const status = log?.[prayer.key];
                                    return (
                                        <View
                                            key={dateStr}
                                            style={[
                                                styles.statusCell,
                                                { backgroundColor: status ? getStatusColor(status) + '30' : 'transparent' },
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.statusDot,
                                                    { backgroundColor: getStatusColor(status) },
                                                ]}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>

                    {/* Legend */}
                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: theme.colors.success.main }]} />
                            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                                {t('salat.onTime')}
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: theme.colors.warning.main }]} />
                            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                                {t('salat.late')}
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: theme.colors.error.main }]} />
                            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
                                {t('salat.missed')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Weekly Summary Stats */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        {t('insights.weeklyReport')}
                    </Text>

                    <View style={styles.statsGrid}>
                        <View style={[styles.statCard, { backgroundColor: theme.colors.cards.quran }]}>
                            <Text style={styles.statEmoji}>📖</Text>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>
                                {formatNumber(getWeeklyQuranPages(), i18n.language)}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                {t('quran.pages')}
                            </Text>
                        </View>

                        <View style={[styles.statCard, { backgroundColor: theme.colors.cards.charity }]}>
                            <Text style={styles.statEmoji}>❤️</Text>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>
                                {formatNumber(getWeeklyCharityCount(), i18n.language)}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                {t('charity.timesGiven')}
                            </Text>
                        </View>

                        <View style={[styles.statCard, { backgroundColor: theme.colors.cards.tahajjud }]}>
                            <Text style={styles.statEmoji}>🌙</Text>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>
                                {formatNumber(getWeeklyTahajjudNights(), i18n.language)}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                {t('tahajjud.nights')}
                            </Text>
                        </View>
                    </View>
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
    section: {
        borderRadius: 20,
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    percentBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    percentText: {
        fontSize: 12,
        fontWeight: '600',
    },
    // Week grid
    weekGrid: {
        gap: 4,
    },
    gridRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prayerLabelCell: {
        width: 60,
        paddingVertical: 8,
    },
    prayerLabelText: {
        fontSize: 12,
        fontWeight: '500',
    },
    dayHeaderCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 6,
    },
    dayHeaderText: {
        fontSize: 11,
        fontWeight: '600',
    },
    statusCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 6,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    // Legend
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
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
    legendText: {
        fontSize: 12,
    },
    // Stats
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    statEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
    },
    bottomSpacer: {
        height: 24,
    },
});

export default TrackScreen;
