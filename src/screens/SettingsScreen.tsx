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
import { LinearGradient } from 'expo-linear-gradient';


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
    const themeOptions: { value: 'system' | 'light' | 'dark'; icon: string; label: string }[] = [
        { value: 'system', icon: 'theme-light-dark',    label: isArabic ? 'تلقائي' : 'Auto'  },
        { value: 'dark',   icon: 'weather-night',       label: isArabic ? 'ليلي'   : 'Night' },
        { value: 'light',  icon: 'white-balance-sunny', label: isArabic ? 'نهاري'  : 'Day'   },
    ];

    const ThemeSegment = () => (
        <View style={[styles.segmentWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]}>
            {themeOptions.map((opt) => {
                const active = userTheme === opt.value || (!userTheme && opt.value === 'system');
                return (
                    <TouchableOpacity
                        key={opt.value}
                        style={[
                            styles.segmentItem,
                            active && [styles.segmentItemActive, { shadowColor: isDark ? '#000' : theme.colors.primary }],
                        ]}
                        onPress={() => setTheme(opt.value as 'light' | 'dark')}
                    >
                        <MaterialCommunityIcons
                            name={opt.icon as any}
                            size={17}
                            color={active ? theme.colors.primary : theme.colors.textSecondary}
                        />
                        <Text style={[styles.segmentLabel, {
                            color: active ? theme.colors.primary : theme.colors.textSecondary,
                            fontFamily: getFontFamily(isArabic, active ? 'semiBold' : 'regular'),
                        }]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    const socials: { icon: string; bg: string; url: string; label: string }[] = [
        { icon: 'youtube',   bg: '#FF0000', url: 'https://youtube.com',   label: 'YouTube'   },
        { icon: 'instagram', bg: '#E1306C', url: 'https://instagram.com', label: 'Instagram' },
        { icon: 'facebook',  bg: '#1877F2', url: 'https://facebook.com',  label: 'Facebook'  },
        { icon: 'whatsapp',  bg: '#25D366', url: 'https://whatsapp.com',  label: 'WhatsApp'  },
    ];

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: 'transparent' }]}
        >
            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={[styles.headerDot, { backgroundColor: theme.colors.primary }]} />
                <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {t('settings.title')}
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Profile Banner ── */}
                <LinearGradient
                    colors={[theme.colors.primary + '28', theme.colors.primary + '06']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.profileBanner, { borderColor: theme.colors.primary + '30' }]}
                >
                    <View style={[styles.profileAvatar, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.profileInitial, { color: theme.colors.onPrimary, fontFamily: getFontFamily(true, 'bold') }]}>إ</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.profileName, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {isArabic ? 'إحسان' : 'Ihssan'}
                        </Text>
                        <Text style={[styles.profileSub, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                            {isArabic ? 'رحلتك نحو الإتقان' : 'Your path to excellence'}
                        </Text>
                    </View>
                    <View style={[styles.versionPill, { backgroundColor: theme.colors.primary + '22' }]}>
                        <Text style={[styles.versionPillText, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                            v1.0.4
                        </Text>
                    </View>
                </LinearGradient>

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
                <TouchableOpacity onPress={() => setShowGoalsModal(true)} activeOpacity={0.85}>
                    <LinearGradient
                        colors={isDark
                            ? [theme.colors.primary + '30', theme.colors.primary + '10']
                            : [theme.colors.primary + '25', theme.colors.primary + '08']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.goalsCard, { borderColor: theme.colors.primary + '40' }]}
                    >
                        <View style={styles.goalsHeader}>
                            <MaterialCommunityIcons name="star-four-points" size={16} color={theme.colors.primary} />
                            <Text style={[styles.goalsHeaderText, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                {isArabic ? 'أهدافك الأسبوعية' : 'Weekly Goals'}
                            </Text>
                            <MaterialCommunityIcons name="pencil-outline" size={15} color={theme.colors.primary + 'CC'} />
                        </View>
                        <View style={styles.goalsStatsRow}>
                            <View style={[styles.goalsStat, { backgroundColor: theme.colors.primary + '22' }]}>
                                <Text style={[styles.goalsStatNum, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                    {goals.quranPagesPerDay}
                                </Text>
                                <Text style={[styles.goalsStatLbl, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                    {isArabic ? 'صفحة/يوم' : 'pages/day'}
                                </Text>
                            </View>
                            <View style={[styles.goalsStat, { backgroundColor: '#A78BFA22' }]}>
                                <Text style={[styles.goalsStatNum, { color: '#A78BFA', fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                    {goals.tahajjudNightsPerWeek}
                                </Text>
                                <Text style={[styles.goalsStatLbl, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                    {isArabic ? 'تهجد' : 'tahajjud'}
                                </Text>
                            </View>
                            <View style={[styles.goalsStat, { backgroundColor: '#FB923C22' }]}>
                                <Text style={[styles.goalsStatNum, { color: '#FB923C', fontFamily: getFontFamily(isArabic, 'bold') }]}>5</Text>
                                <Text style={[styles.goalsStatLbl, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                    {isArabic ? 'صلوات' : 'prayers'}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* ── Help & Support ── */}
                <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                    {isArabic ? 'المساعدة والدعم' : 'Help & Support'}
                </Text>

                <View style={styles.helpGrid}>
                    {([
                        { icon: 'cellphone-information', bg: '#A78BFA20', color: '#A78BFA', label: isArabic ? 'كيفية الاستخدام' : 'How to Use',  onPress: () => {} },
                        { icon: 'hand-heart',            bg: '#F472B620', color: '#F472B6', label: isArabic ? 'ادعم التطبيق'    : 'Support App', onPress: () => {} },
                        { icon: 'message-text-outline',  bg: theme.colors.info.main    + '20', color: theme.colors.info.main,    label: isArabic ? 'اتصل بنا'  : 'Contact Us', onPress: () => Linking.openURL('mailto:support@ihssan.app') },
                        { icon: 'shield-check-outline',  bg: theme.colors.success.main + '20', color: theme.colors.success.main, label: isArabic ? 'الخصوصية' : 'Privacy',     onPress: () => Linking.openURL('https://ihssan.app/privacy') },
                    ] as const).map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[styles.helpCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder }]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.helpCardIcon, { backgroundColor: item.bg }]}>
                                <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
                            </View>
                            <Text style={[styles.helpCardLabel, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium') }]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── Sign out ── */}
                <TouchableOpacity
                    style={[styles.signOutBtn, { borderColor: theme.colors.error.main + '50' }]}
                    onPress={signOut}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="logout-variant" size={18} color={theme.colors.error.main} />
                    <Text style={[styles.signOutText, { color: theme.colors.error.main, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                        {t('auth.logout')}
                    </Text>
                </TouchableOpacity>

                {/* ── Follow us ── */}
                <Card>
                    <Text style={[styles.socialsCardTitle, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                        {isArabic ? 'تابعنا على وسائل التواصل' : 'Follow us on social media'}
                    </Text>
                    <View style={styles.socialsRow}>
                        {socials.map((s) => (
                            <TouchableOpacity
                                key={s.icon}
                                style={styles.socialItem}
                                onPress={() => Linking.openURL(s.url)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.socialBtn, { backgroundColor: s.bg }]}>
                                    <MaterialCommunityIcons name={s.icon as any} size={24} color="#FFFFFF" />
                                </View>
                                <Text style={[styles.socialLabel, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                    {s.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                {/* ── Footer ── */}
                <View style={styles.footer}>
                    <MaterialCommunityIcons name="star-crescent" size={22} color={theme.colors.primary + '70'} />
                    <Text style={[styles.footerAppName, { color: theme.colors.primary + 'BB', fontFamily: getFontFamily(true, 'bold') }]}>
                        إحسان
                    </Text>
                    <Text style={[styles.footerCopy, { color: theme.colors.textTertiary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                        {isArabic ? '© 2025 جميع الحقوق محفوظة' : '© 2025 All rights reserved'}
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
        paddingTop: 14,
        paddingBottom: 10,
        gap: 10,
    },
    headerDot: { width: 8, height: 8, borderRadius: 4 },
    headerTitle: { fontSize: 22, fontWeight: '700' },

    // Scroll
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingTop: 4, gap: 10 },

    // Profile Banner
    profileBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
    },
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitial: { fontSize: 22 },
    profileName: { fontSize: 17, fontWeight: '700' },
    profileSub: { fontSize: 13, marginTop: 2 },
    versionPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    versionPillText: { fontSize: 12, fontWeight: '600' },

    // Card
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },

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
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    rowValue: { fontSize: 14 },
    langRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },

    // Divider
    divider: { height: StyleSheet.hairlineWidth, marginLeft: 64 },

    // 3-way segment — floating white pill on active
    segmentWrap: { flexDirection: 'row', borderRadius: 12, padding: 4, gap: 4 },
    segmentItem: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        paddingVertical: 9,
        borderRadius: 9,
    },
    segmentItemActive: {
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    segmentLabel: { fontSize: 11, fontWeight: '500' },

    // Goals card (LinearGradient child)
    goalsCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
    goalsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    goalsHeaderText: { fontSize: 15, flex: 1 },
    goalsStatsRow: { flexDirection: 'row', gap: 8 },
    goalsStat: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
    goalsStatNum: { fontSize: 22, fontWeight: '700' },
    goalsStatLbl: { fontSize: 11, marginTop: 2, textAlign: 'center' },

    // Section labels
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        paddingHorizontal: 4,
    },

    // Help — 2×2 grid
    helpGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    helpCard: { width: '48%', borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
    helpCardIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpCardLabel: { fontSize: 13, fontWeight: '500' },

    // Sign out — full-width outlined button
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 14,
    },
    signOutText: { fontSize: 15 },

    // Social — inside card with labels
    socialsCardTitle: {
        fontSize: 13,
        textAlign: 'center',
        paddingTop: 14,
        paddingBottom: 10,
        paddingHorizontal: 16,
    },
    socialsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    socialItem: { alignItems: 'center', gap: 6 },
    socialBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    socialLabel: { fontSize: 11 },

    // Footer
    footer: { alignItems: 'center', paddingTop: 8, gap: 4 },
    footerAppName: { fontSize: 16, fontWeight: '700' },
    footerCopy: { fontSize: 12 },
});

export default SettingsScreen;
