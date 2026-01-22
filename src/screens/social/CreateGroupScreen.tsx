import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context';
import { useSocialStore } from '../../store';
import { getFontFamily } from '../../utils';

const CreateGroupScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { createGroup } = useSocialStore();

    const [groupName, setGroupName] = useState('');
    const [nickname, setNickname] = useState('');
    const [target, setTarget] = useState('20');

    const isArabic = i18n.language === 'ar';

    const handleCreate = () => {
        if (!groupName || !nickname) return;

        createGroup(
            groupName,
            nickname,
            'quran_pages', // Default for now
            parseInt(target) || 20,
            'daily'
        );

        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('social.createGroup', 'Create Group')}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        {t('social.groupName', 'Group Name')}
                    </Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                        placeholder={t('social.groupNamePlaceholder', 'e.g. Ramadan Readers')}
                        placeholderTextColor={theme.colors.textTertiary}
                        value={groupName}
                        onChangeText={setGroupName}
                        textAlign={isArabic ? 'right' : 'left'}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        {t('social.nickname', 'Your Nickname')}
                    </Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                        placeholder={t('social.nicknamePlaceholder', 'How others will see you')}
                        placeholderTextColor={theme.colors.textTertiary}
                        value={nickname}
                        onChangeText={setNickname}
                        textAlign={isArabic ? 'right' : 'left'}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        {t('social.target', 'Daily Goal')}
                    </Text>
                    <View style={[styles.targetContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <MaterialCommunityIcons name="book-open-page-variant" size={24} color={theme.colors.primary} style={{ marginRight: 10 }} />
                        <TextInput
                            style={[styles.targetInput, { color: theme.colors.text }]}
                            value={target}
                            onChangeText={setTarget}
                            keyboardType="numeric"
                        />
                        <Text style={{ color: theme.colors.textSecondary }}>
                            {t('quran.pages', 'pages')}
                        </Text>
                    </View>
                </View>

                <View style={[styles.infoCard, { backgroundColor: theme.colors.info.light + '20' }]}>
                    <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.info.main} />
                    <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                        {t('social.createDesc', 'You will get an invite code to share with friends after creating the group.')}
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.createButton,
                        { backgroundColor: theme.colors.primary, opacity: (!groupName || !nickname) ? 0.5 : 1 }
                    ]}
                    onPress={handleCreate}
                    disabled={!groupName || !nickname}
                >
                    <Text style={[styles.createButtonText, { color: theme.colors.onPrimary }]}>
                        {t('social.create', 'Create Group')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '600' },
    content: { padding: 20 },
    formGroup: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    input: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    targetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    targetInput: {
        fontSize: 18,
        fontWeight: 'bold',
        width: 50,
        textAlign: 'center',
    },
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
    footer: { padding: 20 },
    createButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    createButtonText: { fontSize: 16, fontWeight: 'bold' },
});

export default CreateGroupScreen;
