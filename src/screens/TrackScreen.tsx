// Track Screen - Full history and detailed views
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
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore } from '../store';
import { getWeekDates, getDayAbbr, parseDate, formatNumber, isToday, getFontFamily } from '../utils';
import { SalatName, SalatStatus } from '../types';
import CustomHabitsScreen from './CustomHabitsScreen';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const CHART_WIDTH = Dimensions.get('window').width - 112;
const CHART_HEIGHT = 120;


const TrackScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logs: salatLogs, getOnTimePercentage } = useSalatStore();
    const { getWeeklyQuranPages, getWeeklyCharityCount, getWeeklyTahajjudNights } = useHabitsStore();
    const isArabic = i18n.language === 'ar';

    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [filterExpanded, setFilterExpanded] = useState(false);

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

    // Monthly calendar data
    const calendarData = useMemo(() => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells: Array<{ day: number; dateStr: string; hasLog: boolean; onTimeCount: number; isToday: boolean } | null> = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const log = salatLogs[dateStr];
            const hasLog = !!log && Object.values(log).some(Boolean);
            const onTimeCount = log ? (Object.values(log) as SalatStatus[]).filter(v => v === 'onTime').length : 0;
            cells.push({ day: d, dateStr, hasLog, onTimeCount, isToday: isToday(dateStr) });
        }
        return cells;
    }, [selectedMonth, salatLogs]);

    // Monthly chart data + SVG paths
    const { chartData, linePathD, areaPathD } = useMemo(() => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const data = Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const log = salatLogs[dateStr];
            if (!log) return 0;
            const values = Object.values(log).filter(Boolean) as SalatStatus[];
            const total = values.length;
            const onTime = values.filter(v => v === 'onTime').length;
            return total > 0 ? Math.round((onTime / total) * 100) : 0;
        });
        const n = data.length;
        const points = data.map((val, i) => ({
            x: n > 1 ? (i / (n - 1)) * CHART_WIDTH : 0,
            y: CHART_HEIGHT - (val / 100) * CHART_HEIGHT,
        }));
        const linePathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
        const areaPathD = n > 0
            ? `${linePathD} L ${points[n - 1].x.toFixed(1)} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`
            : '';
        return { chartData: data, linePathD, areaPathD };
    }, [selectedMonth, salatLogs]);

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
        >
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                        {t('common.track')}
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                        {isArabic ? 'سجل هذا الأسبوع' : 'This week\'s record'}
                    </Text>
                </View>
                <View style={[styles.onTimeChip, { backgroundColor: theme.colors.primary + '18' }]}>
                    <MaterialCommunityIcons name="mosque" size={14} color={theme.colors.primary} />
                    <Text style={[styles.onTimeChipText, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                        {formatNumber(onTimePercent, i18n.language)}%
                    </Text>
                </View>
            </View>


            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Monthly Calendar */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.cardBorder }]}>
                    {/* Calendar Month Nav */}
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity
                            style={styles.monthNavBtn}
                            onPress={() => {
                                const d = new Date(selectedMonth);
                                d.setMonth(d.getMonth() - 1);
                                setSelectedMonth(d);
                            }}
                        >
                            <MaterialCommunityIcons
                                name={isArabic ? 'chevron-right' : 'chevron-left'}
                                size={22}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.monthName, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                            {selectedMonth.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' })}
                        </Text>
                        <TouchableOpacity
                            style={styles.monthNavBtn}
                            onPress={() => {
                                const d = new Date(selectedMonth);
                                d.setMonth(d.getMonth() + 1);
                                setSelectedMonth(d);
                            }}
                        >
                            <MaterialCommunityIcons
                                name={isArabic ? 'chevron-left' : 'chevron-right'}
                                size={22}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Day-of-week header */}
                    <View style={styles.calendarDayRow}>
                        {(isArabic
                            ? ['\u0623\u062d', '\u0625\u062b', '\u062b\u0644', '\u0623\u0631', '\u062e\u0645', '\u062c\u0645', '\u0633\u0628']
                            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                        ).map((d, i) => (
                            <View key={i} style={styles.calendarDayHeader}>
                                <Text style={[styles.calendarDayHeaderText, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                    {d}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Grid */}
                    <View style={styles.calendarGrid}>
                        {calendarData.map((cell, i) => (
                            <View key={i} style={styles.calendarCell}>
                                {cell ? (
                                    <>
                                        <View style={[
                                            styles.calendarDayCircle,
                                            cell.isToday && { backgroundColor: theme.colors.primary },
                                        ]}>
                                            <Text style={[
                                                styles.calendarDayText,
                                                {
                                                    color: cell.isToday ? '#FFF' : theme.colors.text,
                                                    fontFamily: getFontFamily(isArabic, cell.isToday ? 'semiBold' : 'regular'),
                                                },
                                            ]}>
                                                {formatNumber(cell.day, i18n.language)}
                                            </Text>
                                        </View>
                                        {cell.hasLog && (
                                            <View style={[
                                                styles.calendarDot,
                                                { backgroundColor: cell.onTimeCount >= 3 ? theme.colors.success.main : theme.colors.warning.main },
                                            ]} />
                                        )}
                                    </>
                                ) : null}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Category Filter Card */}
                <TouchableOpacity
                    onPress={() => setFilterExpanded(!filterExpanded)}
                    activeOpacity={0.85}
                >
                    <View style={[styles.filterCard, { backgroundColor: theme.colors.primary + '12', borderColor: theme.colors.primary + '30' }]}>
                        <View style={styles.filterLeft}>
                            <View style={[styles.filterIconBox, { backgroundColor: theme.colors.primary + '20' }]}>
                                <MaterialCommunityIcons name="filter-variant" size={16} color={theme.colors.primary} />
                            </View>
                            <Text style={[styles.filterText, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                                {isArabic ? '\u0627\u0644\u0623\u062f\u0627\u0621 \u0627\u0644\u0639\u0627\u0645' : 'Overall Performance'}
                            </Text>
                        </View>
                        <MaterialCommunityIcons
                            name={filterExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={theme.colors.primary}
                        />
                    </View>
                </TouchableOpacity>

                {/* Monthly Commitment Chart */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.cardBorder }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                        {isArabic ? '\u0627\u0644\u062a\u0632\u0627\u0645\u064a \u0627\u0644\u0634\u0647\u0631\u064a' : 'Monthly Commitment'}
                    </Text>
                    <Text style={[styles.sectionDesc, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular'), marginBottom: 16 }]}>
                        {isArabic ? '\u0646\u0633\u0628\u0629 \u0627\u0644\u0635\u0644\u0627\u0629 \u0641\u064a \u0648\u0642\u062a\u0647\u0627' : 'On-time prayer rate'}
                    </Text>
                    <View style={styles.chartContainer}>
                        <View style={styles.chartYAxis}>
                            <Text style={[styles.chartAxisLabel, { color: theme.colors.textSecondary }]}>100%</Text>
                            <Text style={[styles.chartAxisLabel, { color: theme.colors.textSecondary }]}>50%</Text>
                            <Text style={[styles.chartAxisLabel, { color: theme.colors.textSecondary }]}>0%</Text>
                        </View>
                        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                            {/* Grid lines */}
                            <Line x1="0" y1="0" x2={CHART_WIDTH} y2="0" stroke={theme.colors.borderLight} strokeWidth="1" strokeDasharray="4,4" />
                            <Line x1="0" y1={CHART_HEIGHT / 2} x2={CHART_WIDTH} y2={CHART_HEIGHT / 2} stroke={theme.colors.borderLight} strokeWidth="1" strokeDasharray="4,4" />
                            <Line x1="0" y1={CHART_HEIGHT} x2={CHART_WIDTH} y2={CHART_HEIGHT} stroke={theme.colors.borderLight} strokeWidth="1" />
                            {/* Area fill */}
                            {chartData.length > 1 && (
                                <Path d={areaPathD} fill={theme.colors.primary + '20'} />
                            )}
                            {/* Line */}
                            {chartData.length > 1 && (
                                <Path
                                    d={linePathD}
                                    stroke={theme.colors.primary}
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}
                            {/* Today dot */}
                            {(() => {
                                const todayIdx = new Date().getDate() - 1;
                                const sameMonth =
                                    selectedMonth.getMonth() === new Date().getMonth() &&
                                    selectedMonth.getFullYear() === new Date().getFullYear();
                                if (sameMonth && todayIdx < chartData.length) {
                                    const cx = chartData.length > 1
                                        ? (todayIdx / (chartData.length - 1)) * CHART_WIDTH
                                        : 0;
                                    const cy = CHART_HEIGHT - (chartData[todayIdx] / 100) * CHART_HEIGHT;
                                    return <Circle cx={cx} cy={cy} r="5" fill={theme.colors.primary} />;
                                }
                                return null;
                            })()}
                        </Svg>
                    </View>
                </View>

                {/* Salat Week Grid */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.cardBorder }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                            {t('salat.title')}
                        </Text>
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
                                            {getDayAbbr(date, i18n.language as 'ar' | 'en')}
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
                                                { backgroundColor: status ? getStatusColor(status) + '25' : (theme.colors.borderLight + '60') },
                                            ]}
                                        >
                                            {status && (
                                                <View style={[styles.statusSquare, { backgroundColor: getStatusColor(status) }]} />
                                            )}
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
                <View style={[styles.section, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.cardBorder }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                        {t('insights.weeklyReport')}
                    </Text>

                    <View style={styles.statsGrid}>
                        {weeklyStats.map((stat) => (
                            <LinearGradient
                                key={stat.icon}
                                colors={[stat.iconColor + '22', stat.iconColor + '08']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.statCard}
                            >
                                <View style={[styles.statIconContainer, { backgroundColor: stat.iconColor + '25' }]}>
                                    <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.iconColor} />
                                </View>
                                <Text style={[styles.statValue, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                    {formatNumber(stat.value, i18n.language)}
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                    {stat.label}
                                </Text>
                            </LinearGradient>
                        ))}
                    </View>
                </View>

                {/* Custom Habits Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.cardBorder }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                            {i18n.language === 'ar' ? 'العادات المخصصة' : 'Custom Habits'}
                        </Text>
                    </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerTitle: { fontSize: 26, fontWeight: '700' },
    headerSubtitle: { fontSize: 13, marginTop: 2 },
    onTimeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
    },
    onTimeChipText: { fontSize: 14 },
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
        justifyContent: 'center',
        paddingVertical: 7,
        borderRadius: 7,
        marginHorizontal: 1,
    },
    statusSquare: {
        width: 14,
        height: 14,
        borderRadius: 4,
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
    // Calendar
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    monthNavBtn: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
    },
    monthName: {
        fontSize: 16,
    },
    calendarDayRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    calendarDayHeader: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 2,
    },
    calendarDayHeaderText: {
        fontSize: 11,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarCell: {
        width: '14.2857%',
        alignItems: 'center',
        paddingVertical: 4,
    },
    calendarDayCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarDayText: {
        fontSize: 13,
    },
    calendarDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        marginTop: 2,
    },
    // Filter card
    filterCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    filterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    filterIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterText: {
        fontSize: 15,
    },
    // Chart
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    chartYAxis: {
        width: 36,
        height: CHART_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: 6,
    },
    chartAxisLabel: {
        fontSize: 10,
    },
});

export default TrackScreen;
