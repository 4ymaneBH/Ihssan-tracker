// Track Screen - Premium Salat Tracker
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
    GradientBackground,
    GlassHeader,
    IconCircleButton,
    GlassCard,
    SalatChip,
} from '../components';
import { useTheme } from '../context';
import { useSalatStore } from '../store';
import { getDateString } from '../utils';
import { SalatName, SalatStatus } from '../types';

export default function TrackScreen() {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { logPrayer, getTodayLog } = useSalatStore();

    const today = getDateString(new Date());
    const todayLog = getTodayLog();

    const prayers: { key: SalatName; label: string }[] = [
        { key: 'fajr', label: t('salat.fajr') },
        { key: 'dhuhr', label: t('salat.dhuhr') },
        { key: 'asr', label: t('salat.asr') },
        { key: 'maghrib', label: t('salat.maghrib') },
        { key: 'isha', label: t('salat.isha') },
    ];

    const cyclePrayerStatus = (prayer: SalatName) => {
        const currentStatus = todayLog?.[prayer];
        let newStatus: SalatStatus;

        if (!currentStatus) newStatus = 'onTime';
        else if (currentStatus === 'onTime') newStatus = 'late';
        else if (currentStatus === 'late') newStatus = 'missed';
        else newStatus = null;

        logPrayer(today, prayer, newStatus);
    };

    const getChipStatus = (status: SalatStatus | null | undefined): 'done' | 'missed' | 'not-done' => {
        if (!status) return 'not-done';
        if (status === 'missed') return 'missed';
        return 'done';
    };

    return (
        <GradientBackground>
            <GlassHeader
                title={t('salat.title')}
                left={<IconCircleButton icon="arrow-back" />}
                right={<IconCircleButton icon="options-outline" />}
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Today's Prayers Card */}
                <GlassCard borderRadius={24} style={styles.card}>
                    <View style={styles.cardContent}>
                        <Text
                            style={[
                                styles.cardTitle,
                                {
                                    color: theme.colors.text,
                                    fontFamily: theme.fontFamilies.inter.semiBold,
                                },
                            ]}
                        >
                            {t('salat.todayPrayers')}
                        </Text>
                        
                        <View style={styles.prayersContainer}>
                            {prayers.map((prayer) => (
                                <SalatChip
                                    key={prayer.key}
                                    name={prayer.label}
                                    status={getChipStatus(todayLog?.[prayer.key])}
                                    onPress={() => cyclePrayerStatus(prayer.key)}
                                />
                            ))}
                        </View>
                    </View>
                </GlassCard>
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        marginBottom: 16,
    },
    cardContent: {
        padding: 20,
        gap: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    prayersContainer: {
        gap: 12,
    },
});
