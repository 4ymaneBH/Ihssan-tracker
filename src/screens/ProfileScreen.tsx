// Profile Screen - User profile with name, avatar, and settings
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context';
import { useUserPreferencesStore, useAuthStore } from '../store';
import { getFontFamily } from '../utils';


// Preset avatars using MaterialCommunityIcons
const AVATAR_OPTIONS = [
    'account-circle',
    'account',
    'face-man',
    'face-woman',
    'account-cowboy-hat',
    'account-tie',
    'face-man-shimmer',
    'account-heart',
    'emoticon-happy',
    'emoticon-cool',
    'star-circle',
    'moon-waning-crescent',
] as const;

type IconName = typeof AVATAR_OPTIONS[number];

const ProfileScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const isArabic = i18n.language === 'ar';

    // Use individual selectors to avoid creating new objects on every render
    const displayName = useUserPreferencesStore((state) => state.displayName) || '';
    const avatarId = useUserPreferencesStore((state) => state.avatarId) || 'account-circle';
    const language = useUserPreferencesStore((state) => state.language);
    const themePreference = useUserPreferencesStore((state) => state.theme);
    const setProfile = useUserPreferencesStore((state) => state.setProfile);
    const setLanguage = useUserPreferencesStore((state) => state.setLanguage);
    const setThemePreference = useUserPreferencesStore((state) => state.setTheme);

    const { user, updateProfile } = useAuthStore();
    // Default to auth user name if available, otherwise prefs name
    const [name, setName] = useState(user?.name || displayName);
    const [selectedAvatar, setSelectedAvatar] = useState<IconName>(avatarId as IconName);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        setProfile(name, selectedAvatar); // Keep legacy updated just in case
        if (user) {
            await updateProfile(name);
        }
        setIsEditing(false);
    };

    const handleLanguageToggle = async () => {
        await setLanguage(language === 'en' ? 'ar' : 'en');
    };

    const handleThemeToggle = () => {
        setThemePreference(themePreference === 'light' ? 'dark' : 'light');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder, borderWidth: 1 }]} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={20} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {isArabic ? 'الملف الشخصي' : 'Profile'}
                </Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Hero Avatar Section */}
                <LinearGradient
                    colors={[theme.colors.primary + '30', theme.colors.primary + '08']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.heroCard, { borderColor: theme.colors.primary + '30' }]}
                >
                    <View style={[styles.avatarRing, { borderColor: theme.colors.primary }]}>
                        <View style={[styles.currentAvatar, { backgroundColor: theme.colors.primaryLight }]}>
                            <MaterialCommunityIcons name={selectedAvatar} size={56} color={theme.colors.primary} />
                        </View>
                    </View>

                    {isEditing ? (
                        <TextInput
                            style={[styles.nameInput, { color: theme.colors.text, borderColor: theme.colors.primary + '60', backgroundColor: theme.colors.surface }]}
                            value={name}
                            onChangeText={setName}
                            placeholder={isArabic ? 'اسمك' : 'Your name'}
                            placeholderTextColor={theme.colors.textTertiary}
                            textAlign={isArabic ? 'right' : 'left'}
                        />
                    ) : (
                        <View style={{ alignItems: 'center', gap: 4 }}>
                            <Text style={[styles.displayName, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                {user?.name || displayName || (isArabic ? 'صديق إحسان' : 'Ihssan Friend')}
                            </Text>
                            {user?.email && (
                                <Text style={[styles.email, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                    {user.email}
                                </Text>
                            )}
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.editButton, { backgroundColor: isEditing ? theme.colors.primary : theme.colors.surface, borderColor: isEditing ? theme.colors.primary : theme.colors.cardBorder, borderWidth: 1 }]}
                        onPress={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        <MaterialCommunityIcons name={isEditing ? 'check' : 'pencil-outline'} size={16} color={isEditing ? theme.colors.onPrimary : theme.colors.primary} />
                        <Text style={[styles.editButtonText, { color: isEditing ? theme.colors.onPrimary : theme.colors.primary, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                            {isEditing ? (isArabic ? 'حفظ' : 'Save') : (isArabic ? 'تعديل' : 'Edit')}
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Avatar Picker */}
                {isEditing && (
                    <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            {isArabic ? 'اختر صورة' : 'Choose Avatar'}
                        </Text>
                        <View style={styles.avatarGrid}>
                            {AVATAR_OPTIONS.map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[
                                        styles.avatarOption,
                                        {
                                            backgroundColor:
                                                selectedAvatar === icon
                                                    ? theme.colors.primaryLight
                                                    : theme.colors.background,
                                            borderColor:
                                                selectedAvatar === icon
                                                    ? theme.colors.primary
                                                    : theme.colors.border,
                                        },
                                    ]}
                                    onPress={() => setSelectedAvatar(icon)}
                                >
                                    <MaterialCommunityIcons
                                        name={icon}
                                        size={32}
                                        color={
                                            selectedAvatar === icon
                                                ? theme.colors.primary
                                                : theme.colors.textSecondary
                                        }
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Quick Settings */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.cardBorder }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                        {isArabic ? 'الإعدادات السريعة' : 'Quick Settings'}
                    </Text>

                    {/* Social Groups */}
                    <TouchableOpacity
                        style={[styles.settingRow, { borderBottomColor: theme.colors.borderLight }]}
                        onPress={() => navigation.navigate('Social' as never)}
                    >
                        <View style={[styles.settingIconBox, { backgroundColor: theme.colors.primary + '18' }]}>
                            <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.settingLabel, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium'), flex: 1 }]}>
                            {t('social.title', 'Social Groups')}
                        </Text>
                        <MaterialCommunityIcons name={isArabic ? 'chevron-left' : 'chevron-right'} size={20} color={theme.colors.textTertiary} />
                    </TouchableOpacity>

                    {/* Language Toggle */}
                    <TouchableOpacity
                        style={[styles.settingRow, { borderBottomColor: theme.colors.borderLight }]}
                        onPress={handleLanguageToggle}
                    >
                        <View style={[styles.settingIconBox, { backgroundColor: theme.colors.info.main + '18' }]}>
                            <MaterialCommunityIcons name="translate" size={20} color={theme.colors.info.main} />
                        </View>
                        <Text style={[styles.settingLabel, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium'), flex: 1 }]}>
                            {isArabic ? 'اللغة' : 'Language'}
                        </Text>
                        <View style={[styles.settingValuePill, { backgroundColor: theme.colors.info.main + '15' }]}>
                            <Text style={[styles.settingValueText, { color: theme.colors.info.main, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                                {language === 'en' ? 'EN' : 'عر'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Theme Toggle */}
                    <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} onPress={handleThemeToggle}>
                        <View style={[styles.settingIconBox, { backgroundColor: theme.colors.warning.main + '18' }]}>
                            <MaterialCommunityIcons name={themePreference === 'dark' ? 'weather-night' : 'white-balance-sunny'} size={20} color={theme.colors.warning.main} />
                        </View>
                        <Text style={[styles.settingLabel, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium'), flex: 1 }]}>
                            {isArabic ? 'المظهر' : 'Appearance'}
                        </Text>
                        <View style={[styles.settingValuePill, { backgroundColor: theme.colors.warning.main + '15' }]}>
                            <Text style={[styles.settingValueText, { color: theme.colors.warning.main, fontFamily: getFontFamily(isArabic, 'semiBold') }]}>
                                {themePreference === 'dark' ? (isArabic ? 'ليلي' : 'Dark') : (isArabic ? 'نهاري' : 'Light')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '600' },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, gap: 14, paddingBottom: 24 },
    // Hero card
    heroCard: {
        alignItems: 'center',
        padding: 28,
        borderRadius: 20,
        borderWidth: 1,
        gap: 14,
    },
    avatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentAvatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    displayName: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
    email: { fontSize: 13 },
    nameInput: {
        fontSize: 17,
        fontWeight: '500',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 11,
        width: '100%',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 20,
    },
    editButtonText: { fontSize: 14 },
    // Section
    section: { padding: 20, borderRadius: 18 },
    sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 14 },
    // Avatar grid
    avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
    avatarOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    // Settings rows
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 12,
    },
    settingIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingLabel: { fontSize: 15 },
    settingValuePill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    settingValueText: { fontSize: 13, fontWeight: '500' },
    bottomSpacer: { height: 24 },
});

export default ProfileScreen;
