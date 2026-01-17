// Reset Modal - Reset Today or Reset History for habits
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore } from '../store';

export type HabitType = 'salat' | 'adhkar-morning' | 'adhkar-evening' | 'quran' | 'charity' | 'tahajjud' | 'custom';

interface ResetModalProps {
    visible: boolean;
    onClose: () => void;
    habitType: HabitType;
    habitId?: string; // For custom habits
    habitName: string;
}

const ResetModal: React.FC<ResetModalProps> = ({
    visible,
    onClose,
    habitType,
    habitId,
    habitName,
}) => {
    const { i18n } = useTranslation();
    const { theme } = useTheme();
    const isArabic = i18n.language === 'ar';
    const [isResetting, setIsResetting] = useState(false);

    // Get reset actions - use individual selectors
    const resetSalatToday = useSalatStore((state) => state.resetSalatToday);
    const resetSalatHistory = useSalatStore((state) => state.resetSalatHistory);
    const resetAdhkarToday = useHabitsStore((state) => state.resetAdhkarToday);
    const resetAdhkarHistory = useHabitsStore((state) => state.resetAdhkarHistory);
    const resetQuranToday = useHabitsStore((state) => state.resetQuranToday);
    const resetQuranHistory = useHabitsStore((state) => state.resetQuranHistory);
    const resetCharityToday = useHabitsStore((state) => state.resetCharityToday);
    const resetCharityHistory = useHabitsStore((state) => state.resetCharityHistory);
    const resetTahajjudToday = useHabitsStore((state) => state.resetTahajjudToday);
    const resetTahajjudHistory = useHabitsStore((state) => state.resetTahajjudHistory);
    const resetCustomHabitToday = useHabitsStore((state) => state.resetCustomHabitToday);
    const resetCustomHabitHistory = useHabitsStore((state) => state.resetCustomHabitHistory);

    const handleResetToday = () => {
        setIsResetting(true);
        try {
            switch (habitType) {
                case 'salat':
                    resetSalatToday();
                    break;
                case 'adhkar-morning':
                    resetAdhkarToday('morning');
                    break;
                case 'adhkar-evening':
                    resetAdhkarToday('evening');
                    break;
                case 'quran':
                    resetQuranToday();
                    break;
                case 'charity':
                    resetCharityToday();
                    break;
                case 'tahajjud':
                    resetTahajjudToday();
                    break;
                case 'custom':
                    if (habitId) resetCustomHabitToday(habitId);
                    break;
            }
            onClose();
        } finally {
            setIsResetting(false);
        }
    };

    const handleResetHistory = () => {
        const title = isArabic ? 'تأكيد الحذف' : 'Confirm Delete';
        const message = isArabic
            ? `هل أنت متأكد من حذف جميع سجلات ${habitName}؟ لا يمكن التراجع عن هذا.`
            : `Are you sure you want to delete all ${habitName} records? This cannot be undone.`;

        Alert.alert(title, message, [
            {
                text: isArabic ? 'إلغاء' : 'Cancel',
                style: 'cancel',
            },
            {
                text: isArabic ? 'حذف' : 'Delete',
                style: 'destructive',
                onPress: () => {
                    setIsResetting(true);
                    try {
                        switch (habitType) {
                            case 'salat':
                                resetSalatHistory();
                                break;
                            case 'adhkar-morning':
                            case 'adhkar-evening':
                                resetAdhkarHistory();
                                break;
                            case 'quran':
                                resetQuranHistory();
                                break;
                            case 'charity':
                                resetCharityHistory();
                                break;
                            case 'tahajjud':
                                resetTahajjudHistory();
                                break;
                            case 'custom':
                                if (habitId) resetCustomHabitHistory(habitId);
                                break;
                        }
                        onClose();
                    } finally {
                        setIsResetting(false);
                    }
                },
            },
        ]);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View
                    style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
                    onStartShouldSetResponder={() => true}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            {isArabic ? `إعادة تعيين ${habitName}` : `Reset ${habitName}`}
                        </Text>
                    </View>

                    {/* Reset Today Option */}
                    <TouchableOpacity
                        style={[
                            styles.option,
                            { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
                        ]}
                        onPress={handleResetToday}
                        disabled={isResetting}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                            <MaterialCommunityIcons name="refresh" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                                {isArabic ? 'إعادة تعيين اليوم' : 'Reset Today'}
                            </Text>
                            <Text style={[styles.optionDesc, { color: theme.colors.textSecondary }]}>
                                {isArabic
                                    ? 'مسح سجل اليوم فقط، التاريخ السابق سيبقى'
                                    : "Clear today's log only, history stays intact"}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Reset History Option */}
                    <TouchableOpacity
                        style={[
                            styles.option,
                            styles.dangerOption,
                            { backgroundColor: theme.colors.error.light, borderColor: theme.colors.error.main },
                        ]}
                        onPress={handleResetHistory}
                        disabled={isResetting}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.error.main + '20' }]}>
                            <MaterialCommunityIcons name="delete-forever" size={24} color={theme.colors.error.main} />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={[styles.optionTitle, { color: theme.colors.error.main }]}>
                                {isArabic ? 'حذف كل السجلات' : 'Reset History'}
                            </Text>
                            <Text style={[styles.optionDesc, { color: theme.colors.error.main }]}>
                                {isArabic
                                    ? 'حذف جميع السجلات والإحصائيات'
                                    : 'Delete all records and reset streaks'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={[styles.cancelButton, { borderColor: theme.colors.border }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                            {isArabic ? 'إلغاء' : 'Cancel'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 20,
        padding: 20,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 12,
        gap: 14,
    },
    dangerOption: {
        borderWidth: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    optionDesc: {
        fontSize: 12,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 4,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '500',
    },
});

export default ResetModal;
