// Settings Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context';
import { useUserPreferencesStore } from '../store';

interface SettingRowProps {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({
    icon,
    label,
    value,
    onPress,
    rightElement,
}) => {
    const { theme } = useTheme();

    const content = (
        <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>{icon}</Text>
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
                    <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>
                        ›
                    </Text>
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
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
                        icon="🌐"
                        label={t('settings.language')}
                        value={language === 'en' ? 'English' : 'العربية'}
                        onPress={handleLanguageChange}
                    />

                    <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

                    <SettingRow
                        icon={userTheme === 'dark' ? '🌙' : '☀️'}
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
                        icon="🔔"
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
                        icon="🌙"
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
                        icon="🔒"
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
                        icon="ℹ️"
                        label={t('settings.about')}
                        onPress={() => { }}
                    />

                    <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />

                    <SettingRow
                        icon="📱"
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
    settingIcon: {
        fontSize: 22,
    },
    settingLabel: {
        fontSize: 16,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        fontSize: 16,
    },
    chevron: {
        fontSize: 22,
        fontWeight: '300',
    },
    divider: {
        height: 1,
        marginLeft: 50,
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
