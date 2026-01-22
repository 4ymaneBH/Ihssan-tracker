import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context';
import { useSocialStore } from '../../store';

const JoinGroupScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { joinGroup } = useSocialStore();

    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const isArabic = i18n.language === 'ar';

    const handleJoin = () => {
        if (!code || !nickname) return;

        const success = joinGroup(code.toUpperCase(), nickname);

        if (success) {
            navigation.goBack();
        } else {
            setError(t('social.invalidCode', 'Invalid invite code or group not found'));
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('social.joinGroup', 'Join Group')}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        {t('social.enterCode', 'Enter Invite Code')}
                    </Text>
                    <TextInput
                        style={[styles.codeInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: error ? theme.colors.error.main : theme.colors.border }]}
                        placeholder="ABC123"
                        placeholderTextColor={theme.colors.textTertiary}
                        value={code}
                        onChangeText={(text) => {
                            setCode(text);
                            setError('');
                        }}
                        autoCapitalize="characters"
                        maxLength={6}
                        textAlign="center"
                    />
                    {error ? <Text style={[styles.errorText, { color: theme.colors.error.main }]}>{error}</Text> : null}
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

                <TouchableOpacity
                    style={[
                        styles.joinButton,
                        { backgroundColor: theme.colors.primary, opacity: (!code || !nickname) ? 0.5 : 1 }
                    ]}
                    onPress={handleJoin}
                    disabled={!code || !nickname}
                >
                    <Text style={[styles.joinButtonText, { color: theme.colors.onPrimary }]}>
                        {t('social.join', 'Join Group')}
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
    content: { padding: 24 },
    formGroup: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    input: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    codeInput: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 32,
        letterSpacing: 4,
        fontWeight: '700',
    },
    errorText: {
        marginTop: 8,
        fontSize: 14,
    },
    joinButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    joinButtonText: { fontSize: 16, fontWeight: 'bold' },
});

export default JoinGroupScreen;
