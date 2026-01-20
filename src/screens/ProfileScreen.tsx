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
import { useTheme } from '../context';
import { useUserPreferencesStore } from '../store';
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

    const [name, setName] = useState(displayName);
    const [selectedAvatar, setSelectedAvatar] = useState<IconName>(avatarId as IconName);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        setProfile(name, selectedAvatar);
        setIsEditing(false);
    };

    const handleLanguageToggle = async () => {
        await setLanguage(language === 'en' ? 'ar' : 'en');
    };

    const handleThemeToggle = () => {
        setThemePreference(themePreference === 'light' ? 'dark' : 'light');
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
                <Text style={[
                    styles.headerTitle,
                    { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }
                ]}>
                    {isArabic ? 'الملف الشخصي' : 'Profile'}
                </Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Avatar Section */}
                <View style={[styles.avatarSection, { backgroundColor: theme.colors.surface }]}>
                    <View
                        style={[
                            styles.currentAvatar,
                            { backgroundColor: theme.colors.primaryLight },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={selectedAvatar}
                            size={64}
                            color={theme.colors.primary}
                        />
                    </View>

                    {/* Name */}
                    {isEditing ? (
                        <TextInput
                            style={[
                                styles.nameInput,
                                {
                                    color: theme.colors.text,
                                    borderColor: theme.colors.border,
                                    backgroundColor: theme.colors.background,
                                },
                            ]}
                            value={name}
                            onChangeText={setName}
                            placeholder={isArabic ? 'اسمك' : 'Your name'}
                            placeholderTextColor={theme.colors.textTertiary}
                            textAlign={isArabic ? 'right' : 'left'}
                        />
                    ) : (
                        <Text style={[styles.displayName, { color: theme.colors.text }]}>
                            {displayName || (isArabic ? 'اضغط للتعديل' : 'Tap to edit')}
                        </Text>
                    )}

                    {/* Edit/Save Button */}
                    <TouchableOpacity
                        style={[
                            styles.editButton,
                            {
                                backgroundColor: isEditing
                                    ? theme.colors.primary
                                    : theme.colors.background,
                                borderColor: theme.colors.border,
                            },
                        ]}
                        onPress={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        <MaterialCommunityIcons
                            name={isEditing ? 'check' : 'pencil'}
                            size={18}
                            color={isEditing ? theme.colors.onPrimary : theme.colors.primary}
                        />
                        <Text
                            style={[
                                styles.editButtonText,
                                {
                                    color: isEditing ? theme.colors.onPrimary : theme.colors.primary,
                                },
                            ]}
                        >
                            {isEditing
                                ? isArabic ? 'حفظ' : 'Save'
                                : isArabic ? 'تعديل' : 'Edit'}
                        </Text>
                    </TouchableOpacity>
                </View>

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
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        {isArabic ? 'الإعدادات السريعة' : 'Quick Settings'}
                    </Text>

                    {/* Language Toggle */}
                    <TouchableOpacity
                        style={[styles.settingRow, { borderBottomColor: theme.colors.divider }]}
                        onPress={handleLanguageToggle}
                    >
                        <View style={styles.settingInfo}>
                            <MaterialCommunityIcons
                                name="translate"
                                size={22}
                                color={theme.colors.primary}
                            />
                            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                {isArabic ? 'اللغة' : 'Language'}
                            </Text>
                        </View>
                        <View style={[styles.settingValue, { backgroundColor: theme.colors.background }]}>
                            <Text style={[styles.settingValueText, { color: theme.colors.primary }]}>
                                {language === 'en' ? 'English' : 'العربية'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Theme Toggle */}
                    <TouchableOpacity style={styles.settingRow} onPress={handleThemeToggle}>
                        <View style={styles.settingInfo}>
                            <MaterialCommunityIcons
                                name={themePreference === 'dark' ? 'weather-night' : 'white-balance-sunny'}
                                size={22}
                                color={theme.colors.primary}
                            />
                            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                                {isArabic ? 'المظهر' : 'Theme'}
                            </Text>
                        </View>
                        <View style={[styles.settingValue, { backgroundColor: theme.colors.background }]}>
                            <Text style={[styles.settingValueText, { color: theme.colors.primary }]}>
                                {themePreference === 'dark'
                                    ? isArabic ? 'داكن' : 'Dark'
                                    : isArabic ? 'فاتح' : 'Light'}
                            </Text>
                        </View>
                    </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    // Avatar section
    avatarSection: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 20,
        gap: 16,
    },
    currentAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    displayName: {
        fontSize: 22,
        fontWeight: '600',
    },
    nameInput: {
        fontSize: 18,
        fontWeight: '500',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '100%',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    // Section
    section: {
        padding: 20,
        borderRadius: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    // Avatar grid
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    avatarOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    // Settings
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 16,
    },
    settingValue: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    settingValueText: {
        fontSize: 14,
        fontWeight: '500',
    },
    bottomSpacer: {
        height: 24,
    },
});

export default ProfileScreen;
