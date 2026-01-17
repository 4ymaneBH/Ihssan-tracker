// Adhkar Reading Screen - View and track adhkar completion
import React, { useState, useCallback } from 'react';
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
import { useTheme } from '../context';
import { useHabitsStore } from '../store';
import { getAdhkarByCategory, Dhikr } from '../data/adhkarContent';
import { getDateString } from '../utils';

// Single Dhikr Card Component
interface DhikrCardProps {
    dhikr: Dhikr;
    index: number;
    isCompleted: boolean;
    onComplete: () => void;
}

const DhikrCard: React.FC<DhikrCardProps> = ({
    dhikr,
    index,
    isCompleted,
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
            activeOpacity={0.9}
            onPress={handleTap}
            disabled={isDone}
            style={[
                styles.dhikrCard,
                {
                    backgroundColor: isDone
                        ? theme.colors.success.light
                        : theme.colors.surface,
                    borderColor: isDone
                        ? theme.colors.success.main
                        : theme.colors.border,
                },
            ]}
        >
            {/* Counter Badge */}
            <View style={styles.counterRow}>
                <View
                    style={[
                        styles.indexBadge,
                        { backgroundColor: theme.colors.primary + '20' },
                    ]}
                >
                    <Text style={[styles.indexText, { color: theme.colors.primary }]}>
                        {index + 1}
                    </Text>
                </View>
                <View style={styles.repeatInfo}>
                    <Text style={[styles.countText, { color: theme.colors.text }]}>
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
                <Text style={[styles.referenceText, { color: theme.colors.textTertiary }]}>
                    📖 {dhikr.reference}
                </Text>
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
                    Tap to count
                </Text>
            )}
        </TouchableOpacity>
    );
};

// Main Adhkar Screen
interface AdhkarScreenProps {
    route?: {
        params?: {
            category?: 'morning' | 'evening';
        };
    };
}

const AdhkarScreen: React.FC<AdhkarScreenProps> = ({ route }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logAdhkar } = useHabitsStore();

    const category = route?.params?.category || 'morning';
    const adhkarList = getAdhkarByCategory(category);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

    const today = getDateString(new Date());
    const isArabic = i18n.language === 'ar';

    const handleComplete = useCallback((dhikrId: string) => {
        setCompletedIds((prev) => new Set([...prev, dhikrId]));
    }, []);

    const completedCount = completedIds.size;
    const totalCount = adhkarList.length;
    const isAllComplete = completedCount === totalCount;

    // Log to store when all complete
    React.useEffect(() => {
        if (isAllComplete) {
            logAdhkar(today, category, totalCount, totalCount);
        }
    }, [isAllComplete, today, category, totalCount, logAdhkar]);

    const getCategoryIcon = () => {
        return category === 'morning' ? 'weather-sunny' : 'weather-night';
    };

    const getCategoryTitle = () => {
        return category === 'morning' ? t('adhkar.morning') : t('adhkar.evening');
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <MaterialCommunityIcons
                        name={getCategoryIcon()}
                        size={28}
                        color={theme.colors.primary}
                    />
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        {getCategoryTitle()}
                    </Text>
                </View>
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

            {/* Instructions */}
            <View style={[styles.instructions, { backgroundColor: theme.colors.surface }]}>
                <MaterialCommunityIcons
                    name="gesture-tap"
                    size={20}
                    color={theme.colors.textSecondary}
                />
                <Text style={[styles.instructionsText, { color: theme.colors.textSecondary }]}>
                    {isArabic ? 'اضغط على كل ذكر للعد' : 'Tap each dhikr to count'}
                </Text>
            </View>

            {/* Adhkar List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {adhkarList.map((dhikr, index) => (
                    <DhikrCard
                        key={dhikr.id}
                        dhikr={dhikr}
                        index={index}
                        isCompleted={completedIds.has(dhikr.id)}
                        onComplete={() => handleComplete(dhikr.id)}
                    />
                ))}

                {/* Completion message */}
                {isAllComplete && (
                    <View
                        style={[
                            styles.completionCard,
                            { backgroundColor: theme.colors.success.light },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="check-decagram"
                            size={48}
                            color={theme.colors.success.main}
                        />
                        <Text
                            style={[styles.completionTitle, { color: theme.colors.success.dark }]}
                        >
                            {isArabic ? 'ما شاء الله!' : 'Masha Allah!'}
                        </Text>
                        <Text
                            style={[styles.completionText, { color: theme.colors.success.dark }]}
                        >
                            {isArabic
                                ? 'لقد أكملت جميع الأذكار'
                                : 'You have completed all adhkar'}
                        </Text>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    progressBadge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
    },
    instructions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 8,
    },
    instructionsText: {
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    dhikrCard: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
    },
    counterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    indexBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indexText: {
        fontSize: 14,
        fontWeight: '600',
    },
    repeatInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countText: {
        fontSize: 16,
        fontWeight: '600',
    },
    arabicText: {
        fontSize: 22,
        lineHeight: 40,
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
    referenceText: {
        fontSize: 12,
        marginBottom: 12,
    },
    progressTrack: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    tapHint: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
    },
    completionCard: {
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        gap: 12,
    },
    completionTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    completionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    bottomSpacer: {
        height: 40,
    },
});

export default AdhkarScreen;
