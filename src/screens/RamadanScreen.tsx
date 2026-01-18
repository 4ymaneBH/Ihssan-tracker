// Ramadan Screen - Special tracking for the blessed month
import React, { useState, useMemo } from 'react';
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
import { getDateString } from '../utils';
import { RamadanLog } from '../types';

// Ramadan 2025 dates (example - should be configurable)
const RAMADAN_START = new Date('2025-03-01'); // Approximate start
const RAMADAN_DAYS = 30;

const getRamadanDay = (date: Date): number => {
    const diffTime = date.getTime() - RAMADAN_START.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.min(diffDays, RAMADAN_DAYS));
};

const RamadanScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const isArabic = i18n.language === 'ar';

    // Local state for today's Ramadan tracking
    const today = new Date();
    const todayStr = getDateString(today);
    const ramadanDay = getRamadanDay(today);

    const [suhoorDone, setSuhoorDone] = useState(false);
    const [iftarDone, setIftarDone] = useState(false);
    const [taraweehDone, setTaraweehDone] = useState(false);
    const [currentJuz, setCurrentJuz] = useState(ramadanDay);

    // Calculate progress
    const tasksCompleted = [suhoorDone, iftarDone, taraweehDone].filter(Boolean).length;
    const progressPercentage = Math.round((tasksCompleted / 3) * 100);

    const handleJuzChange = (increment: number) => {
        const newJuz = currentJuz + increment;
        if (newJuz >= 1 && newJuz <= 30) {
            setCurrentJuz(newJuz);
        }
    };

    const formatArabicNumber = (num: number): string => {
        if (isArabic) {
            return num.toLocaleString('ar-EG');
        }
        return num.toString();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        {isArabic ? 'رمضان' : 'Ramadan'}
                    </Text>
                    <View style={[styles.dayBadge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.dayBadgeText, { color: theme.colors.onPrimary }]}>
                            {isArabic ? `اليوم ${formatArabicNumber(ramadanDay)}` : `Day ${ramadanDay}`}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Card */}
                <View style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'تقدم اليوم' : "Today's Progress"}
                        </Text>
                        <Text style={[styles.progressPercent, { color: theme.colors.primary }]}>
                            {formatArabicNumber(progressPercentage)}%
                        </Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    backgroundColor: theme.colors.primary,
                                    width: `${progressPercentage}%`,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.progressSubtext, { color: theme.colors.textSecondary }]}>
                        {isArabic
                            ? `${formatArabicNumber(tasksCompleted)} من ${formatArabicNumber(3)} مهام مكتملة`
                            : `${tasksCompleted} of 3 tasks completed`}
                    </Text>
                </View>

                {/* Suhoor Card */}
                <TouchableOpacity
                    style={[
                        styles.taskCard,
                        {
                            backgroundColor: suhoorDone ? theme.colors.success.main + '15' : theme.colors.surface,
                            borderColor: suhoorDone ? theme.colors.success.main : theme.colors.border,
                        },
                    ]}
                    onPress={() => setSuhoorDone(!suhoorDone)}
                >
                    <View style={[styles.taskIcon, { backgroundColor: theme.colors.warning.main + '20' }]}>
                        <MaterialCommunityIcons
                            name="weather-sunset-up"
                            size={28}
                            color={theme.colors.warning.main}
                        />
                    </View>
                    <View style={styles.taskContent}>
                        <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'السحور' : 'Suhoor'}
                        </Text>
                        <Text style={[styles.taskSubtitle, { color: theme.colors.textSecondary }]}>
                            {isArabic ? 'وجبة ما قبل الفجر' : 'Pre-dawn meal'}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.checkbox,
                            {
                                backgroundColor: suhoorDone ? theme.colors.success.main : 'transparent',
                                borderColor: suhoorDone ? theme.colors.success.main : theme.colors.border,
                            },
                        ]}
                    >
                        {suhoorDone && (
                            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Iftar Card */}
                <TouchableOpacity
                    style={[
                        styles.taskCard,
                        {
                            backgroundColor: iftarDone ? theme.colors.success.main + '15' : theme.colors.surface,
                            borderColor: iftarDone ? theme.colors.success.main : theme.colors.border,
                        },
                    ]}
                    onPress={() => setIftarDone(!iftarDone)}
                >
                    <View style={[styles.taskIcon, { backgroundColor: theme.colors.error.main + '20' }]}>
                        <MaterialCommunityIcons
                            name="weather-sunset-down"
                            size={28}
                            color={theme.colors.error.main}
                        />
                    </View>
                    <View style={styles.taskContent}>
                        <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'الإفطار' : 'Iftar'}
                        </Text>
                        <Text style={[styles.taskSubtitle, { color: theme.colors.textSecondary }]}>
                            {isArabic ? 'وجبة الإفطار' : 'Breaking the fast'}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.checkbox,
                            {
                                backgroundColor: iftarDone ? theme.colors.success.main : 'transparent',
                                borderColor: iftarDone ? theme.colors.success.main : theme.colors.border,
                            },
                        ]}
                    >
                        {iftarDone && (
                            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Taraweeh Card */}
                <TouchableOpacity
                    style={[
                        styles.taskCard,
                        {
                            backgroundColor: taraweehDone ? theme.colors.success.main + '15' : theme.colors.surface,
                            borderColor: taraweehDone ? theme.colors.success.main : theme.colors.border,
                        },
                    ]}
                    onPress={() => setTaraweehDone(!taraweehDone)}
                >
                    <View style={[styles.taskIcon, { backgroundColor: theme.colors.info.main + '20' }]}>
                        <MaterialCommunityIcons
                            name="moon-waning-crescent"
                            size={28}
                            color={theme.colors.info.main}
                        />
                    </View>
                    <View style={styles.taskContent}>
                        <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'التراويح' : 'Taraweeh'}
                        </Text>
                        <Text style={[styles.taskSubtitle, { color: theme.colors.textSecondary }]}>
                            {isArabic ? 'صلاة الليل' : 'Night prayer'}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.checkbox,
                            {
                                backgroundColor: taraweehDone ? theme.colors.success.main : 'transparent',
                                borderColor: taraweehDone ? theme.colors.success.main : theme.colors.border,
                            },
                        ]}
                    >
                        {taraweehDone && (
                            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Quran Juz Tracker */}
                <View style={[styles.juzCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.juzHeader}>
                        <View style={[styles.taskIcon, { backgroundColor: theme.colors.success.main + '20' }]}>
                            <MaterialCommunityIcons
                                name="book-open-page-variant"
                                size={28}
                                color={theme.colors.success.main}
                            />
                        </View>
                        <View style={styles.juzContent}>
                            <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                                {isArabic ? 'ختم القرآن' : 'Quran Khatm'}
                            </Text>
                            <Text style={[styles.taskSubtitle, { color: theme.colors.textSecondary }]}>
                                {isArabic ? 'تتبع الأجزاء اليومية' : 'Track daily juz reading'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.juzSelector}>
                        <TouchableOpacity
                            style={[styles.juzButton, { backgroundColor: theme.colors.primaryLight }]}
                            onPress={() => handleJuzChange(-1)}
                        >
                            <MaterialCommunityIcons name="minus" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>

                        <View style={styles.juzDisplay}>
                            <Text style={[styles.juzLabel, { color: theme.colors.textSecondary }]}>
                                {isArabic ? 'الجزء' : 'Juz'}
                            </Text>
                            <Text style={[styles.juzNumber, { color: theme.colors.text }]}>
                                {formatArabicNumber(currentJuz)}
                            </Text>
                            <Text style={[styles.juzTotal, { color: theme.colors.textTertiary }]}>
                                / {formatArabicNumber(30)}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.juzButton, { backgroundColor: theme.colors.primaryLight }]}
                            onPress={() => handleJuzChange(1)}
                        >
                            <MaterialCommunityIcons name="plus" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Juz Progress Bar */}
                    <View style={[styles.juzProgressBar, { backgroundColor: theme.colors.border }]}>
                        <View
                            style={[
                                styles.juzProgressFill,
                                {
                                    backgroundColor: theme.colors.success.main,
                                    width: `${(currentJuz / 30) * 100}%`,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.juzProgressText, { color: theme.colors.textSecondary }]}>
                        {isArabic
                            ? `${formatArabicNumber(Math.round((currentJuz / 30) * 100))}% مكتمل`
                            : `${Math.round((currentJuz / 30) * 100)}% complete`}
                    </Text>
                </View>

                {/* Ramadan Du'a Card */}
                <View style={[styles.duaCard, { backgroundColor: theme.colors.cards.adhkar }]}>
                    <View style={styles.duaHeader}>
                        <MaterialCommunityIcons
                            name="hands-pray"
                            size={24}
                            color={theme.colors.primary}
                        />
                        <Text style={[styles.duaTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'دعاء الإفطار' : 'Iftar Du\'a'}
                        </Text>
                    </View>
                    <Text style={[styles.duaArabic, { color: theme.colors.text }]}>
                        ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ
                    </Text>
                    <Text style={[styles.duaTranslation, { color: theme.colors.textSecondary }]}>
                        {isArabic
                            ? 'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله'
                            : 'Thirst has gone, the veins are moistened, and the reward is assured, if Allah wills.'}
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
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    dayBadge: {
        marginTop: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dayBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    // Progress Card
    progressCard: {
        borderRadius: 20,
        padding: 20,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    progressPercent: {
        fontSize: 24,
        fontWeight: '700',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressSubtext: {
        fontSize: 13,
        marginTop: 8,
    },
    // Task Cards
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        gap: 14,
    },
    taskIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    taskSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Juz Card
    juzCard: {
        borderRadius: 20,
        padding: 20,
    },
    juzHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
    },
    juzContent: {
        flex: 1,
    },
    juzSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 16,
    },
    juzButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    juzDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    juzLabel: {
        fontSize: 14,
        marginRight: 4,
    },
    juzNumber: {
        fontSize: 36,
        fontWeight: '700',
    },
    juzTotal: {
        fontSize: 18,
    },
    juzProgressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    juzProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    juzProgressText: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    // Du'a Card
    duaCard: {
        borderRadius: 20,
        padding: 20,
    },
    duaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    duaTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    duaArabic: {
        fontSize: 20,
        lineHeight: 36,
        textAlign: 'right',
        marginBottom: 12,
    },
    duaTranslation: {
        fontSize: 14,
        lineHeight: 22,
    },
    bottomSpacer: {
        height: 24,
    },
});

export default RamadanScreen;
