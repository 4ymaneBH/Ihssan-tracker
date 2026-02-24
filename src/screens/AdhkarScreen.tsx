// Adhkar Screen - Premium Scrollable List Experience
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context';
import { useHabitsStore } from '../store';
import { getAdhkarByCategory, Dhikr, AdhkarCategory, adhkarCategories } from '../data/adhkarContent';
import { getDateString, getFontFamily } from '../utils';
import { useAdhkarProgress } from '../utils/useAdhkarProgress';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ========================================
// Single Dhikr List Item Component
// ========================================
interface DhikrCardProps {
    dhikr: Dhikr;
    index: number;
    total: number;
    category: AdhkarCategory;
    initialCount?: number;
    onComplete: () => void;
    onCountChange?: (dhikrId: string, count: number) => void;
}

const DhikrCard: React.FC<DhikrCardProps> = ({
    dhikr,
    index,
    total,
    category,
    initialCount = 0,
    onComplete,
    onCountChange,
}) => {
    const { theme, isDark } = useTheme();
    const { i18n } = useTranslation();
    const [currentCount, setCurrentCount] = useState(initialCount);
    const isArabic = i18n.language === 'ar';

    const handleTap = useCallback(() => {
        if (currentCount < dhikr.repeatCount) {
            const newCount = currentCount + 1;
            setCurrentCount(newCount);
            onCountChange?.(dhikr.id, newCount);
            if (newCount === dhikr.repeatCount) {
                // Heavy feedback on completion
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onComplete();
            } else {
                // Light tap feedback on each count
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        }
    }, [currentCount, dhikr.repeatCount, dhikr.id, onComplete, onCountChange]);

    const progress = (currentCount / dhikr.repeatCount) * 100;
    const isDone = currentCount >= dhikr.repeatCount;

    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity
                style={[
                    styles.dhikrCard,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: isDark ? theme.colors.border : theme.colors.cardBorder,
                    },
                ]}
                activeOpacity={0.98}
                onPress={handleTap}
                disabled={isDone}
            >
                {/* Card Header - Index and Counter */}
                <View style={styles.cardHeader}>
                    <View style={[styles.indexBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                        <Text style={[styles.indexText, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {index + 1}/{total}
                        </Text>
                    </View>
                    <View style={[styles.repeatInfo, { backgroundColor: isDone ? theme.colors.success.light : 'rgba(0,0,0,0.05)' }]}>
                        <Text style={[styles.countText, { color: isDone ? theme.colors.success.main : theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {currentCount}/{dhikr.repeatCount}
                        </Text>
                        {isDone && (
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={20}
                                color={theme.colors.success.main}
                            />
                        )}
                    </View>
                </View>

                {/* Arabic Text - Qur'an-like styling */}
                <Text
                    style={[
                        styles.arabicText,
                        {
                            color: theme.colors.text,
                            fontSize: category === 'general' ? 28 : 22,
                            lineHeight: category === 'general' ? 52 : 40,
                        },
                    ]}
                >
                    {dhikr.arabic}
                </Text>

                {/* Transliteration */}
                <Text
                    style={[
                        styles.transliterationText,
                        { color: theme.colors.textSecondary, fontFamily: getFontFamily(false, 'regular') },
                    ]}
                >
                    {dhikr.transliteration}
                </Text>

                {/* Translation */}
                <Text
                    style={[
                        styles.translationText,
                        {
                            color: theme.colors.textSecondary,
                            textAlign: isArabic ? 'right' : 'left',
                            fontFamily: getFontFamily(isArabic, 'regular'),
                        },
                    ]}
                >
                    {dhikr.translation}
                </Text>

                {/* Reference */}
                {dhikr.reference && (
                    <View style={[styles.referenceRow, { borderTopColor: theme.colors.border }]}>
                        <MaterialCommunityIcons
                            name="book-open-variant"
                            size={14}
                            color={theme.colors.textTertiary}
                        />
                        <Text style={[styles.referenceText, { color: theme.colors.textTertiary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                            {dhikr.reference}
                        </Text>
                    </View>
                )}

                {/* Progress bar */}
                <View style={[styles.progressTrack, { backgroundColor: isDark ? theme.colors.border : '#E8F5F3' }]}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progress}%`,
                                backgroundColor: isDone ? theme.colors.success.main : theme.colors.primary,
                            },
                        ]}
                    />
                </View>

                {/* Tap hint */}
                {!isDone && (
                    <Text style={[styles.tapHint, { color: theme.colors.textTertiary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                        {isArabic ? 'اضغط للعد' : 'Tap to count'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};


// ========================================
// Main Adhkar Screen
// ========================================
interface AdhkarScreenProps {
    route?: {
        params?: {
            category?: AdhkarCategory;
        };
    };
}

const AdhkarScreen: React.FC<AdhkarScreenProps> = ({ route }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const { logAdhkar } = useHabitsStore();

    const initialCategory = route?.params?.category || 'morning';
    const [activeCategory, setActiveCategory] = useState<AdhkarCategory>(initialCategory);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const { counts, setCount, clearProgress, isLoaded } = useAdhkarProgress(activeCategory);

    const adhkarList = getAdhkarByCategory(activeCategory);
    const today = getDateString(new Date());
    const isArabic = i18n.language === 'ar';

    // Re-derive completedIds from persisted counts after loading
    React.useEffect(() => {
        if (!isLoaded) return;
        const completed = new Set<string>();
        for (const dhikr of adhkarList) {
            if ((counts[dhikr.id] ?? 0) >= dhikr.repeatCount) {
                completed.add(dhikr.id);
            }
        }
        setCompletedIds(completed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, activeCategory]);

    const handleComplete = useCallback((dhikrId: string) => {
        setCompletedIds((prev) => new Set([...prev, dhikrId]));
    }, []);

    const handleCategoryChange = (category: AdhkarCategory) => {
        setActiveCategory(category);
        setCompletedIds(new Set());
        // Note: clearProgress is NOT called here — we preserve progress per-category
    };

    const completedCount = completedIds.size;
    const totalCount = adhkarList.length;
    const isAllComplete = completedCount === totalCount;

    // Log to store when all complete
    React.useEffect(() => {
        if (isAllComplete) {
            logAdhkar(today, activeCategory, totalCount, totalCount);
        }
    }, [isAllComplete, today, activeCategory, totalCount, logAdhkar]);

    const getCategoryIcon = (category: AdhkarCategory) => {
        switch (category) {
            case 'morning': return 'weather-sunny';
            case 'evening': return 'weather-night';
            case 'sleep': return 'bed';
            case 'general': return 'hands-pray';
        }
    };

    const getCategoryLabel = (category: AdhkarCategory) => {
        switch (category) {
            case 'morning': return isArabic ? 'الصباح' : 'Morning';
            case 'evening': return isArabic ? 'المساء' : 'Evening';
            case 'sleep': return isArabic ? 'النّوم' : 'Sleep';
            case 'general': return isArabic ? 'عامة' : 'General';
        }
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
            edges={['top', 'left', 'right']}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: isDark ? theme.colors.surface : 'transparent' }]}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name={isArabic ? "arrow-right" : "arrow-left"}
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
                <Text style={[
                    styles.headerTitle,
                    { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }
                ]}>
                    {t('adhkar.title')}
                </Text>
                <View
                    style={[
                        styles.progressBadge,
                        {
                            backgroundColor: isAllComplete
                                ? theme.colors.success.main
                                : theme.colors.primary,
                        },
                    ]}
                >
                    <Text style={[styles.progressText, { color: theme.colors.onPrimary, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                        {completedCount}/{totalCount}
                    </Text>
                </View>
            </View>

            {/* Category Tabs - Clean RTL-aligned */}
            <View style={[styles.tabsContainer, { borderBottomColor: theme.colors.divider }]}>
                {adhkarCategories.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.tab,
                                isActive && {
                                    backgroundColor: theme.colors.primaryLight,
                                    borderColor: theme.colors.primary,
                                },
                            ]}
                            onPress={() => handleCategoryChange(category)}
                        >
                            <MaterialCommunityIcons
                                name={getCategoryIcon(category)}
                                size={18}
                                color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    {
                                        color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                                        fontFamily: getFontFamily(isArabic, 'semiBold')
                                    },
                                ]}
                            >
                                {getCategoryLabel(category)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Scrollable List of All Adhkar */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                {adhkarList.map((dhikr, index) => (
                    <DhikrCard
                        key={dhikr.id}
                        dhikr={dhikr}
                        index={index}
                        total={adhkarList.length}
                        category={activeCategory}
                        initialCount={counts[dhikr.id] ?? 0}
                        onComplete={() => handleComplete(dhikr.id)}
                        onCountChange={setCount}
                    />
                ))}

                {/* Completion Banner */}
                {isAllComplete && (
                    <View style={[styles.completionBanner, { backgroundColor: theme.colors.success.main + '20' }]}>
                        <MaterialCommunityIcons
                            name="check-decagram"
                            size={24}
                            color={theme.colors.success.main}
                        />
                        <Text style={[styles.completionText, { color: theme.colors.success.dark, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {isArabic ? 'ما شاء الله! تم إتمام جميع الأذكار' : 'All adhkar completed!'}
                        </Text>
                    </View>
                )}
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
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
    },
    progressBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 15,
        fontWeight: '700',
    },
    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    // ScrollView
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 24,
    },
    // Card
    cardWrapper: {
        marginBottom: 16,
    },
    dhikrCard: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        // Premium shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    indexBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    indexText: {
        fontSize: 13,
        fontWeight: '700',
        opacity: 0.8,
    },
    repeatInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    countText: {
        fontSize: 15,
        fontWeight: '700',
    },
    // Arabic text - Qur'an-like style with Amiri font
    arabicText: {
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: 20,
        // Amiri font for authentic Qur'an reading experience
        fontFamily: 'Amiri_400Regular',
    },
    // Transliteration
    transliterationText: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 22,
        marginBottom: 16,
        textAlign: 'left',
        opacity: 0.85,
    },
    // Translation
    translationText: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
        opacity: 0.85,
    },
    // Reference
    referenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 16,
        marginTop: 8,
        borderTopWidth: 1,
        opacity: 0.7,
    },
    referenceText: {
        fontSize: 12,
        fontWeight: '500',
    },
    // Progress
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 18,
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    tapHint: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600',
        paddingVertical: 6,
        opacity: 0.7,
    },
    // Completion banner
    completionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 8,
        marginBottom: 16,
    },
    completionText: {
        fontSize: 16,
        fontWeight: '700',
    },
});

export default AdhkarScreen;
