// Custom Habits Screen - Full habit management
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useHabitsStore } from '../store';
import { Card, Chip, IconButton } from '../components';
import { getDateString, formatNumber } from '../utils';
import { CustomHabit } from '../types';

// Available icons for custom habits
const HABIT_ICONS = ['📿', '📚', '💪', '🏃', '💧', '🌿', '🧘', '💤', '✍️', '🎯', '⭐', '🌙', '☀️', '🤲', '📖', '🕌'];

// Available colors for custom habits
const HABIT_COLORS = [
    '#0D9488', // Teal
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#EF4444', // Red
    '#6366F1', // Indigo
];

interface AddHabitModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (habit: Omit<CustomHabit, 'id' | 'createdAt'>) => void;
    editingHabit?: CustomHabit | null;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({
    visible,
    onClose,
    onSave,
    editingHabit,
}) => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [name, setName] = useState(editingHabit?.name || '');
    const [nameAr, setNameAr] = useState(editingHabit?.nameAr || '');
    const [icon, setIcon] = useState(editingHabit?.icon || '📿');
    const [color, setColor] = useState(editingHabit?.color || '#0D9488');
    const [frequency, setFrequency] = useState<'daily' | 'weekly'>(editingHabit?.frequency || 'daily');
    const [targetCount, setTargetCount] = useState(String(editingHabit?.targetCount || 1));

    const handleSave = () => {
        if (!name.trim()) return;

        onSave({
            name: name.trim(),
            nameAr: nameAr.trim() || name.trim(),
            icon,
            color,
            frequency,
            targetCount: parseInt(targetCount) || 1,
            isActive: true,
        });

        // Reset form
        setName('');
        setNameAr('');
        setIcon('📿');
        setColor('#0D9488');
        setFrequency('daily');
        setTargetCount('1');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView
                style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}
            >
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                            {t('common.cancel')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                        {editingHabit ? t('habits.editHabit') : t('habits.addHabit')}
                    </Text>
                    <TouchableOpacity onPress={handleSave} disabled={!name.trim()}>
                        <Text
                            style={[
                                styles.saveButton,
                                {
                                    color: name.trim() ? theme.colors.primary : theme.colors.textTertiary,
                                },
                            ]}
                        >
                            {t('common.save')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    {/* Name Input */}
                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                        {t('habits.habitName')} (English)
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                backgroundColor: theme.colors.surface,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        value={name}
                        onChangeText={setName}
                        placeholder={t('habits.enterHabitName')}
                        placeholderTextColor={theme.colors.textTertiary}
                    />

                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                        {t('habits.habitName')} (العربية)
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                backgroundColor: theme.colors.surface,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                                textAlign: 'right',
                            },
                        ]}
                        value={nameAr}
                        onChangeText={setNameAr}
                        placeholder="أدخل اسم العادة"
                        placeholderTextColor={theme.colors.textTertiary}
                    />

                    {/* Icon Picker */}
                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                        {t('habits.selectIcon')}
                    </Text>
                    <View style={styles.iconGrid}>
                        {HABIT_ICONS.map((i) => (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.iconOption,
                                    {
                                        backgroundColor:
                                            icon === i ? theme.colors.primary : theme.colors.surface,
                                        borderColor:
                                            icon === i ? theme.colors.primary : theme.colors.border,
                                    },
                                ]}
                                onPress={() => setIcon(i)}
                            >
                                <Text style={styles.iconText}>{i}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Color Picker */}
                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                        {t('habits.selectColor')}
                    </Text>
                    <View style={styles.colorGrid}>
                        {HABIT_COLORS.map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[
                                    styles.colorOption,
                                    {
                                        backgroundColor: c,
                                        borderWidth: color === c ? 3 : 0,
                                        borderColor: theme.colors.text,
                                    },
                                ]}
                                onPress={() => setColor(c)}
                            />
                        ))}
                    </View>

                    {/* Frequency */}
                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                        {t('habits.frequency')}
                    </Text>
                    <View style={styles.frequencyRow}>
                        <Chip
                            label={t('habits.daily')}
                            selected={frequency === 'daily'}
                            onPress={() => setFrequency('daily')}
                        />
                        <Chip
                            label={t('habits.weekly')}
                            selected={frequency === 'weekly'}
                            onPress={() => setFrequency('weekly')}
                        />
                    </View>

                    {/* Target Count */}
                    <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                        {t('habits.targetCount')}
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                backgroundColor: theme.colors.surface,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                                width: 100,
                            },
                        ]}
                        value={targetCount}
                        onChangeText={setTargetCount}
                        keyboardType="number-pad"
                        placeholder="1"
                        placeholderTextColor={theme.colors.textTertiary}
                    />
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

// Main Custom Habits Screen
const CustomHabitsScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [editingHabit, setEditingHabit] = useState<CustomHabit | null>(null);

    const {
        customHabits,
        addCustomHabit,
        updateCustomHabit,
        logCustomHabit,
        getCustomHabitLog,
    } = useHabitsStore();

    const today = getDateString(new Date());
    const isArabic = i18n.language === 'ar';

    const handleAddHabit = (habitData: Omit<CustomHabit, 'id' | 'createdAt'>) => {
        if (editingHabit) {
            updateCustomHabit(editingHabit.id, habitData);
        } else {
            addCustomHabit(habitData);
        }
        setEditingHabit(null);
    };

    const handleEditHabit = (habit: CustomHabit) => {
        setEditingHabit(habit);
        setModalVisible(true);
    };

    const handleLogHabit = (habitId: string) => {
        const log = getCustomHabitLog(today, habitId);
        const habit = customHabits.find((h) => h.id === habitId);
        if (!habit) return;

        const currentCount = log?.count || 0;
        const newCount = currentCount >= habit.targetCount ? 0 : currentCount + 1;
        logCustomHabit(habitId, newCount);
    };

    const renderHabit = ({ item: habit }: { item: CustomHabit }) => {
        const log = getCustomHabitLog(today, habit.id);
        const count = log?.count || 0;
        const isComplete = count >= habit.targetCount;
        const habitName = isArabic ? habit.nameAr : habit.name;

        return (
            <TouchableOpacity
                style={[
                    styles.habitCard,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: isComplete ? habit.color : theme.colors.border,
                        borderWidth: isComplete ? 2 : 1,
                    },
                ]}
                onPress={() => handleLogHabit(habit.id)}
                onLongPress={() => handleEditHabit(habit)}
            >
                <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
                    <Text style={styles.habitIconText}>{habit.icon}</Text>
                </View>
                <View style={styles.habitInfo}>
                    <Text style={[styles.habitName, { color: theme.colors.text }]}>
                        {habitName}
                    </Text>
                    <Text style={[styles.habitProgress, { color: theme.colors.textSecondary }]}>
                        {formatNumber(count, i18n.language)} / {formatNumber(habit.targetCount, i18n.language)}
                    </Text>
                </View>
                {isComplete && (
                    <View style={[styles.checkBadge, { backgroundColor: habit.color }]}>
                        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('habits.customHabits')}
                </Text>
                <IconButton
                    icon="+"
                    onPress={() => {
                        setEditingHabit(null);
                        setModalVisible(true);
                    }}
                    variant="primary"
                    size="medium"
                />
            </View>

            {customHabits.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="star-four-points-outline" size={64} color={theme.colors.textTertiary} />
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                        {t('habits.noHabits')}
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                        {t('habits.addFirstHabit')}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={customHabits.filter((h) => h.isActive)}
                    renderItem={renderHabit}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.habitList}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <AddHabitModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingHabit(null);
                }}
                onSave={handleAddHabit}
                editingHabit={editingHabit}
            />
        </SafeAreaView>
    );
};

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
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    habitList: {
        padding: 16,
        gap: 12,
    },
    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    habitIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    habitIconText: {
        fontSize: 24,
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
    },
    habitProgress: {
        fontSize: 14,
        marginTop: 4,
    },
    checkBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        fontSize: 16,
    },
    saveButton: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalContent: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 20,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    iconOption: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    iconText: {
        fontSize: 24,
    },
    colorGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    colorOption: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    frequencyRow: {
        flexDirection: 'row',
        gap: 12,
    },
});

export default CustomHabitsScreen;
