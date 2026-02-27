// Quran Screen - Premium Surah Browser + Progress Tracking + Surah Reader
import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList,
    I18nManager,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context';
import { useHabitsStore, useUserPreferencesStore } from '../store';
import { formatNumber, getFontFamily } from '../utils';
import { SURAH_LIST, getSurahBadgeColor, Surah } from '../data/quranSurahs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_PAGES = 604;
const TOTAL_HIZB = 60;
const PAGES_PER_HIZB = TOTAL_PAGES / TOTAL_HIZB;

type ViewMode = 'browse' | 'track';
type BrowseTab = 'surah' | 'page' | 'juz' | 'hizb';

interface AyahData {
    numberInSurah: number;
    arabic: string;
    translation: string;
}

// ─── Surah Reader Screen ────────────────────────────────────────────────────
const SurahReader: React.FC<{
    surah: Surah;
    onBack: () => void;
}> = ({ surah, onBack }) => {
    const { i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const isArabic = i18n.language === 'ar';
    const [ayahs, setAyahs] = useState<AyahData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(isDark);

    React.useEffect(() => {
        const fetchSurah = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(
                    `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-simple,en.sahih`
                );
                const json = await res.json();
                if (json.code === 200 && json.data?.length >= 2) {
                    const arabicAyahs = json.data[0].ayahs as { numberInSurah: number; text: string }[];
                    const englishAyahs = json.data[1].ayahs as { numberInSurah: number; text: string }[];
                    setAyahs(arabicAyahs.map((a, i) => ({
                        numberInSurah: a.numberInSurah,
                        arabic: a.text,
                        translation: englishAyahs[i]?.text ?? '',
                    })));
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchSurah();
    }, [surah.number]);

    const readerBg = isDarkMode ? '#111815' : '#FFFFFF';
    const readerCard = isDarkMode ? '#1A2620' : '#F8F9F8';
    const readerText = isDarkMode ? '#F0F5F1' : '#111827';
    const readerSub = isDarkMode ? '#8FA898' : '#6B7280';
    const readerBorder = isDarkMode ? '#1E3125' : '#E5E7EB';
    const badgeBg = isDarkMode ? '#2A1E08' : '#FFF8EC';
    const badgeText = '#C9961A';

    const renderAyah = ({ item }: { item: AyahData }) => (
        <View style={[readerStyles.ayahCard, { backgroundColor: readerCard, borderColor: readerBorder }]}>
            {/* Row: number badge + action icons */}
            <View style={readerStyles.ayahHeader}>
                <View style={[readerStyles.ayahBadge, { backgroundColor: badgeBg, borderColor: badgeText + '40' }]}>
                    <Text style={[readerStyles.ayahBadgeText, { color: badgeText }]}>
                        {item.numberInSurah}
                    </Text>
                </View>
                <View style={readerStyles.ayahActions}>
                    <TouchableOpacity style={readerStyles.actionIcon}>
                        <MaterialCommunityIcons name="eye-off-outline" size={18} color={readerSub} />
                    </TouchableOpacity>
                    <TouchableOpacity style={readerStyles.actionIcon}>
                        <MaterialCommunityIcons name="heart-outline" size={18} color={readerSub} />
                    </TouchableOpacity>
                    <TouchableOpacity style={readerStyles.actionIcon}>
                        <MaterialCommunityIcons name="play-circle-outline" size={18} color={readerSub} />
                    </TouchableOpacity>
                </View>
            </View>
            {/* Arabic */}
            <Text style={[readerStyles.arabicText, { color: readerText }]}>
                {item.arabic}
            </Text>
            {/* Translation */}
            <Text style={[readerStyles.translationText, { color: readerSub }]}>
                "{item.translation}"
            </Text>
        </View>
    );

    return (
        <View style={[readerStyles.container, { backgroundColor: readerBg }]}>
            {/* Header */}
            <View style={[readerStyles.header, { borderBottomColor: readerBorder }]}>
                <TouchableOpacity style={readerStyles.backBtn} onPress={onBack}>
                    <MaterialCommunityIcons
                        name={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
                        size={24}
                        color={readerText}
                    />
                </TouchableOpacity>
                <View style={readerStyles.headerCenter}>
                    <Text style={[readerStyles.headerTitle, { color: readerText }]}>
                        {surah.name} - {surah.englishName}
                    </Text>
                    <Text style={[readerStyles.headerSub, { color: readerSub }]}>
                        {surah.versesCount} Verses  •  {surah.revelationType}
                    </Text>
                </View>
                {/* Light/Dark toggle */}
                <View style={[readerStyles.themeToggle, { backgroundColor: isDarkMode ? '#1A2620' : '#F0F2EE' }]}>
                    <TouchableOpacity
                        style={[readerStyles.themeBtn, !isDarkMode && { backgroundColor: '#FFFFFF' }]}
                        onPress={() => setIsDarkMode(false)}
                    >
                        <Text style={{ fontSize: 11, fontWeight: '600', color: isDarkMode ? '#8FA898' : '#111' }}>
                            Light
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[readerStyles.themeBtn, isDarkMode && { backgroundColor: '#2A3A30' }]}
                        onPress={() => setIsDarkMode(true)}
                    >
                        <Text style={{ fontSize: 11, fontWeight: '600', color: isDarkMode ? '#F0F5F1' : '#8FA898' }}>
                            Dark
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={readerStyles.centered}>
                    <ActivityIndicator size="large" color="#0EA571" />
                    <Text style={[readerStyles.loadingText, { color: readerSub }]}>
                        {isArabic ? 'جارٍ التحميل...' : 'Loading...'}
                    </Text>
                </View>
            ) : error ? (
                <View style={readerStyles.centered}>
                    <MaterialCommunityIcons name="wifi-off" size={48} color={readerSub} />
                    <Text style={[readerStyles.loadingText, { color: readerSub }]}>
                        {isArabic ? 'تعذّر التحميل. تحقق من الاتصال.' : 'Could not load. Check your connection.'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={ayahs}
                    renderItem={renderAyah}
                    keyExtractor={item => String(item.numberInSurah)}
                    contentContainerStyle={readerStyles.list}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={readerStyles.bismillah}>
                            <Text style={[readerStyles.bismillahText, { color: readerText }]}>
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const QuranScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const { logQuranReading, getTodayQuranLog, getWeeklyQuranPages } = useHabitsStore();
    const { goals } = useUserPreferencesStore();

    const [viewMode, setViewMode] = useState<ViewMode>('browse');
    const [browseTab, setBrowseTab] = useState<BrowseTab>('surah');
    const [searchQuery, setSearchQuery] = useState('');
    const [pagesInput, setPagesInput] = useState('');
    const [trackingMode, setTrackingMode] = useState<'pages' | 'hizb'>('pages');
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

    const isArabic = i18n.language === 'ar';
    const todayLog = getTodayQuranLog();
    const weeklyPages = getWeeklyQuranPages();
    const weeklyGoal = (goals?.quranPagesPerDay || 2) * 7;

    // Filter surahs based on search
    const filteredSurahs = useMemo(() => {
        if (!searchQuery.trim()) return SURAH_LIST;
        const q = searchQuery.toLowerCase();
        return SURAH_LIST.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.englishName.toLowerCase().includes(q) ||
            s.nameArabic.includes(searchQuery) ||
            String(s.number).includes(q)
        );
    }, [searchQuery]);

    const handleLogReading = () => {
        const value = parseInt(pagesInput) || 0;
        if (value <= 0) {
            Alert.alert(
                isArabic ? 'خطأ' : 'Error',
                isArabic ? 'أدخل عدد صفحات صحيح' : 'Please enter a valid number'
            );
            return;
        }
        const pages = trackingMode === 'hizb' ? Math.round(value * PAGES_PER_HIZB) : value;
        logQuranReading(pages);
        setPagesInput('');
        Alert.alert(
            isArabic ? 'تم الحفظ' : 'Saved',
            isArabic ? `تم تسجيل ${pages} صفحة` : `Logged ${pages} pages`,
            [{ text: isArabic ? 'حسناً' : 'OK' }]
        );
    };

    const getWeeklyProgress = () => Math.min((weeklyPages / weeklyGoal) * 100, 100);

    // Render surah item
    const renderSurahItem = ({ item: surah }: { item: Surah }) => {
        const badgeColor = getSurahBadgeColor(surah.number);
        return (
            <TouchableOpacity
                style={[styles.surahItem, { borderBottomColor: theme.colors.border }]}
                activeOpacity={0.7}
                onPress={() => setSelectedSurah(surah)}
            >
                {/* Number Badge */}
                <View style={[styles.surahBadge, { backgroundColor: badgeColor + '18' }]}>
                    <Text style={[styles.surahBadgeText, { color: badgeColor }]}>
                        {surah.number}
                    </Text>
                </View>

                {/* Info */}
                <View style={styles.surahInfo}>
                    <Text style={[styles.surahName, { color: theme.colors.text }]}>
                        {surah.name} ({surah.englishName})
                    </Text>
                    <Text style={[styles.surahMeta, { color: theme.colors.textSecondary }]}>
                        {surah.revelationType}  •  {surah.versesCount} {isArabic ? 'آيات' : 'Verses'}
                    </Text>
                </View>

                {/* Arabic Name */}
                <Text style={[styles.surahArabicName, { color: theme.colors.text }]}>
                    {surah.nameArabic}
                </Text>
            </TouchableOpacity>
        );
    };

    // Browse Tabs
    const browseTabs: { key: BrowseTab; label: string }[] = [
        { key: 'surah', label: isArabic ? 'سورة' : 'Surah' },
        { key: 'page', label: isArabic ? 'صفحة' : 'Page' },
        { key: 'juz', label: isArabic ? 'جزء' : 'Juz' },
        { key: 'hizb', label: isArabic ? 'حزب' : 'Hizb' },
    ];

    // ── If a surah is selected → show reader overlay ──
    if (selectedSurah) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <SurahReader surah={selectedSurah} onBack={() => setSelectedSurah(null)} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {isArabic ? 'القرآن' : 'Quran'}
                </Text>

                {/* View Mode Toggle */}
                <View style={[styles.modeToggle, { backgroundColor: isDark ? theme.colors.surface : '#F0F0F0' }]}>
                    <TouchableOpacity
                        style={[styles.modeBtn, viewMode === 'browse' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setViewMode('browse')}
                    >
                        <MaterialCommunityIcons
                            name="book-open-variant"
                            size={16}
                            color={viewMode === 'browse' ? '#FFF' : theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeBtn, viewMode === 'track' && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setViewMode('track')}
                    >
                        <MaterialCommunityIcons
                            name="chart-bar"
                            size={16}
                            color={viewMode === 'track' ? '#FFF' : theme.colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {viewMode === 'browse' ? (
                <>
                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <View style={[styles.searchBar, {
                            backgroundColor: isDark ? theme.colors.surface : '#F5F5F5',
                            borderColor: isDark ? theme.colors.border : '#E5E5E5',
                        }]}>
                            <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.textSecondary} />
                            <TextInput
                                style={[styles.searchInput, { color: theme.colors.text }]}
                                placeholder={isArabic ? 'الفاتحة، الإخلاص...' : 'Al fatihah, Al ikhlas...'}
                                placeholderTextColor={theme.colors.textTertiary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Browse Tabs */}
                    <View style={styles.tabsContainer}>
                        {browseTabs.map(tab => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[
                                    styles.tab,
                                    browseTab === tab.key && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 },
                                ]}
                                onPress={() => setBrowseTab(tab.key)}
                            >
                                <Text style={[
                                    styles.tabText,
                                    {
                                        color: browseTab === tab.key ? theme.colors.primary : theme.colors.textSecondary,
                                        fontWeight: browseTab === tab.key ? '700' : '500',
                                    },
                                ]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Surah List */}
                    <FlatList
                        data={filteredSurahs}
                        renderItem={renderSurahItem}
                        keyExtractor={item => String(item.number)}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons name="book-search" size={48} color={theme.colors.textTertiary} />
                                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                                    {isArabic ? 'لم يتم العثور على نتائج' : 'No results found'}
                                </Text>
                            </View>
                        }
                    />
                </>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.trackContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Progress Card */}
                    <LinearGradient
                        colors={isDark
                            ? ['rgba(14,165,113,0.14)', 'rgba(14,165,113,0.04)']
                            : ['rgba(14,165,113,0.15)', 'rgba(14,165,113,0.04)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.progressCard, {
                            borderColor: isDark ? 'rgba(14,165,113,0.18)' : 'rgba(14,165,113,0.22)',
                        }]}
                    >
                        <View style={styles.progressHeader}>
                            <View style={[styles.progressIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                                <MaterialCommunityIcons name="book-open-page-variant" size={28} color={theme.colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                                    {isArabic ? 'الهدف الأسبوعي' : 'Weekly Goal'}
                                </Text>
                                <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                                    {formatNumber(weeklyPages, i18n.language)}/{formatNumber(weeklyGoal, i18n.language)} {t('quran.pages')}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1A2B1F' : '#E5E8E2' }]}>
                            <View style={[styles.progressFill, {
                                width: `${getWeeklyProgress()}%`,
                                backgroundColor: theme.colors.primary,
                            }]} />
                        </View>
                    </LinearGradient>

                    {/* Today's Reading */}
                    <View style={[styles.trackCard, {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.cardBorder,
                    }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'قراءة اليوم' : "Today's Reading"}
                        </Text>
                        {todayLog ? (
                            <View style={styles.todayStats}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                                        {formatNumber(todayLog.pages, i18n.language)}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                        {t('quran.pages')}
                                    </Text>
                                </View>
                                {todayLog.minutes && (
                                    <View style={styles.statItem}>
                                        <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                                            {formatNumber(todayLog.minutes, i18n.language)}
                                        </Text>
                                        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                            {isArabic ? 'دقيقة' : 'min'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={styles.emptyToday}>
                                <MaterialCommunityIcons name="book-open-outline" size={32} color={theme.colors.textTertiary} />
                                <Text style={[{ color: theme.colors.textTertiary, fontSize: 14 }]}>
                                    {isArabic ? 'لم تسجل قراءة اليوم بعد' : 'No reading logged today yet'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Quick Log */}
                    <View style={[styles.trackCard, {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.cardBorder,
                    }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'تسجيل القراءة' : 'Log Reading'}
                        </Text>

                        {/* Mode toggle */}
                        <View style={[styles.logModeToggle, { backgroundColor: isDark ? '#1A2B1F' : '#F0F2EE' }]}>
                            <TouchableOpacity
                                style={[styles.logModeBtn, trackingMode === 'pages' && { backgroundColor: theme.colors.primary }]}
                                onPress={() => setTrackingMode('pages')}
                            >
                                <Text style={{
                                    color: trackingMode === 'pages' ? '#FFF' : theme.colors.textSecondary,
                                    fontWeight: '600', fontSize: 14,
                                }}>
                                    {t('quran.pages')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.logModeBtn, trackingMode === 'hizb' && { backgroundColor: theme.colors.primary }]}
                                onPress={() => setTrackingMode('hizb')}
                            >
                                <Text style={{
                                    color: trackingMode === 'hizb' ? '#FFF' : theme.colors.textSecondary,
                                    fontWeight: '600', fontSize: 14,
                                }}>
                                    {isArabic ? 'حزب' : 'Hizb'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Quick buttons */}
                        <View style={styles.quickRow}>
                            {[1, 2, 5, 10].map(num => (
                                <TouchableOpacity
                                    key={num}
                                    style={[styles.quickBtn, {
                                        backgroundColor: pagesInput === String(num) ? theme.colors.primary : 'transparent',
                                        borderColor: pagesInput === String(num) ? theme.colors.primary : theme.colors.border,
                                    }]}
                                    onPress={() => setPagesInput(String(num))}
                                >
                                    <Text style={{
                                        color: pagesInput === String(num) ? '#FFF' : theme.colors.primary,
                                        fontWeight: '600', fontSize: 15,
                                    }}>
                                        +{num}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Input */}
                        <TextInput
                            style={[styles.logInput, {
                                backgroundColor: isDark ? '#1A2B1F' : '#F5F5F5',
                                color: theme.colors.text,
                                borderColor: pagesInput ? theme.colors.primary : theme.colors.border,
                            }]}
                            value={pagesInput}
                            onChangeText={setPagesInput}
                            keyboardType="number-pad"
                            placeholder={isArabic ? 'أدخل العدد' : 'Enter amount'}
                            placeholderTextColor={theme.colors.textTertiary}
                        />

                        {/* Log button */}
                        <TouchableOpacity
                            style={[styles.logButton, {
                                backgroundColor: pagesInput ? theme.colors.primary : theme.colors.border,
                                opacity: pagesInput ? 1 : 0.5,
                            }]}
                            onPress={handleLogReading}
                            disabled={!pagesInput}
                        >
                            <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
                            <Text style={[styles.logButtonText, { color: '#FFF' }]}>
                                {isArabic ? 'تسجيل' : 'Log Reading'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
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
        paddingVertical: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
    },
    modeToggle: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 3,
        gap: 2,
    },
    modeBtn: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
        alignItems: 'center',
    },
    // Search
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 11,
        borderRadius: 14,
        borderWidth: 1,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 4,
        gap: 8,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontSize: 15,
    },
    // Surah List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    surahItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        gap: 14,
    },
    surahBadge: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    surahBadgeText: {
        fontSize: 15,
        fontWeight: '700',
    },
    surahInfo: {
        flex: 1,
        gap: 3,
    },
    surahName: {
        fontSize: 15,
        fontWeight: '600',
    },
    surahMeta: {
        fontSize: 12,
    },
    surahArabicName: {
        fontSize: 22,
        fontFamily: 'Amiri',
    },
    // Track mode
    scrollView: {
        flex: 1,
    },
    trackContent: {
        padding: 16,
        gap: 16,
    },
    progressCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    progressIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
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
    trackCard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    todayStats: {
        flexDirection: 'row',
        gap: 32,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    emptyToday: {
        alignItems: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    logModeToggle: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        gap: 4,
    },
    logModeBtn: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 9,
        alignItems: 'center',
    },
    quickRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    quickBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1.5,
    },
    logInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
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
        fontWeight: '700',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 15,
    },
});

// ─── Surah Reader Styles ─────────────────────────────────────────────────────
const readerStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        gap: 10,
    },
    backBtn: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    headerSub: {
        fontSize: 12,
        marginTop: 2,
    },
    themeToggle: {
        flexDirection: 'row',
        borderRadius: 10,
        padding: 3,
        gap: 2,
    },
    themeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        paddingHorizontal: 32,
    },
    loadingText: {
        fontSize: 15,
        textAlign: 'center',
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    bismillah: {
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 8,
    },
    bismillahText: {
        fontSize: 26,
        textAlign: 'center',
        lineHeight: 44,
    },
    ayahCard: {
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
    },
    ayahHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    ayahBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    ayahBadgeText: {
        fontSize: 13,
        fontWeight: '700',
    },
    ayahActions: {
        flexDirection: 'row',
        gap: 6,
    },
    actionIcon: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arabicText: {
        fontSize: 24,
        lineHeight: 44,
        textAlign: 'right',
        fontFamily: 'Amiri',
        marginBottom: 14,
        writingDirection: 'rtl',
    },
    translationText: {
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },
});

export default QuranScreen;
