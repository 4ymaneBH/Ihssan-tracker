// Adhkar Screen - Premium Qur'an-like reading experience
import React, { useState, useCallback, useRef } from 'react';
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
import PagerView from 'react-native-pager-view';
import { useTheme } from '../context';
import { useHabitsStore } from '../store';
import { getAdhkarByCategory, Dhikr, AdhkarCategory, adhkarCategories } from '../data/adhkarContent';
import { getDateString, getFontFamily } from '../utils';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ========================================
// Single Dhikr Card Component
// ========================================
interface DhikrCardProps {
    dhikr: Dhikr;
    index: number;
    total: number;
    category: AdhkarCategory;
    onComplete: () => void;
}

const DhikrCard: React.FC<DhikrCardProps> = ({
    dhikr,
    index,
    total,
    category,
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
            <View
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

                {/* Scrollable Card Content */}
                <ScrollView
                    style={styles.cardScrollContent}
                    contentContainerStyle={styles.cardScrollInner}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                >
                    <TouchableOpacity
                        activeOpacity={0.98}
                        onPress={handleTap}
                        disabled={isDone}
                    >
                        {/* Arabic Text - Qur'an-like styling */}
                        <Text
                            style={[
                                styles.arabicText,
                                {
                                    color: theme.colors.text,
                                    fontSize: category === 'general' ? 34 : 20,
                                    lineHeight: category === 'general' ? 74 : 45,
                                },
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
                    </TouchableOpacity>
                </ScrollView>

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
            </View>
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
                            category={activeCategory}
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
                                width: currentPage === index ? 24 : 8,
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
        paddingBottom: 16,
        gap: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
    },
    // Pager
    pagerView: {
        flex: 1,
    },
    pageContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'center',
    },
    // Card
    cardWrapper: {
        flex: 1,
        justifyContent: 'center',
        marginVertical: 10,
    },
    dhikrCard: {
        borderRadius: 32,
        padding: 24,
        maxHeight: SCREEN_HEIGHT * 0.70, // Slightly reduced to ensure fits on screen with dots
        flexGrow: 1,
        // Premium shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    indexBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    indexText: {
        fontSize: 14,
        fontWeight: '700',
        opacity: 0.8,
    },
    repeatInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.05)', // Subtle background
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    countText: {
        fontSize: 16,
        fontWeight: '700',
    },
    // Scrollable content
    cardScrollContent: {
        flex: 1,
    },
    cardScrollInner: {
        paddingBottom: 20,
        flexGrow: 1,
        justifyContent: 'center', // Center content if short
    },
    // Arabic text - Qur'an-like style with Amiri font
    arabicText: {
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: 32,
        // Amiri font for authentic Qur'an reading experience
        fontFamily: 'Amiri_400Regular',
    },
    // Transliteration
    transliterationText: {
        fontSize: 16,
        fontStyle: 'italic',
        lineHeight: 26,
        marginBottom: 20,
        textAlign: 'left',
        opacity: 0.9,
    },
    // Translation
    translationText: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 20,
        opacity: 0.9,
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
        fontSize: 13,
        fontWeight: '500',
    },
    // Progress
    progressTrack: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 20,
        marginBottom: 12,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    tapHint: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '600',
        paddingVertical: 8,
        opacity: 0.8,
    },
    // Dots indicator
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    dot: {
        height: 8, // Increased from 6
        borderRadius: 4,
    },
    // Bottom area
    bottomArea: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    swipeHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        opacity: 0.7,
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
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 10,
    },
    completionText: {
        fontSize: 16,
        fontWeight: '700',
    },
});

export default AdhkarScreen;
