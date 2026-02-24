// Du'a Screen - Collection of supplications with category cards
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Share,
    Dimensions,
    Image,
    ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context';
import { logger } from '../utils';
import {
    duaCollection,
    duaCategories,
    getDuasByCategory,
    searchDuas,
    getCategoryLabel,
    getCategoryIcon,
    Dua,
    DuaCategory,
} from '../data/duaContent';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Category card colors and icons - improved contrast for light mode
const categoryStyles: Record<DuaCategory, { bgColor: string; accentColor: string; icon: string }> = {
    daily: { bgColor: '#FDE68A', accentColor: '#B45309', icon: 'calendar-today' },
    morning_evening: { bgColor: '#BAE6FD', accentColor: '#0369A1', icon: 'weather-sunset' },
    prayer: { bgColor: '#A7F3D0', accentColor: '#047857', icon: 'mosque' },
    travel: { bgColor: '#DDD6FE', accentColor: '#6D28D9', icon: 'airplane' },
    food: { bgColor: '#FED7AA', accentColor: '#C2410C', icon: 'food-apple' },
    protection: { bgColor: '#A7F3D0', accentColor: '#047857', icon: 'shield-check' },
    forgiveness: { bgColor: '#FBCFE8', accentColor: '#BE185D', icon: 'heart' },
    gratitude: { bgColor: '#FDE047', accentColor: '#A16207', icon: 'hand-heart' },
    anxiety: { bgColor: '#BAE6FD', accentColor: '#0369A1', icon: 'meditation' },
    sleep: { bgColor: '#C4B5FD', accentColor: '#5B21B6', icon: 'bed' },
};

// Category illustrations
const categoryImages: Record<DuaCategory, ImageSourcePropType> = {
    daily: require('../../assets/illustrations/dua_daily.png'),
    morning_evening: require('../../assets/illustrations/dua_morning_evening.png'),
    prayer: require('../../assets/illustrations/dua_prayer.png'),
    travel: require('../../assets/illustrations/dua_travel.png'),
    food: require('../../assets/illustrations/dua_food.png'),
    protection: require('../../assets/illustrations/dua_protection.png'),
    forgiveness: require('../../assets/illustrations/dua_forgiveness.png'),
    gratitude: require('../../assets/illustrations/dua_gratitude.png'),
    anxiety: require('../../assets/illustrations/dua_anxiety.png'),
    sleep: require('../../assets/illustrations/dua_sleep.png'),
};

const DuaScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const isArabic = i18n.language === 'ar';

    const [selectedCategory, setSelectedCategory] = useState<DuaCategory | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [expandedDua, setExpandedDua] = useState<string | null>(null);

    // Filter du'as based on selected category
    const filteredDuas = useMemo(() => {
        if (!selectedCategory) return [];

        let result = getDuasByCategory(selectedCategory);

        if (searchQuery.trim()) {
            result = searchDuas(searchQuery, isArabic).filter(d => d.category === selectedCategory);
        }

        return result;
    }, [selectedCategory, searchQuery, isArabic]);

    const toggleFavorite = (duaId: string) => {
        setFavorites(prev =>
            prev.includes(duaId)
                ? prev.filter(id => id !== duaId)
                : [...prev, duaId]
        );
    };

    const handleShare = async (dua: Dua) => {
        try {
            const message = isArabic
                ? `${dua.arabic}\n\n${dua.translationAr}\n\n— ${dua.reference}`
                : `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n— ${dua.reference}`;

            await Share.share({ message });
        } catch (error) {
            logger.error('Share error:', error);
        }
    };

    const toggleExpand = (duaId: string) => {
        setExpandedDua(prev => prev === duaId ? null : duaId);
    };

    const handleCategoryPress = (category: DuaCategory) => {
        setSelectedCategory(category);
        setExpandedDua(null);
    };

    const handleBack = () => {
        if (selectedCategory) {
            setSelectedCategory(null);
            setSearchQuery('');
        } else {
            navigation.goBack();
        }
    };

    // Render category card with illustration as background
    const renderCategoryCard = (category: DuaCategory, isLarge: boolean = false) => {
        const style = categoryStyles[category];
        const label = getCategoryLabel(category, isArabic);
        const duaCount = getDuasByCategory(category).length;
        const image = categoryImages[category];

        return (
            <TouchableOpacity
                key={category}
                style={[
                    isLarge ? styles.largeCategoryCard : styles.categoryCard,
                    { backgroundColor: isDark ? theme.colors.surface : style.bgColor },
                ]}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.85}
            >
                {/* Background Illustration */}
                <Image
                    source={image}
                    style={[
                        styles.illustrationBackground,
                        isLarge && styles.largeIllustrationBackground,
                        isDark && { opacity: 0.6 },
                    ]}
                    resizeMode="cover"
                />
                {/* Text overlay at bottom */}
                <View style={[
                    styles.categoryTextOverlay,
                    { backgroundColor: isDark ? 'rgba(30, 30, 35, 0.9)' : 'rgba(255, 255, 255, 0.85)' },
                ]}>
                    <Text style={[styles.categoryLabel, { color: theme.colors.text }]} numberOfLines={2}>
                        {label}
                    </Text>
                    <Text style={[styles.categoryCount, { color: theme.colors.textSecondary }]}>
                        {isArabic ? `${duaCount} أدعية` : `${duaCount} du'as`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };


    // Render du'a card
    const renderDuaCard = ({ item: dua, index }: { item: Dua; index: number }) => {
        const isFavorite = favorites.includes(dua.id);
        const isExpanded = expandedDua === dua.id;

        return (
            <TouchableOpacity
                style={[styles.duaCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => toggleExpand(dua.id)}
                activeOpacity={0.8}
            >
                {/* Number badge */}
                <View style={[styles.duaNumber, { backgroundColor: theme.colors.primaryLight }]}>
                    <Text style={[styles.duaNumberText, { color: theme.colors.primary }]}>
                        {index + 1}
                    </Text>
                </View>

                {/* Arabic Text */}
                <Text style={[styles.arabicText, { color: theme.colors.text }]}>
                    {dua.arabic}
                </Text>

                {/* Occasion Badge */}
                {(dua.occasion || dua.occasionAr) && (
                    <View style={[styles.occasionBadge, { backgroundColor: theme.colors.info.main + '15' }]}>
                        <MaterialCommunityIcons
                            name="clock-outline"
                            size={14}
                            color={theme.colors.info.main}
                        />
                        <Text style={[styles.occasionText, { color: theme.colors.info.main }]}>
                            {isArabic ? dua.occasionAr : dua.occasion}
                        </Text>
                    </View>
                )}

                {/* Expanded Content */}
                {isExpanded && (
                    <View style={styles.expandedContent}>
                        {/* Transliteration - only for non-Arabic */}
                        {!isArabic && (
                            <View style={styles.transliterationSection}>
                                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                                    Transliteration
                                </Text>
                                <Text style={[styles.transliterationText, { color: theme.colors.text }]}>
                                    {dua.transliteration}
                                </Text>
                            </View>
                        )}

                        {/* Reference & Actions */}
                        <View style={[styles.duaFooter, { borderTopColor: theme.colors.border }]}>
                            <View style={styles.referenceRow}>
                                <MaterialCommunityIcons
                                    name="book-open-variant"
                                    size={14}
                                    color={theme.colors.textTertiary}
                                />
                                <Text style={[styles.referenceText, { color: theme.colors.textTertiary }]}>
                                    {dua.reference}
                                </Text>
                            </View>
                            <View style={styles.duaActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => toggleFavorite(dua.id)}
                                >
                                    <MaterialCommunityIcons
                                        name={isFavorite ? 'heart' : 'heart-outline'}
                                        size={22}
                                        color={isFavorite ? theme.colors.error.main : theme.colors.textSecondary}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleShare(dua)}
                                >
                                    <MaterialCommunityIcons
                                        name="share-variant"
                                        size={20}
                                        color={theme.colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Expand indicator */}
                <View style={styles.expandIndicator}>
                    <MaterialCommunityIcons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={theme.colors.textTertiary}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    // Categories home view
    const renderCategoriesHome = () => (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.categoriesContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Featured / Large Category */}
            <View style={styles.featuredSection}>
                {renderCategoryCard('protection', true)}
            </View>

            {/* Category Grid */}
            <View style={styles.categoryGrid}>
                {renderCategoryCard('morning_evening')}
                {renderCategoryCard('prayer')}
                {renderCategoryCard('forgiveness')}
                {renderCategoryCard('anxiety')}
                {renderCategoryCard('travel')}
                {renderCategoryCard('food')}
                {renderCategoryCard('sleep')}
                {renderCategoryCard('gratitude')}
                {renderCategoryCard('daily')}
            </View>
        </ScrollView>
    );

    // Du'a list view for selected category
    const renderDuaList = () => (
        <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={20}
                        color={theme.colors.textSecondary}
                    />
                    <TextInput
                        style={[styles.searchInput, { color: theme.colors.text }]}
                        placeholder={isArabic ? 'ابحث عن دعاء...' : 'Search du\'as...'}
                        placeholderTextColor={theme.colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialCommunityIcons
                                name="close-circle"
                                size={18}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Du'a List */}
            <FlatList
                data={filteredDuas}
                renderItem={renderDuaCard}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name="book-search"
                            size={64}
                            color={theme.colors.textTertiary}
                        />
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            {isArabic ? 'لم يتم العثور على أدعية' : 'No du\'as found'}
                        </Text>
                    </View>
                }
            />
        </>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {selectedCategory
                        ? getCategoryLabel(selectedCategory, isArabic)
                        : (isArabic ? 'الأدعية' : 'Du\'as')}
                </Text>
                <View style={styles.headerRight} />
            </View>

            {/* Content */}
            {selectedCategory ? renderDuaList() : renderCategoriesHome()}
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    categoriesContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    // Featured section
    featuredSection: {
        marginBottom: 16,
    },
    // Category Grid
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: CARD_WIDTH,
        borderRadius: 20,
        minHeight: 180,
        overflow: 'hidden',
        position: 'relative',
    },
    largeCategoryCard: {
        borderRadius: 24,
        minHeight: 180,
        overflow: 'hidden',
        position: 'relative',
    },
    illustrationBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        opacity: 0.85,
    },
    largeIllustrationBackground: {
        opacity: 0.9,
    },
    categoryTextOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    categoryLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    categoryCount: {
        fontSize: 12,
        opacity: 0.7,
    },
    // Search
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    // Du'a List
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 12,
    },
    duaCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    duaNumber: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    duaNumberText: {
        fontSize: 12,
        fontWeight: '700',
    },
    arabicText: {
        fontSize: 24,
        lineHeight: 42,
        textAlign: 'right',
        fontFamily: 'Amiri',
        marginBottom: 12,
    },
    occasionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        gap: 4,
        marginBottom: 8,
    },
    occasionText: {
        fontSize: 12,
        fontWeight: '500',
    },
    expandedContent: {
        marginTop: 12,
        gap: 16,
    },
    transliterationSection: {
        gap: 4,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    transliterationText: {
        fontSize: 15,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    translationSection: {
        gap: 4,
    },
    translationText: {
        fontSize: 15,
        lineHeight: 24,
    },
    duaFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        marginTop: 4,
        borderTopWidth: 1,
    },
    referenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    referenceText: {
        fontSize: 12,
    },
    duaActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 4,
    },
    expandIndicator: {
        alignItems: 'center',
        marginTop: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
    },
});

export default DuaScreen;
