// Track Screen - Full history and detailed views
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
import { useSalatStore, useHabitsStore } from '../store';
import { getWeekDates, getDayAbbr, parseDate, formatNumber, isToday, getFontFamily } from '../utils';
import { SalatName, SalatStatus } from '../types';
import CustomHabitsScreen from './CustomHabitsScreen';


const TrackScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logs: salatLogs, getOnTimePercentage } = useSalatStore();
    const { getWeeklyQuranPages, getWeeklyCharityCount, getWeeklyTahajjudNights } = useHabitsStore();
    const isArabic = i18n.language === 'ar';


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

    // Weekly stats configuration
    const weeklyStats = [
        {
            icon: 'book-open-page-variant',
            iconColor: theme.colors.success.main,
            value: getWeeklyQuranPages(),
            label: t('quran.pages'),
            bgColor: theme.colors.cards.quran,
        },
        {
            icon: 'heart',
            iconColor: theme.colors.error.main,
            value: getWeeklyCharityCount(),
            label: t('charity.timesGiven'),
            bgColor: theme.colors.cards.charity,
        },
        {
            icon: 'moon-waning-crescent',
            iconColor: theme.colors.info.main,
            value: getWeeklyTahajjudNights(),
            label: t('tahajjud.nights'),
            bgColor: theme.colors.cards.tahajjud,
        },
    ];

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
        >
            <View style={styles.header}>
                <Text style={[
                    styles.headerTitle,
                    { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }
                ]}>
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
                    <View style={[styles.legend, { borderTopColor: theme.colors.border }]}>
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
                        {weeklyStats.map((stat) => (
                            <View key={stat.icon} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
                                <View style={[styles.statIconContainer, { backgroundColor: stat.iconColor + '20' }]}>
                                    <MaterialCommunityIcons name={stat.icon as any} size={22} color={stat.iconColor} />
                                </View>
                                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                                    {formatNumber(stat.value, i18n.language)}
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                    {stat.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Custom Habits Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {i18n.language === 'ar' ? 'العادات المخصصة' : 'Custom Habits'}
                        </Text>
                    </View>
                    <Text style={[styles.sectionDesc, { color: theme.colors.textSecondary }]}>
                        {i18n.language === 'ar'
                            ? 'أنشئ عادات مخصصة وتتبعها يومياً'
                            : 'Create custom habits and track them daily'}
                    </Text>
                </View>

                {/* Render CustomHabitsScreen inline */}
                <CustomHabitsScreen />

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
    },,
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
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
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
        height: 90,
    },
    sectionDesc: {
        fontSize: 13,
        marginTop: 4,
    },
});

export default TrackScreen;
