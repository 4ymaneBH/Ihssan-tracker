// Settings Screen - Premium Redesign
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    I18nManager,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useUserPreferencesStore, useAuthStore } from '../store';
import { GoalsModal, SelectionModal, PrayerNotificationsModal } from '../components';
import { getFontFamily } from '../utils';


// ── Row (iOS-style list item) ─────────────────────────────
interface RowProps {
    icon: string;
    iconBg: string;
    iconColor: string;
    label: string;
    value?: string;
    onPress?: () => void;
    rightNode?: React.ReactNode;
    hideChevron?: boolean;
    destructive?: boolean;
}

const Row: React.FC<RowProps> = ({
    icon, iconBg, iconColor, label, value,
    onPress, rightNode, hideChevron = false, destructive = false,
}) => {
    const { theme } = useTheme();
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const inner = (
        <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
                <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
            </View>
            <Text numberOfLines={1} style={[styles.rowLabel, {
                color: destructive ? theme.colors.error.main : theme.colors.text,
                fontFamily: getFontFamily(isArabic, 'medium'),
                flex: 1,
            }]}>
                {label}
            </Text>
            <View style={styles.rowRight}>
                {rightNode ?? (
                    <>
                        {value ? (
                            <Text style={[styles.rowValue, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                {value}
                            </Text>
                        ) : null}
                        {!hideChevron && (
                            <MaterialCommunityIcons
                                name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                                size={20}
                                color={theme.colors.textTertiary}
                            />
                        )}
                    </>
                )}
            </View>
        </View>
    );

    return onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>{inner}</TouchableOpacity>
    ) : inner;
};

// ── Card wrapper ──────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder }]}>
            {children}
        </View>
    );
};

const Divider: React.FC = () => {
    const { theme } = useTheme();
    return <View style={[styles.divider, { backgroundColor: theme.colors.borderLight }]} />;
};


const SettingsScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, isDark } = useTheme();
    const isArabic = i18n.language === 'ar';

    const [showGoalsModal, setShowGoalsModal] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const { language, setLanguage, setTheme } = useUserPreferencesStore();
    const userTheme = useUserPreferencesStore((state) => state.theme);
    const goals = useUserPreferencesStore((state) => state.goals);
    const { signOut } = useAuthStore();

    // 3-way theme toggle
    const themeOptions: { value: 'system' | 'light' | 'dark'; icon: string }[] = [
        { value: 'system', icon: 'theme-light-dark' },
        { value: 'dark',   icon: 'weather-night' },
        { value: 'light',  icon: 'white-balance-sunny' },
    ];

    const ThemeSegment = () => (
        <View style={[styles.segmentWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}>
            {themeOptions.map((opt) => {
                const active = userTheme === opt.value || (!userTheme && opt.value === 'system');
                return (
                    <TouchableOpacity
                        key={opt.value}
                        style={[styles.segmentItem, active && { backgroundColor: theme.colors.primary }]}
                        onPress={() => setTheme(opt.value as 'light' | 'dark')}
                    >
                        <MaterialCommunityIcons
                            name={opt.icon as any}
                            size={18}
                            color={active ? theme.colors.onPrimary : theme.colors.textSecondary}
                        />
                        {active && (
                            <MaterialCommunityIcons name="check" size={13} color={theme.colors.onPrimary} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    const socials: { icon: string; bg: string; url: string }[] = [
        { icon: 'youtube',   bg: '#FF0000', url: 'https://youtube.com' },
        { icon: 'instagram', bg: '#E1306C', url: 'https://instagram.com' },
        { icon: 'facebook',  bg: '#1877F2', url: 'https://facebook.com' },
        { icon: 'whatsapp',  bg: '#25D366', url: 'https://whatsapp.com' },
    ];

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
        >
            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={{ width: 36 }} />
                <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {t('settings.title')}
                </Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Notifications + Language ── */}
                <Card>
                    <Row
                        icon="bell"
                        iconBg={theme.colors.primary + '20'}
                        iconColor={theme.colors.primary}
                        label={isArabic ? 'إشعارات و تذكيرات' : 'Notifications & Reminders'}
                        onPress={() => setShowNotificationsModal(true)}
                    />
                    <Divider />
                    <Row
                        icon="web"
                        iconBg={theme.colors.info.main + '20'}
                        iconColor={theme.colors.info.main}
                        label={t('settings.language')}
                        onPress={() => setShowLanguageModal(true)}
                        rightNode={
                            <View style={styles.langRight}>
                                <Text style={[styles.rowValue, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                    {language === 'ar' ? 'العربية' : 'English'}
                                </Text>
                                <MaterialCommunityIcons name="chevron-down" size={18} color={theme.colors.textTertiary} />
                            </View>
                        }
                    />
                </Card>

                {/* ── Theme inline toggle ── */}
                <Card>
                    <View style={styles.row}>
                        <View style={[styles.rowIcon, { backgroundColor: theme.colors.warning.main + '20' }]}>
                            <MaterialCommunityIcons name="brightness-6" size={20} color={theme.colors.warning.main} />
                        </View>
                        <Text style={[styles.rowLabel, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium'), flex: 1 }]}>
                            {isArabic ? 'الوضع' : 'Appearance'}
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
                        <ThemeSegment />
                    </View>
                </Card>

                {/* ── Goals ── */}
                <TouchableOpacity
                    style={[styles.goalsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder }]}
                    onPress={() => setShowGoalsModal(true)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.rowIcon, { backgroundColor: theme.colors.primary + '18', width: 48, height: 48, borderRadius: 14 }]}>
                        <MaterialCommunityIcons name="target" size={26} color={theme.colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.goalsTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {isArabic ? 'أهدافك الأسبوعية' : 'Your Weekly Goals'}
                        </Text>
                        <Text style={[styles.goalsSubtitle, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                            {isArabic
                                ? `${goals.quranPagesPerDay} صفحات • ${goals.tahajjudNightsPerWeek} ليالي`
                                : `${goals.quranPagesPerDay} pages • ${goals.tahajjudNightsPerWeek} nights`}
                        </Text>
                    </View>
                    <MaterialCommunityIcons
                        name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                        size={22}
                        color={theme.colors.textTertiary}
                    />
                </TouchableOpacity>

                {/* ── Help & Support ── */}
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                    {isArabic ? 'المساعدة والدعم' : 'Help & Support'}
                </Text>

                <Card>
                    <Row
                        icon="cellphone-information"
                        iconBg="#A78BFA20"
                        iconColor="#A78BFA"
                        label={isArabic ? 'استعمال التطبيق' : 'How to Use'}
                        onPress={() => {}}
                    />
                    <Divider />
                    <Row
                        icon="hand-heart"
                        iconBg="#F472B620"
                        iconColor="#F472B6"
                        label={isArabic ? 'ادعم التطبيق' : 'Support the App'}
                        onPress={() => {}}
                    />
                    <Divider />
                    <Row
                        icon="message-text-outline"
                        iconBg={theme.colors.info.main + '20'}
                        iconColor={theme.colors.info.main}
                        label={isArabic ? 'اتصل بنا' : 'Contact Us'}
                        onPress={() => Linking.openURL('mailto:support@ihssan.app')}
                    />
                    <Divider />
                    <Row
                        icon="shield-check-outline"
                        iconBg={theme.colors.success.main + '20'}
                        iconColor={theme.colors.success.main}
                        label={isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
                        onPress={() => Linking.openURL('https://ihssan.app/privacy')}
                    />
                </Card>

                {/* ── Sign out ── */}
                <Card>
                    <Row
                        icon="logout-variant"
                        iconBg={theme.colors.error.main + '15'}
                        iconColor={theme.colors.error.main}
                        label={t('auth.logout')}
                        hideChevron
                        destructive
                        onPress={signOut}
                    />
                </Card>

                {/* ── Follow us ── */}
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                    {isArabic ? 'تابعنا' : 'Follow Us'}
                </Text>

                <View style={styles.socialsRow}>
                    {socials.map((s) => (
                        <TouchableOpacity
                            key={s.icon}
                            style={[styles.socialBtn, { backgroundColor: s.bg }]}
                            onPress={() => Linking.openURL(s.url)}
                            activeOpacity={0.8}
                        >
                            <MaterialCommunityIcons name={s.icon as any} size={26} color="#FFFFFF" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── Footer ── */}
                <View style={styles.footer}>
                    <Text style={[styles.footerVersion, { color: theme.colors.textTertiary }]}>v1.0.4</Text>
                    <Text style={[styles.footerCopy, { color: theme.colors.textTertiary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                        {isArabic ? '© 2025 وذكر. جميع الحقوق محفوظة.' : '© 2025 Ihssan. All rights reserved.'}
                    </Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <GoalsModal visible={showGoalsModal} onClose={() => setShowGoalsModal(false)} />
            <PrayerNotificationsModal visible={showNotificationsModal} onClose={() => setShowNotificationsModal(false)} />
            <SelectionModal
                visible={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                title={t('settings.language')}
                options={[
                    { label: 'English', value: 'en', icon: 'ab-testing' },
                    { label: 'العربية', value: 'ar', icon: 'abjad-arabic' },
                ]}
                selectedValue={language}
                onSelect={(val: string) => { setLanguage(val as 'en' | 'ar'); setShowLanguageModal(false); }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
    },

    // Scroll
    scrollView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 4,
        gap: 10,
    },

    // Card
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },

    // Row
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 13,
        gap: 12,
    },
    rowIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: { fontSize: 15 },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rowValue: { fontSize: 14 },
    langRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },

    // Divider inside card
    divider: { height: StyleSheet.hairlineWidth, marginLeft: 64 },

    // 3-way segment
    segmentWrap: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        gap: 4,
    },
    segmentItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 10,
        borderRadius: 9,
    },

    // Goals card
    goalsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
    },
    goalsTitle: { fontSize: 16 },
    goalsSubtitle: { fontSize: 13, marginTop: 2 },

    // Section labels
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        paddingHorizontal: 4,
    },

    // Social
    socialsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        paddingVertical: 4,
    },
    socialBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 4,
    },

    // Footer
    footer: {
        alignItems: 'center',
        paddingTop: 8,
        gap: 4,
    },
    footerVersion: { fontSize: 13, fontWeight: '600' },
    footerCopy: { fontSize: 12 },
});

export default SettingsScreen;
