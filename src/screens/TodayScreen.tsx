// Today Screen - Main Dashboard - Premium Redesign
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    I18nManager,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, Rect, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore, useUserPreferencesStore } from '../store';
import { getDateString, formatNumber, getFontFamily } from '../utils';
import { getHijriDate } from '../utils/dateUtils';
import { SalatName, SalatStatus, RootStackParamList } from '../types';
import { ResetModal, AppCard, PrayerPill, QuickActionButton } from '../components';
import { usePrayerTimes } from '../hooks';
import { formatPrayerTime, getTimeRemaining } from '../services/prayerTimes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Prayer name → icon mapping
const PRAYER_ICONS: Record<string, string> = {
    fajr: 'weather-sunset-up',
    sunrise: 'white-balance-sunny',
    dhuhr: 'weather-sunny',
    asr: 'weather-sunny-alert',
    maghrib: 'weather-sunset-down',
    isha: 'weather-night',
};

// ========================================
// Next Prayer Banner Component
// ========================================
const NextPrayerBanner: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const isArabic = i18n.language === 'ar';

    const { prayerTimes, loading } = usePrayerTimes();
    const [countdown, setCountdown] = useState('');
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Update countdown every minute
    useEffect(() => {
        const update = () => {
            if (prayerTimes?.nextPrayer) {
                setCountdown(getTimeRemaining(prayerTimes.nextPrayer.time));
            }
        };
        update();
        const timer = setInterval(update, 60_000);
        return () => clearInterval(timer);
    }, [prayerTimes]);

    // Pulse animation on the dot
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [pulseAnim]);

    if (loading || !prayerTimes?.nextPrayer) {
        return (
            <View style={[bannerStyles.skeleton, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} />
        );
    }

    const { name, time } = prayerTimes.nextPrayer;
    const prayerLabel = t(`salat.${name}`, { defaultValue: name.charAt(0).toUpperCase() + name.slice(1) });
    const formattedTime = formatPrayerTime(time, false, i18n.language);
    const icon = PRAYER_ICONS[name] ?? 'mosque';

    const gradientColors: [string, string] = isDark
        ? ['rgba(164,217,108,0.18)', 'rgba(164,217,108,0.04)']
        : ['rgba(164,217,108,0.35)', 'rgba(164,217,108,0.08)'];

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[bannerStyles.container, { borderColor: isDark ? 'rgba(164,217,108,0.2)' : 'rgba(164,217,108,0.4)' }]}
        >
            {/* Icon */}
            <View style={[bannerStyles.iconWrap, { backgroundColor: theme.colors.primary + '25' }]}>
                <MaterialCommunityIcons name={icon as any} size={24} color={theme.colors.primary} />
            </View>

            {/* Labels */}
            <View style={bannerStyles.textGroup}>
                <Text style={[bannerStyles.label, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                    {isArabic ? 'الصلاة القادمة' : 'Next prayer'}
                </Text>
                <Text style={[bannerStyles.prayerName, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {prayerLabel}
                </Text>
            </View>

            {/* Time + Countdown */}
            <View style={bannerStyles.rightGroup}>
                <Text style={[bannerStyles.time, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {formattedTime}
                </Text>
                <View style={bannerStyles.countdownRow}>
                    <Animated.View style={[bannerStyles.dot, { backgroundColor: theme.colors.primary, opacity: pulseAnim }]} />
                    <Text style={[bannerStyles.countdown, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                        {countdown}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const bannerStyles = StyleSheet.create({
    skeleton: {
        height: 72,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        gap: 12,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textGroup: {
        flex: 1,
        gap: 2,
    },
    label: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    prayerName: {
        fontSize: 17,
    },
    rightGroup: {
        alignItems: 'flex-end',
        gap: 4,
    },
    time: {
        fontSize: 17,
    },
    countdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    countdown: {
        fontSize: 12,
    },
});

// ========================================
// Mosque Silhouette SVG Component - 3D Volumetric
// ========================================
const MosqueSilhouette: React.FC<{ width: number; height: number }> = ({ width, height }) => (
    <Svg width={width} height={height} viewBox="0 0 360 220">
        <Defs>
            {/* Main dome - brighter at top-left, darker at base */}
            <SvgGradient id="domeMain" x1="0.2" y1="0" x2="0.8" y2="1">
                <Stop offset="0" stopColor="#2EE8A0" stopOpacity="0.75" />
                <Stop offset="0.45" stopColor="#0EA571" stopOpacity="0.7" />
                <Stop offset="1" stopColor="#053D27" stopOpacity="0.95" />
            </SvgGradient>
            {/* Side face of dome - darker */}
            <SvgGradient id="domeSide" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#0EA571" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#042A1A" stopOpacity="0.95" />
            </SvgGradient>
            {/* Minaret gradient - left to right shading */}
            <SvgGradient id="minaretL" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#2EE8A0" stopOpacity="0.7" />
                <Stop offset="1" stopColor="#042A1A" stopOpacity="0.9" />
            </SvgGradient>
            <SvgGradient id="minaretR" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#0EA571" stopOpacity="0.65" />
                <Stop offset="1" stopColor="#031E12" stopOpacity="0.95" />
            </SvgGradient>
            {/* Base wall */}
            <SvgGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0EA571" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#042A1A" stopOpacity="0.85" />
            </SvgGradient>
        </Defs>

        {/* ── Left minaret body ── */}
        <Rect x="52" y="78" width="18" height="95" rx="9" fill="url(#minaretL)" />
        {/* Left minaret cap (pointed cone) */}
        <Path d="M49,82 Q61,50 73,82 Z" fill="#1ECC8A" opacity="0.85" />
        {/* Left minaret balcony ring */}
        <Rect x="48" y="105" width="26" height="5" rx="2.5" fill="#0EA571" opacity="0.6" />
        {/* Left crescent */}
        <Path d="M58,52 Q61,44 64,52 Q61,48.5 58,52 Z" fill="#2EE8A0" opacity="0.95" />
        <Circle cx="63" cy="43" r="2.5" fill="#2EE8A0" opacity="0.85" />

        {/* ── Right minaret body ── */}
        <Rect x="290" y="78" width="18" height="95" rx="9" fill="url(#minaretR)" />
        {/* Right minaret cap */}
        <Path d="M287,82 Q299,50 311,82 Z" fill="#0EA571" opacity="0.8" />
        {/* Right minaret balcony ring */}
        <Rect x="286" y="105" width="26" height="5" rx="2.5" fill="#063D27" opacity="0.7" />
        {/* Right crescent */}
        <Path d="M296,52 Q299,44 302,52 Q299,48.5 296,52 Z" fill="#1ECC8A" opacity="0.9" />
        <Circle cx="301" cy="43" r="2.5" fill="#1ECC8A" opacity="0.8" />

        {/* ── Main dome hemisphere ── */}
        <Path d="M85,168 Q85,30 180,12 Q275,30 275,168 Z" fill="url(#domeMain)" />
        {/* Dome highlight (lit face – top left shimmer) */}
        <Path d="M115,155 Q108,80 150,42 Q165,52 168,75 Q138,90 128,155 Z" fill="#3DFDB8" opacity="0.1" />
        {/* Dome right shadow */}
        <Path d="M230,155 Q250,100 265,155 Z" fill="#021810" opacity="0.35" />

        {/* ── Crescent on main dome ── */}
        <Path d="M173,14 Q180,2 187,14 Q181,8 174,14 Z" fill="#2EE8A0" opacity="0.95" />
        <Circle cx="183" cy="2" r="3" fill="#2EE8A0" opacity="0.85" />

        {/* ── Side small domes ── */}
        <Path d="M85,168 Q85,128 115,120 Q145,128 145,168" fill="#0A4830" opacity="0.6" />
        <Path d="M215,168 Q215,128 245,120 Q275,128 275,168" fill="#063320" opacity="0.6" />

        {/* ── Base wall ── */}
        <Rect x="72" y="160" width="216" height="28" rx="5" fill="url(#wallGrad)" />
        {/* Wall arched openings */}
        <Path d="M100,188 Q100,165 118,162 Q136,165 136,188" fill="#021810" opacity="0.45" />
        <Path d="M144,188 Q144,158 180,154 Q216,158 216,188" fill="#021810" opacity="0.45" />
        <Path d="M224,188 Q224,165 242,162 Q260,165 260,188" fill="#021810" opacity="0.45" />

        {/* ── Ambient stars ── */}
        <Circle cx="30" cy="45" r="1.5" fill="#2EE8A0" opacity="0.55" />
        <Circle cx="18" cy="80" r="1" fill="#2EE8A0" opacity="0.4" />
        <Circle cx="340" cy="30" r="1.2" fill="#2EE8A0" opacity="0.45" />
        <Circle cx="350" cy="75" r="1" fill="#2EE8A0" opacity="0.35" />
        <Circle cx="50" cy="25" r="1" fill="#2EE8A0" opacity="0.4" />
        <Circle cx="310" cy="60" r="1.2" fill="#2EE8A0" opacity="0.4" />
    </Svg>
);

// ========================================
// Hero Section Component
// ========================================
const HeroSection: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const isArabic = i18n.language === 'ar';

    const displayName = useUserPreferencesStore(state => state.displayName);
    const { getPrayerStreak } = useSalatStore();
    const { getWeeklyQuranPages } = useHabitsStore();
    const { goals } = useUserPreferencesStore();
    const streak = getPrayerStreak();
    const weeklyPages = getWeeklyQuranPages();

    const today = new Date();
    const hijriDate = getHijriDate(today, isArabic ? 'ar' : 'en');

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = today.getHours();
        if (hour < 12) return isArabic ? 'صباح الخير' : 'Good morning';
        if (hour < 17) return isArabic ? 'مساء الخير' : 'Good afternoon';
        return isArabic ? 'مساء الخير' : 'Good evening';
    };

    // Week streak data (last 7 days)
    const weekDays = useMemo(() => {
        const days = [];
        const dayLabels = isArabic
            ? ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب']
            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = getDateString(d);
            const dayOfWeek = d.getDay();
            days.push({
                label: dayLabels[dayOfWeek],
                completed: useSalatStore.getState().logs[dateStr]
                    ? Object.values(useSalatStore.getState().logs[dateStr]).filter(v => v === 'onTime' || v === 'late').length >= 3
                    : false,
                isToday: i === 0,
            });
        }
        return days;
    }, [isArabic]);

    const gradientColors: [string, string, string] = isDark
        ? ['#0B2018', '#091509', '#070E0A']
        : ['#E5F5EE', '#F0FBF5', '#FFFFFF'];

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={heroStyles.container}
        >
            {/* Mosque silhouette in background */}
            <View style={heroStyles.mosqueContainer}>
                <MosqueSilhouette
                    width={SCREEN_WIDTH * 0.85}
                    height={200}
                />
            </View>

            {/* Greeting */}
            <View style={heroStyles.greetingSection}>
                <Text style={[heroStyles.greeting, { color: isDark ? '#8FA898' : theme.colors.textSecondary }]}>
                    {getGreeting()},
                </Text>
                <Text style={[heroStyles.name, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {displayName || (isArabic ? 'مستخدم' : 'User')}
                </Text>
                <Text style={[heroStyles.hijriDate, { color: isDark ? '#5A7363' : theme.colors.textTertiary }]}>
                    {hijriDate}
                </Text>
            </View>

            {/* Streak Section */}
            {streak > 0 && (
                <View style={[heroStyles.streakCard, {
                    backgroundColor: isDark ? 'rgba(14,165,113,0.1)' : 'rgba(14,165,113,0.07)',
                    borderColor: isDark ? 'rgba(14,165,113,0.18)' : 'rgba(14,165,113,0.14)',
                }]}>
                    <View style={heroStyles.streakHeader}>
                        <Text style={{ fontSize: 16 }}>🔥</Text>
                        <Text style={[heroStyles.streakTitle, { color: theme.colors.text }]}>
                            {isArabic
                                ? `أنت في سلسلة ${formatNumber(streak, 'ar')} يوم!`
                                : `You're on the ${formatNumber(streak, 'en')} day streaks!`}
                        </Text>
                    </View>

                    {/* Week calendar */}
                    <View style={heroStyles.weekRow}>
                        {weekDays.map((day, idx) => (
                            <View key={idx} style={heroStyles.dayColumn}>
                                <Text style={[heroStyles.dayLabel, {
                                    color: day.isToday ? theme.colors.primary : (isDark ? '#5A7363' : theme.colors.textTertiary),
                                    fontWeight: day.isToday ? '700' : '500',
                                }]}>
                                    {day.label}
                                </Text>
                                <View style={[heroStyles.dayCircle, {
                                    backgroundColor: day.completed
                                        ? theme.colors.primary
                                        : (isDark ? '#1A2B1F' : '#E5E8E2'),
                                    borderWidth: day.isToday ? 2 : 0,
                                    borderColor: day.isToday ? theme.colors.primary : 'transparent',
                                }]}>
                                    {day.completed && (
                                        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    <Text style={[heroStyles.streakHint, { color: isDark ? '#5A7363' : theme.colors.textTertiary }]}>
                        {isArabic ? 'تدرب كل يوم حتى لا تفقد سلسلتك' : "Practice each day so your streak won't reset"}
                    </Text>
                </View>
            )}
        </LinearGradient>
    );
};

const heroStyles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingBottom: 20,
        paddingHorizontal: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    mosqueContainer: {
        position: 'absolute',
        top: -20,
        right: -40,
        opacity: 0.6,
    },
    greetingSection: {
        marginBottom: 20,
        zIndex: 1,
    },
    greeting: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 4,
    },
    name: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    hijriDate: {
        fontSize: 13,
        marginTop: 4,
    },
    streakCard: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        zIndex: 1,
    },
    streakHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    streakTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dayColumn: {
        alignItems: 'center',
        gap: 6,
    },
    dayLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    dayCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakHint: {
        fontSize: 12,
        textAlign: 'center',
    },
});

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
    const { logPrayer, getTodayLog, getPrayerStreak, undoPrayer, canUndo } = useSalatStore();
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

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        logPrayer(today, prayer, newStatus);
    };

    const handleUndo = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        undoPrayer();
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

            {/* Undo last prayer log */}
            {canUndo() && (
                <TouchableOpacity
                    style={[styles.undoButton, { borderColor: theme.colors.border }]}
                    onPress={handleUndo}
                    activeOpacity={0.75}
                >
                    <MaterialCommunityIcons name="undo" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.undoText, { color: theme.colors.textSecondary, fontFamily: getFontFamily(i18n.language === 'ar', 'regular') }]}>
                        {i18n.language === 'ar' ? 'تراجع' : 'Undo'}
                    </Text>
                </TouchableOpacity>
            )}

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
            <View style={styles.quranFooterRow}>
                <TouchableOpacity style={styles.quranFooterLink} onPress={handleOpenQuranScreen}>
                    <Text style={[styles.viewDetailsLinkText, { color: theme.colors.primary }]}>
                        {isArabic ? 'عرض التفاصيل' : 'View Details'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quranFooterKhatam}
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

    const handleOpenProfile = () => {
        navigation.navigate('Profile');
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
        >
            {/* Minimal Header */}
            <View style={styles.header}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    style={[styles.profileButton, {
                        backgroundColor: isDark ? 'rgba(14,165,113,0.12)' : theme.colors.surface,
                        borderColor: isDark ? 'rgba(14,165,113,0.18)' : theme.colors.cardBorder,
                        borderWidth: 1,
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
                <HeroSection />
                <NextPrayerBanner />
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 4,
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
    undoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        gap: 4,
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    undoText: {
        fontSize: 13,
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
    quranFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    quranFooterLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quranFooterKhatam: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
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
