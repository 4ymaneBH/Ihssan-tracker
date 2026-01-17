// Adhkar Screen - Horizontal carousel with category tabs
import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context';
import { useHabitsStore } from '../store';
import { getAdhkarByCategory, Dhikr, AdhkarCategory, adhkarCategories } from '../data/adhkarContent';
import { getDateString } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48; // 24px margin each side
const CARD_MARGIN = 8;

// Single Dhikr Card Component
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
    const { theme } = useTheme();
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
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={handleTap}
            disabled={isDone}
            style={[
                styles.dhikrCard,
                {
                    width: CARD_WIDTH,
                    backgroundColor: isDone
                        ? theme.colors.success.light
                        : theme.colors.surface,
                    borderColor: isDone
                        ? theme.colors.success.main
                        : theme.colors.cardBorder,
                    shadowColor: theme.colors.text,
                },
            ]}
        >
            {/* Card number and counter */}
            <View style={styles.cardHeader}>
                <View
                    style={[
                        styles.indexBadge,
                        { backgroundColor: theme.colors.primary + '15' },
                    ]}
                >
                    <Text style={[styles.indexText, { color: theme.colors.primary }]}>
                        {index + 1}/{total}
                    </Text>
                </View>
                <View style={styles.repeatInfo}>
                    <Text style={[styles.countText, { color: theme.colors.text }]}>
                        {currentCount}/{dhikr.repeatCount}
                    </Text>
                    {isDone && (
                        <MaterialCommunityIcons
                            name="check-circle"
                            size={22}
                            color={theme.colors.success.main}
                        />
                    )}
                </View>
            </View>

            {/* Arabic Text */}
            <Text
                style={[
                    styles.arabicText,
                    {
                        color: theme.colors.text,
                        textAlign: 'right',
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
                <View style={styles.referenceRow}>
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

            {/* Progress bar */}
            <View
                style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}
            >
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${progress}%`,
                            backgroundColor: isDone
                                ? theme.colors.success.main
                                : theme.colors.primary,
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
    );
};

// Main Adhkar Screen
interface AdhkarScreenProps {
    route?: {
        params?: {
            category?: AdhkarCategory;
        };
    };
}

const AdhkarScreen: React.FC<AdhkarScreenProps> = ({ route }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { logAdhkar } = useHabitsStore();
    const flatListRef = useRef<FlatList>(null);

    const initialCategory = route?.params?.category || 'morning';
    const [activeCategory, setActiveCategory] = useState<AdhkarCategory>(initialCategory);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

    const adhkarList = getAdhkarByCategory(activeCategory);
    const today = getDateString(new Date());
    const isArabic = i18n.language === 'ar';

    const handleComplete = useCallback((dhikrId: string) => {
        setCompletedIds((prev) => new Set([...prev, dhikrId]));
    }, []);

    const handleCategoryChange = (category: AdhkarCategory) => {
        setActiveCategory(category);
        setCompletedIds(new Set()); // Reset completed when switching categories
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
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

    const renderItem = ({ item, index }: { item: Dhikr; index: number }) => (
        <DhikrCard
            dhikr={item}
            index={index}
            total={adhkarList.length}
            onComplete={() => handleComplete(item.id)}
        />
    );

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
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

            {/* Category Tabs */}
            <View style={[styles.tabsContainer, { borderBottomColor: theme.colors.divider }]}>
                {adhkarCategories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.tab,
                            activeCategory === category && {
                                backgroundColor: theme.colors.primaryLight,
                                borderColor: theme.colors.primary,
                            },
                        ]}
                        onPress={() => handleCategoryChange(category)}
                    >
                        <MaterialCommunityIcons
                            name={getCategoryIcon(category)}
                            size={20}
                            color={
                                activeCategory === category
                                    ? theme.colors.primary
                                    : theme.colors.textSecondary
                            }
                        />
                        <Text
                            style={[
                                styles.tabText,
                                {
                                    color:
                                        activeCategory === category
                                            ? theme.colors.primary
                                            : theme.colors.textSecondary,
                                },
                            ]}
                        >
                            {getCategoryLabel(category)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Horizontal Carousel */}
            <FlatList
                ref={flatListRef}
                data={adhkarList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
            />

            {/* Completion message */}
            {isAllComplete && (
                <View
                    style={[
                        styles.completionBanner,
                        { backgroundColor: theme.colors.success.light },
                    ]}
                >
                    <MaterialCommunityIcons
                        name="check-decagram"
                        size={24}
                        color={theme.colors.success.main}
                    />
                    <Text
                        style={[styles.completionText, { color: theme.colors.success.dark }]}
                    >
                        {isArabic ? 'ما شاء الله! تم إتمام جميع الأذكار' : 'Masha Allah! All adhkar completed'}
                    </Text>
                </View>
            )}

            {/* Swipe hint */}
            {!isAllComplete && (
                <View style={styles.swipeHint}>
                    <MaterialCommunityIcons
                        name="gesture-swipe-horizontal"
                        size={20}
                        color={theme.colors.textTertiary}
                    />
                    <Text style={[styles.swipeHintText, { color: theme.colors.textTertiary }]}>
                        {isArabic ? 'اسحب للتنقل' : 'Swipe to navigate'}
                    </Text>
                </View>
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
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    progressBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    progressText: {
        fontSize: 13,
        fontWeight: '600',
    },
    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    // Carousel
    carouselContent: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        alignItems: 'flex-start',
    },
    // Card
    dhikrCard: {
        marginHorizontal: CARD_MARGIN,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        // Shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    indexBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    indexText: {
        fontSize: 13,
        fontWeight: '600',
    },
    repeatInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countText: {
        fontSize: 16,
        fontWeight: '700',
    },
    arabicText: {
        fontSize: 22,
        lineHeight: 42,
        fontFamily: 'System',
        marginBottom: 16,
    },
    transliterationText: {
        fontSize: 15,
        fontStyle: 'italic',
        marginBottom: 12,
        lineHeight: 24,
    },
    translationText: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 12,
    },
    referenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    referenceText: {
        fontSize: 12,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    tapHint: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 12,
    },
    // Completion
    completionBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingVertical: 14,
        borderRadius: 14,
    },
    completionText: {
        fontSize: 15,
        fontWeight: '600',
    },
    // Swipe hint
    swipeHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingBottom: 16,
    },
    swipeHintText: {
        fontSize: 13,
    },
});

export default AdhkarScreen;
