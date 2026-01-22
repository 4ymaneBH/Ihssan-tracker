import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useUserPreferencesStore } from '../store';
import { SalatName, UserPreferences } from '../types';
import { getFontFamily } from '../utils';

interface PrayerNotificationsModalProps {
    visible: boolean;
    onClose: () => void;
}

export const PrayerNotificationsModal: React.FC<PrayerNotificationsModalProps> = ({
    visible,
    onClose,
}) => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const isArabic = i18n.language === 'ar';

    // Access store
    const prayerNotifications = useUserPreferencesStore((state) => state.prayerNotifications);
    const setPrayerNotificationSettings = useUserPreferencesStore((state) => state.setPrayerNotificationSettings);

    const prayers: SalatName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    // If undefined (e.g. migration), default them locally for display or safe access
    const safeNotifications = prayerNotifications || {};

    const toggleSound = (prayer: SalatName) => {
        const current = safeNotifications[prayer] || { sound: 'azan' };
        const nextSound = current.sound === 'azan' ? 'beep' : current.sound === 'beep' ? 'off' : 'azan';

        setPrayerNotificationSettings(prayer, {
            ...current,
            sound: nextSound,
        });
    };

    const togglePreNotif = (prayer: SalatName) => {
        const current = safeNotifications[prayer] || { sound: 'azan' };
        // Simple toggle for now: 0 -> 10 -> 15 -> 20 -> 30 -> 0
        const currentVal = current.preNotification || 0;
        const steps = [0, 10, 15, 20, 30];
        const nextIndex = (steps.indexOf(currentVal) + 1) % steps.length;
        const nextVal = steps[nextIndex];

        setPrayerNotificationSettings(prayer, {
            ...current,
            preNotification: nextVal,
        });
    };

    const getSoundIcon = (sound: string) => {
        if (sound === 'azan') return 'volume-high';
        if (sound === 'beep') return 'bell-ring';
        return 'volume-off';
    };

    const getSoundLabel = (sound: string) => {
        if (sound === 'azan') return isArabic ? 'أذان' : 'Adhan';
        if (sound === 'beep') return isArabic ? 'تنبيه' : 'Beep';
        return isArabic ? 'صامت' : 'Silent';
    };

    if (!visible) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {t('settings.notifications')}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                            {isArabic
                                ? 'تخصيص التنبيهات لكل صلاة'
                                : 'Customize notifications for each prayer'}
                        </Text>

                        <View style={styles.list}>
                            {prayers.map((prayer) => {
                                const settings = safeNotifications[prayer] || { sound: 'azan', preNotification: 0 };

                                return (
                                    <View key={prayer} style={[styles.row, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}>
                                        <Text style={[styles.prayerName, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium') }]}>
                                            {t(`salat.${prayer}`)}
                                        </Text>

                                        <View style={styles.controls}>
                                            {/* Pre-Notification Toggle */}
                                            <TouchableOpacity
                                                style={[styles.controlBtn, { backgroundColor: theme.colors.background }]}
                                                onPress={() => togglePreNotif(prayer)}
                                            >
                                                <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.textSecondary} />
                                                <Text style={[styles.controlText, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                                    {settings.preNotification ? `-${settings.preNotification}m` : '--'}
                                                </Text>
                                            </TouchableOpacity>

                                            {/* Sound Toggle */}
                                            <TouchableOpacity
                                                style={[
                                                    styles.controlBtn,
                                                    {
                                                        backgroundColor: settings.sound === 'off' ? theme.colors.background : theme.colors.primary + '20',
                                                        borderColor: settings.sound === 'off' ? theme.colors.border : 'transparent',
                                                        borderWidth: settings.sound === 'off' ? 1 : 0
                                                    }
                                                ]}
                                                onPress={() => toggleSound(prayer)}
                                            >
                                                <MaterialCommunityIcons
                                                    name={getSoundIcon(settings.sound)}
                                                    size={18}
                                                    color={settings.sound === 'off' ? theme.colors.textSecondary : theme.colors.primary}
                                                />
                                                <Text style={[
                                                    styles.controlText,
                                                    {
                                                        color: settings.sound === 'off' ? theme.colors.textSecondary : theme.colors.primary,
                                                        fontFamily: getFontFamily(isArabic, 'medium')
                                                    }
                                                ]}>
                                                    {getSoundLabel(settings.sound)}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.spacer} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    list: {
        gap: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    prayerName: {
        fontSize: 16,
        flex: 1,
    },
    controls: {
        flexDirection: 'row',
        gap: 8,
    },
    controlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
        minWidth: 80,
        justifyContent: 'center',
    },
    controlText: {
        fontSize: 13,
    },
    spacer: {
        height: 30,
    },
});
