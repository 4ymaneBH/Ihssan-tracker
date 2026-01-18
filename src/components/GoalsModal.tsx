// Goals Modal - Premium UI for customizing weekly goals
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTheme } from '../context';
import { useUserPreferencesStore } from '../store';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GoalsModalProps {
    visible: boolean;
    onClose: () => void;
}

interface GoalItemProps {
    icon: string;
    iconColor: string;
    title: string;
    subtitle: string;
    value: number;
    onValueChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    unit: string;
}

const GoalItem: React.FC<GoalItemProps> = ({
    icon,
    iconColor,
    title,
    subtitle,
    value,
    onValueChange,
    min,
    max,
    step,
    unit,
}) => {
    const { theme, isDark } = useTheme();
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleSliderComplete = (val: number) => {
        const roundedValue = Math.round(val / step) * step;
        onValueChange(roundedValue);
    };

    const handleIncrement = () => {
        if (localValue < max) {
            const newValue = Math.min(max, localValue + step);
            setLocalValue(newValue);
            onValueChange(newValue);
        }
    };

    const handleDecrement = () => {
        if (localValue > min) {
            const newValue = Math.max(min, localValue - step);
            setLocalValue(newValue);
            onValueChange(newValue);
        }
    };

    return (
        <View style={[styles.goalItem, { backgroundColor: isDark ? theme.colors.surface : '#F8F9FA' }]}>
            <View style={styles.goalHeader}>
                <View style={[styles.goalIconContainer, { backgroundColor: iconColor + '20' }]}>
                    <MaterialCommunityIcons name={icon as any} size={24} color={iconColor} />
                </View>
                <View style={styles.goalTitleContainer}>
                    <Text style={[styles.goalTitle, { color: theme.colors.text }]}>{title}</Text>
                    <Text style={[styles.goalSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
                </View>
            </View>

            {/* Value Display with +/- Buttons */}
            <View style={styles.valueContainer}>
                <TouchableOpacity
                    style={[styles.valueButton, { backgroundColor: theme.colors.primary + '20' }]}
                    onPress={handleDecrement}
                >
                    <MaterialCommunityIcons name="minus" size={20} color={theme.colors.primary} />
                </TouchableOpacity>

                <View style={styles.valueDisplay}>
                    <Text style={[styles.valueText, { color: theme.colors.text }]}>{localValue}</Text>
                    <Text style={[styles.unitText, { color: theme.colors.textSecondary }]}>{unit}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.valueButton, { backgroundColor: theme.colors.primary + '20' }]}
                    onPress={handleIncrement}
                >
                    <MaterialCommunityIcons name="plus" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Slider */}
            <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={localValue}
                onValueChange={setLocalValue}
                onSlidingComplete={handleSliderComplete}
                minimumTrackTintColor={iconColor}
                maximumTrackTintColor={isDark ? theme.colors.border : '#E0E0E0'}
                thumbTintColor={iconColor}
            />

            <View style={styles.sliderLabels}>
                <Text style={[styles.sliderLabel, { color: theme.colors.textTertiary }]}>{min}</Text>
                <Text style={[styles.sliderLabel, { color: theme.colors.textTertiary }]}>{max}</Text>
            </View>
        </View>
    );
};

export const GoalsModal: React.FC<GoalsModalProps> = ({ visible, onClose }) => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const { goals, setGoals } = useUserPreferencesStore();
    const isArabic = i18n.language === 'ar';

    const handleQuranChange = (value: number) => {
        setGoals({ quranPagesPerDay: value });
    };

    const handleCharityChange = (value: number) => {
        setGoals({ charityPerWeek: value });
    };

    const handleTahajjudChange = (value: number) => {
        setGoals({ tahajjudNightsPerWeek: value });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={isDark ? 40 : 80} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />

                <View style={[styles.container, { backgroundColor: isDark ? theme.colors.background : '#FFFFFF' }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={[styles.headerIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                                <MaterialCommunityIcons name="target" size={24} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                                    {isArabic ? 'أهدافك الأسبوعية' : 'Your Weekly Goals'}
                                </Text>
                                <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                                    {isArabic ? 'خصص أهدافك حسب قدرتك' : 'Customize based on your capacity'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Goals List */}
                    <View style={styles.goalsContainer}>
                        <GoalItem
                            icon="book-open-page-variant"
                            iconColor={theme.colors.primary}
                            title={isArabic ? 'القرآن الكريم' : 'Quran Reading'}
                            subtitle={isArabic ? 'صفحات يومياً' : 'Pages per day'}
                            value={goals.quranPagesPerDay}
                            onValueChange={handleQuranChange}
                            min={1}
                            max={30}
                            step={1}
                            unit={isArabic ? 'صفحة/يوم' : 'pages/day'}
                        />

                        <GoalItem
                            icon="hand-heart"
                            iconColor={theme.colors.success.main}
                            title={isArabic ? 'الصدقة' : 'Charity'}
                            subtitle={isArabic ? 'مرات أسبوعياً' : 'Times per week'}
                            value={goals.charityPerWeek}
                            onValueChange={handleCharityChange}
                            min={1}
                            max={14}
                            step={1}
                            unit={isArabic ? 'مرة/أسبوع' : 'times/week'}
                        />

                        <GoalItem
                            icon="moon-waning-crescent"
                            iconColor={theme.colors.info.main}
                            title={isArabic ? 'التهجد' : 'Tahajjud'}
                            subtitle={isArabic ? 'ليالي أسبوعياً' : 'Nights per week'}
                            value={goals.tahajjudNightsPerWeek}
                            onValueChange={handleTahajjudChange}
                            min={1}
                            max={7}
                            step={1}
                            unit={isArabic ? 'ليلة/أسبوع' : 'nights/week'}
                        />
                    </View>

                    {/* Done Button */}
                    <TouchableOpacity
                        style={[styles.doneButton, { backgroundColor: theme.colors.primary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.doneButtonText}>
                            {isArabic ? 'حفظ الأهداف' : 'Save Goals'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalsContainer: {
        gap: 16,
    },
    goalItem: {
        borderRadius: 20,
        padding: 20,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
    },
    goalIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalTitleContainer: {
        flex: 1,
    },
    goalTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    goalSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 16,
    },
    valueButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    valueDisplay: {
        alignItems: 'center',
        minWidth: 100,
    },
    valueText: {
        fontSize: 36,
        fontWeight: '700',
    },
    unitText: {
        fontSize: 12,
        marginTop: 2,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    sliderLabel: {
        fontSize: 12,
    },
    doneButton: {
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
});

export default GoalsModal;
