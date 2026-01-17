// Settings Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useUserPreferencesStore } from '../store';

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
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                    {label}
                </Text>
            </View>
            {rightElement || (
                <View style={styles.settingRight}>
                    {value && (
                        <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
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
    const {
        language,
        notificationsEnabled,
        hideCharityAmounts,
        setLanguage,
        setTheme,
        setNotificationsEnabled,
        setHideCharityAmounts,
    } = useUserPreferencesStore();

    const userTheme = useUserPreferencesStore((state) => state.theme);

    const handleLanguageChange = () => {
        Alert.alert(
            t('settings.language'),
            '',
            [
                {
                    text: 'English',
                    onPress: () => setLanguage('en'),
                },
                {
                    text: 'العربية',
                    onPress: () => setLanguage('ar'),
                },
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
            ]
        );
    };

    const handleThemeChange = () => {
        Alert.alert(
            t('settings.theme'),
            '',
            [
                {
                    text: t('onboarding.lightTheme'),
                    onPress: () => setTheme('light'),
                },
                {
                    text: t('onboarding.darkTheme'),
                    onPress: () => setTheme('dark'),
                },
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
            ]
        );
    };

    const getThemeLabel = () => {
        if (userTheme === 'light') return t('onboarding.lightTheme');
        if (userTheme === 'dark') return t('onboarding.darkTheme');
        return 'System';
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
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
                        onPress={handleLanguageChange}
                    />

                    <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

                    <SettingRow
                        iconName={userTheme === 'dark' ? 'weather-night' : 'white-balance-sunny'}
                        iconColor={userTheme === 'dark' ? theme.colors.info.main : theme.colors.warning.main}
                        label={t('settings.theme')}
                        value={getThemeLabel()}
                        onPress={handleThemeChange}
                    />
                </View>

                {/* Notifications Section */}
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

                    <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

                    <SettingRow
                        iconName="moon-waning-crescent"
                        iconColor={theme.colors.info.main}
                        label={t('settings.quietHours')}
                        value="22:00 - 06:00"
                        onPress={() => { }}
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
                        iconName="information-outline"
                        label={t('settings.about')}
                        onPress={() => { }}
                    />

                    <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

                    <SettingRow
                        iconName="cellphone"
                        label={t('settings.version')}
                        value="1.0.0"
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
        paddingHorizontal: 16,
        gap: 16,
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
});

export default SettingsScreen;
