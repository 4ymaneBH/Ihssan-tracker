// Adhkar Screen - Premium Qur'an-like reading experience
import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import { useTheme } from '../context';
import { useHabitsStore } from '../store';
import { getAdhkarByCategory, Dhikr, AdhkarCategory, adhkarCategories } from '../data/adhkarContent';
import { getDateString } from '../utils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ========================================
// Single Dhikr Card Component
// ========================================
interface DhikrCardProps {
    dhikr: Dhikr;
    index: number;
    total: number;
    onComplete: () => void;
}

const DhikrCard: React.FC<DhikrCardProps> = ({
    dhikr,
    index,
    total,
    onComplete,
}) => {
    const { theme, isDark } = useTheme();
    const { i18n } = useTranslation();
    const [currentCount, setCurrentCount] = useState(0);
    const isArabic = i18n.language === 'ar';

    const handleTap = useCallback(() => {
        if (currentCount < dhikr.repeatCount) {
            const newCount = currentCount + 1;
            setCurrentCount(newCount);
            if (newCount === dhikr.repeatCount) {
                onComplete();
            }
        }
    }, [currentCount, dhikr.repeatCount, onComplete]);

    const progress = (currentCount / dhikr.repeatCount) * 100;
    const isDone = currentCount >= dhikr.repeatCount;

    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity
                activeOpacity={0.98}
                onPress={handleTap}
                disabled={isDone}
                style={[
                    styles.dhikrCard,
                    {
                        backgroundColor: isDark
                            ? (isDone ? theme.colors.surface : theme.colors.surface)
                            : (isDone ? theme.colors.success.light : theme.colors.surface),
                        borderColor: isDone ? theme.colors.success.main : (isDark ? theme.colors.border : theme.colors.cardBorder),
                        borderWidth: isDone ? 2 : 1,
                    },
                ]}
            >
                {/* Card Header - Index and Counter */}
                <View style={styles.cardHeader}>
                    <View style={[styles.indexBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                        <Text style={[styles.indexText, { color: theme.colors.primary }]}>
                            {index + 1}/{total}
                        </Text>
                    </View>
                    <View style={styles.repeatInfo}>
                        <Text style={[styles.countText, { color: isDone ? theme.colors.success.main : theme.colors.text }]}>
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

                {/* Card Content */}
                <View style={styles.cardScrollInner}>
                    {/* Arabic Text - Qur'an-like styling */}
                    <Text
                        style={[
                            styles.arabicText,
                            { color: theme.colors.text },
                        ]}
                    >
                        {dhikr.arabic}
                    </Text>

                    {/* Transliteration */}
                    <Text
                        style={[
                            styles.transliterationText,
                            { color: theme.colors.textSecondary },
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
                            <Text style={[styles.referenceText, { color: theme.colors.textTertiary }]}>
                                {dhikr.reference}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Progress bar - fixed at bottom */}
                <View style={[styles.progressTrack, { backgroundColor: isDark ? theme.colors.border : theme.colors.borderLight }]}>
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
                    <Text style={[styles.tapHint, { color: theme.colors.textTertiary }]}>
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
    const pagerRef = useRef<PagerView>(null);

    const initialCategory = route?.params?.category || 'morning';
    const [activeCategory, setActiveCategory] = useState<AdhkarCategory>(initialCategory);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(0);

    const adhkarList = getAdhkarByCategory(activeCategory);
    const today = getDateString(new Date());
    const isArabic = i18n.language === 'ar';

    const handleComplete = useCallback((dhikrId: string) => {
        setCompletedIds((prev) => new Set([...prev, dhikrId]));
    }, []);

    const handleCategoryChange = (category: AdhkarCategory) => {
        setActiveCategory(category);
        setCompletedIds(new Set());
        setCurrentPage(0);
        pagerRef.current?.setPage(0);
    };

    const completedCount = completedIds.size;
    const totalCount = adhkarList.length;
    const isAllComplete = completedCount === totalCount;

    // Log to store when all complete
    React.useEffect(() => {
        if (isAllComplete && (activeCategory === 'morning' || activeCategory === 'evening')) {
            logAdhkar(today, activeCategory, totalCount, totalCount);
        }
    }, [isAllComplete, today, activeCategory, totalCount, logAdhkar]);

    const getCategoryIcon = (category: AdhkarCategory) => {
        switch (category) {
            case 'morning': return 'weather-sunny';
            case 'evening': return 'weather-night';
            case 'general': return 'hands-pray';
        }
    };

    const getCategoryLabel = (category: AdhkarCategory) => {
        switch (category) {
            case 'morning': return isArabic ? 'الصباح' : 'Morning';
            case 'evening': return isArabic ? 'المساء' : 'Evening';
            case 'general': return isArabic ? 'عامة' : 'General';
        }
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            edges={['top', 'left', 'right']}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: isDark ? theme.colors.surface : 'transparent' }]}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
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
                    <Text style={[styles.progressText, { color: theme.colors.onPrimary }]}>
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
                                    { color: isActive ? theme.colors.primary : theme.colors.textSecondary },
                                ]}
                            >
                                {getCategoryLabel(category)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Page View - Swipeable Cards */}
            <PagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {adhkarList.map((dhikr, index) => (
                    <View key={dhikr.id} style={styles.pageContainer}>
                        <DhikrCard
                            dhikr={dhikr}
                            index={index}
                            total={adhkarList.length}
                            onComplete={() => handleComplete(dhikr.id)}
                        />
                    </View>
                ))}
            </PagerView>

            {/* Page Indicator Dots */}
            <View style={styles.dotsContainer}>
                {adhkarList.length <= 15 && adhkarList.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: currentPage === index
                                    ? theme.colors.primary
                                    : theme.colors.border,
                                width: currentPage === index ? 20 : 6,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Bottom Safe Area with Swipe Hint */}
            <SafeAreaView edges={['bottom']} style={[styles.bottomArea, { backgroundColor: theme.colors.background }]}>
                {!isAllComplete ? (
                    <View style={styles.swipeHint}>
                        <MaterialCommunityIcons
                            name="gesture-swipe-horizontal"
                            size={18}
                            color={theme.colors.textTertiary}
                        />
                        <Text style={[styles.swipeHintText, { color: theme.colors.textTertiary }]}>
                            {isArabic ? 'اسحب للتنقل' : 'Swipe to navigate'}
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.completionBanner, { backgroundColor: theme.colors.success.main + '20' }]}>
                        <MaterialCommunityIcons
                            name="check-decagram"
                            size={20}
                            color={theme.colors.success.main}
                        />
                        <Text style={[styles.completionText, { color: theme.colors.success.dark }]}>
                            {isArabic ? 'ما شاء الله! تم إتمام جميع الأذكار' : 'All adhkar completed!'}
                        </Text>
                    </View>
                )}
            </SafeAreaView>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    progressBadge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
    },
    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 10,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    // Pager
    pagerView: {
        flex: 1,
    },
    pageContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    // Card
    cardWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    dhikrCard: {
        borderRadius: 24,
        padding: 20,
        maxHeight: SCREEN_HEIGHT * 0.65,
        // Subtle shadow for light mode
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    indexBadge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    indexText: {
        fontSize: 14,
        fontWeight: '700',
    },
    repeatInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countText: {
        fontSize: 18,
        fontWeight: '700',
    },
    // Scrollable content
    cardScrollContent: {
        maxHeight: 350,
    },
    cardScrollInner: {
        flexGrow: 1,
        paddingBottom: 16,
    },
    // Arabic text - Qur'an-like style with Amiri font
    arabicText: {
        fontSize: 26,
        lineHeight: 52,
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: 24,
        // Amiri font for authentic Qur'an reading experience
        fontFamily: 'Amiri_400Regular',
    },
    // Transliteration
    transliterationText: {
        fontSize: 15,
        fontStyle: 'italic',
        lineHeight: 24,
        marginBottom: 16,
        textAlign: 'left',
    },
    // Translation
    translationText: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 16,
    },
    // Reference
    referenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingTop: 16,
        marginTop: 8,
        borderTopWidth: 1,
    },
    referenceText: {
        fontSize: 13,
        fontWeight: '500',
    },
    // Progress
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 16,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    tapHint: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 14,
        fontWeight: '500',
    },
    // Dots indicator
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    // Bottom area
    bottomArea: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    swipeHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    swipeHintText: {
        fontSize: 14,
        fontWeight: '500',
    },
    completionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
    },
    completionText: {
        fontSize: 15,
        fontWeight: '600',
    },
});

export default AdhkarScreen;
