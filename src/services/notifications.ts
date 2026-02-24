// Notification service for reminders
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { logger } from '../utils/logger';

import { SalatName, PrayerNotificationSettings } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Notification types
export type NotificationType =
    | 'salat_reminder'
    | 'salat_pre_reminder'
    | 'adhkar_morning'
    | 'adhkar_evening'
    | 'quran_reminder'
    | 'tahajjud_reminder'
    | 'custom_habit';

interface ScheduledNotification {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    hour: number;
    minute: number;
}

// Storage key
const NOTIFICATIONS_KEY = 'scheduled-notifications';

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
};

// Check if within quiet hours
export const isWithinQuietHours = (
    quietStart: string,
    quietEnd: string
): boolean => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = quietStart.split(':').map(Number);
    const [endHour, endMin] = quietEnd.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Handle overnight quiet hours (e.g., 22:00 - 06:00)
    if (startMinutes > endMinutes) {
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

// Schedule a daily notification
export const scheduleDailyNotification = async (
    notification: ScheduledNotification
): Promise<string | null> => {
    try {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: notification.title,
                body: notification.body,
                data: { type: notification.type },
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: notification.hour,
                minute: notification.minute,
            },
        });

        // Save to storage
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        const notifications: Record<string, ScheduledNotification> = stored
            ? JSON.parse(stored)
            : {};
        notifications[notification.id] = {
            ...notification,
        };
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

        return identifier;
    } catch (error) {
        logger.error('Failed to schedule notification:', error);
        return null;
    }
};

// Cancel a scheduled notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);

        // Remove from storage
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (stored) {
            const notifications: Record<string, ScheduledNotification> = JSON.parse(stored);
            delete notifications[notificationId];
            await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
        }
    } catch (error) {
        logger.error('Failed to cancel notification:', error);
    }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<void> => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    } catch (error) {
        logger.error('Failed to cancel all notifications:', error);
    }
};

// Get all scheduled notifications
export const getScheduledNotifications = async (): Promise<ScheduledNotification[]> => {
    try {
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (stored) {
            return Object.values(JSON.parse(stored));
        }
        return [];
    } catch (error) {
        logger.error('Failed to get scheduled notifications:', error);
        return [];
    }
};

// Snooze a notification for a specified duration (in minutes)
export const snoozeNotification = async (
    notification: ScheduledNotification,
    snoozeMinutes: number = 10
): Promise<string | null> => {
    try {
        const snoozeTime = new Date();
        snoozeTime.setMinutes(snoozeTime.getMinutes() + snoozeMinutes);

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: notification.title,
                body: notification.body,
                data: { type: notification.type, snoozed: true },
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: snoozeTime,
            },
        });

        return identifier;
    } catch (error) {
        logger.error('Failed to snooze notification:', error);
        return null;
    }
};

// Default reminder messages (gentle, no guilt)
export const reminderMessages = {
    salat: {
        en: {
            title: '🕌 Prayer Time',
            body: "It's time for prayer. May your salat bring you peace.",
        },
        ar: {
            title: '🕌 وقت الصلاة',
            body: 'حان وقت الصلاة. نسأل الله أن تكون صلاتك سكينة لقلبك.',
        },
    },
    adhkar_morning: {
        en: {
            title: '🌅 Morning Adhkar',
            body: 'Start your day with remembrance. Your morning adhkar await.',
        },
        ar: {
            title: '🌅 أذكار الصباح',
            body: 'ابدأ يومك بذكر الله. أذكار الصباح بانتظارك.',
        },
    },
    adhkar_evening: {
        en: {
            title: '🌆 Evening Adhkar',
            body: 'Wind down with remembrance. Your evening adhkar await.',
        },
        ar: {
            title: '🌆 أذكار المساء',
            body: 'اختم يومك بذكر الله. أذكار المساء بانتظارك.',
        },
    },
    quran: {
        en: {
            title: '📖 Qur\'an Time',
            body: 'A few minutes with the Qur\'an can brighten your whole day.',
        },
        ar: {
            title: '📖 وقت القرآن',
            body: 'دقائق مع القرآن قد تُنير يومك بأكمله.',
        },
    },
    tahajjud: {
        en: {
            title: '🌙 Tahajjud',
            body: 'The night is quiet. Consider rising for tahajjud.',
        },
        ar: {
            title: '🌙 التهجد',
            body: 'الليل هادئ. قم للتهجد إن استطعت.',
        },
    },
};

// Setup default notifications
export const setupDefaultNotifications = async (language: 'en' | 'ar'): Promise<void> => {
    // Morning Adhkar - 6:00 AM
    await scheduleDailyNotification({
        id: 'adhkar_morning',
        type: 'adhkar_morning',
        title: reminderMessages.adhkar_morning[language].title,
        body: reminderMessages.adhkar_morning[language].body,
        hour: 6,
        minute: 0,
    });

    // Evening Adhkar - 6:00 PM
    await scheduleDailyNotification({
        id: 'adhkar_evening',
        type: 'adhkar_evening',
        title: reminderMessages.adhkar_evening[language].title,
        body: reminderMessages.adhkar_evening[language].body,
        hour: 18,
        minute: 0,
    });

    // Qur'an reminder - 8:00 PM
    await scheduleDailyNotification({
        id: 'quran_reminder',
        type: 'quran_reminder',
        title: reminderMessages.quran[language].title,
        body: reminderMessages.quran[language].body,
        hour: 20,
        minute: 0,
    });
};

// Schedule notifications for prayer times
export const schedulePrayerNotifications = async (
    prayerTimes: Record<SalatName, Date>,
    settings: Record<SalatName, PrayerNotificationSettings>,
    language: 'en' | 'ar'
): Promise<void> => {
    // 1. Cancel existing prayer notifications
    const scheduled = await getScheduledNotifications();
    const prayerNotifications = scheduled.filter(n =>
        n.type === 'salat_reminder' || n.type === 'salat_pre_reminder'
    );

    for (const notification of prayerNotifications) {
        await cancelNotification(notification.id);
    }

    // 2. Schedule new ones based on settings
    const prayers: SalatName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const now = new Date();

    for (const prayer of prayers) {
        const time = prayerTimes[prayer];
        const config = settings[prayer];

        // Skip if time is past or sound is off
        if (!time || config.sound === 'off') continue;

        // Skip if time is in the past (allow for small margin?)
        if (time.getTime() <= now.getTime()) continue;

        // Schedule Main Notification (Adhan/Beep)
        const messages = reminderMessages.salat[language];
        await Notifications.scheduleNotificationAsync({
            content: {
                title: messages.title,
                body: `${messages.body} (${prayer})`, // Improve this translation later
                data: { type: 'salat_reminder', prayer },
                sound: config.sound === 'azan' ? 'azan.mp3' : true, // Assuming azan.mp3 exists or handle custom sound
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: time,
            },
        });

        // Pre-Notification
        if (config.preNotification && config.preNotification > 0) {
            const preTime = new Date(time.getTime() - config.preNotification * 60000);
            if (preTime.getTime() > now.getTime()) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: language === 'ar' ? 'اقتربت الصلاة' : 'Prayer Approaching',
                        body: language === 'ar'
                            ? `باقي ${config.preNotification} دقيقة على صلاة ${prayer}`
                            : `${config.preNotification} minutes until ${prayer}`,
                        data: { type: 'salat_pre_reminder', prayer },
                        sound: true,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: preTime,
                    },
                });
            }
        }
    }
};

