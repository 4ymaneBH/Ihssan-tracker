// Settings Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useUserPreferencesStore, useAuthStore } from '../store';
import { GoalsModal, SelectionModal, PrayerNotificationsModal } from '../components';
import { getFontFamily } from '../utils';


interface SettingRowProps {
    iconName: string;
    iconColor?: string;
    label: string;
    value?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({
    iconName,
    iconColor,
    label,
    value,
    onPress,
    rightElement,
}) => {
    const { theme } = useTheme();
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const content = (
        <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: (iconColor || theme.colors.primary) + '15' }]}>
                    <MaterialCommunityIcons
                        name={iconName as any}
                        size={20}
                        color={iconColor || theme.colors.primary}
                    />
                </View>
                <Text style={[
                    styles.settingLabel,
                    { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium') }
                ]}>
                    {label}
                </Text>
            </View>
            {rightElement || (
                <View style={styles.settingRight}>
                    {value && (
                        <Text style={[
                            styles.settingValue,
                            { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }
                        ]}>
                            {value}
                        </Text>
                    )}
                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={22}
                        color={theme.colors.textTertiary}
                    />
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};


const SettingsScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const [showGoalsModal, setShowGoalsModal] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [activeModal, setActiveModal] = useState<'language' | 'theme' | null>(null);

    const {
        language,
        notificationsEnabled,
        hideCharityAmounts,
        goals,
        setLanguage,
        setTheme,
        setNotificationsEnabled,
        setHideCharityAmounts,
    } = useUserPreferencesStore();

    const userTheme = useUserPreferencesStore((state) => state.theme);
    const { signOut } = useAuthStore();
    const isArabic = i18n.language === 'ar';

    const getThemeLabel = () => {
        if (userTheme === 'light') return t('onboarding.lightTheme');
        if (userTheme === 'dark') return t('onboarding.darkTheme');
        return 'System';
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
        >
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('settings.title')}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Appearance Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                        Appearance
                    </Text>

                    <SettingRow
                        iconName="translate"
                        iconColor={theme.colors.info.main}
                        label={t('settings.language')}
                        value={language === 'en' ? 'English' : 'العربية'}
                        onPress={() => setActiveModal('language')}
                    />

                    <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

                    <SettingRow
                        iconName={userTheme === 'dark' ? 'weather-night' : 'white-balance-sunny'}
                        iconColor={userTheme === 'dark' ? theme.colors.info.main : theme.colors.warning.main}
                        label={t('settings.theme')}
                        value={getThemeLabel()}
                        onPress={() => setActiveModal('theme')}
                    />
                </View>

                {/* Goals Section - Premium Card */}
                <TouchableOpacity
                    style={[styles.goalsCard, { backgroundColor: theme.colors.surface }]}
                    onPress={() => setShowGoalsModal(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.goalsCardContent}>
                        <View style={[styles.goalsIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                            <MaterialCommunityIcons name="target" size={28} color={theme.colors.primary} />
                        </View>
                        <View style={styles.goalsTextContainer}>
                            <Text style={[styles.goalsTitle, { color: theme.colors.text }]}>
                                {isArabic ? 'أهدافك الأسبوعية' : 'Your Weekly Goals'}
                            </Text>
                            <Text style={[styles.goalsSubtitle, { color: theme.colors.textSecondary }]}>
                                {isArabic
                                    ? `${goals.quranPagesPerDay} صفحات • ${goals.charityPerWeek} صدقات • ${goals.tahajjudNightsPerWeek} ليالي`
                                    : `${goals.quranPagesPerDay} pages • ${goals.charityPerWeek} charity • ${goals.tahajjudNightsPerWeek} nights`}
                            </Text>
                        </View>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={24}
                            color={theme.colors.textTertiary}
                        />
                    </View>
                </TouchableOpacity>

                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                        {t('settings.notifications')}
                    </Text>

                    <SettingRow
                        iconName="bell-outline"
                        iconColor={theme.colors.success.main}
                        label={t('settings.notifications')}
                        rightElement={
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        }
                    />

                    <SettingRow
                        iconName="tune-vertical"
                        iconColor={theme.colors.primary}
                        label={isArabic ? 'تخصيص التنبيهات' : 'Customize Prayers'}
                        onPress={() => setShowNotificationsModal(true)}
                    />
                </View>

                {/* Privacy Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                        {t('settings.privacy')}
                    </Text>

                    <SettingRow
                        iconName="lock-outline"
                        iconColor={theme.colors.error.main}
                        label={t('settings.hideAmounts')}
                        rightElement={
                            <Switch
                                value={hideCharityAmounts}
                                onValueChange={setHideCharityAmounts}
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        }
                    />
                </View>

                {/* About Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                        {t('settings.about')}
                    </Text>

                    <SettingRow
                        iconName="cellphone"
                        label={t('settings.version')}
                        value="1.0.0"
                    />
                </View>

                {/* Account Section */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <SettingRow
                        iconName="logout"
                        iconColor={theme.colors.error.main}
                        label={t('auth.logout')}
                        onPress={signOut}
                    />
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={[styles.appName, { color: theme.colors.primary }]}>
                        {t('common.appName')}
                    </Text>
                    <Text style={[styles.appTagline, { color: theme.colors.textSecondary }]}>
                        {t('onboarding.tagline')}
                    </Text>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Goals Modal */}
            <GoalsModal
                visible={showGoalsModal}
                onClose={() => setShowGoalsModal(false)}
            />

            {/* Notifications Modal */}
            <PrayerNotificationsModal
                visible={showNotificationsModal}
                onClose={() => setShowNotificationsModal(false)}
            />


            {/* Language Modal */}
            <SelectionModal
                visible={activeModal === 'language'}
                onClose={() => setActiveModal(null)}
                title={t('settings.language')}
                options={[
                    { label: 'English', value: 'en', icon: 'ab-testing' },
                    { label: 'العربية', value: 'ar', icon: 'abjad-arabic' },
                ]}
                selectedValue={language}
                onSelect={(val: string) => setLanguage(val as 'en' | 'ar')}
            />

            {/* Theme Modal */}
            <SelectionModal
                visible={activeModal === 'theme'}
                onClose={() => setActiveModal(null)}
                title={t('settings.theme')}
                options={[
                    { label: t('onboarding.lightTheme'), value: 'light', icon: 'white-balance-sunny', iconColor: theme.colors.warning.main },
                    { label: t('onboarding.darkTheme'), value: 'dark', icon: 'weather-night', iconColor: theme.colors.info.main },
                ]}
                selectedValue={userTheme}
                onSelect={(val: string) => setTheme(val as 'light' | 'dark')}
            />

            {/* Theme Modal */}
            <SelectionModal
                visible={activeModal === 'theme'}
                onClose={() => setActiveModal(null)}
                title={t('settings.theme')}
                options={[
                    { label: t('onboarding.lightTheme'), value: 'light', icon: 'white-balance-sunny', iconColor: theme.colors.warning.main },
                    { label: t('onboarding.darkTheme'), value: 'dark', icon: 'weather-night', iconColor: theme.colors.info.main },
                ]}
                selectedValue={userTheme}
                onSelect={(val: string) => setTheme(val as 'light' | 'dark')}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,        paddingBottom: 100,        gap: 16,
    },
    section: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingLabel: {
        fontSize: 16,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    settingValue: {
        fontSize: 15,
    },
    divider: {
        height: 1,
        marginLeft: 64,
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    appName: {
        fontSize: 24,
        fontWeight: '700',
    },
    appTagline: {
        fontSize: 14,
        marginTop: 4,
    },
    bottomSpacer: {
        height: 24,
    },
    // Goals Card Styles
    goalsCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 0,
    },
    goalsCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    goalsIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalsTextContainer: {
        flex: 1,
    },
    goalsTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    goalsSubtitle: {
        fontSize: 13,
        marginTop: 4,
    },
});

export default SettingsScreen;
