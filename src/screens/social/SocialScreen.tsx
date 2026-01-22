import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context';
import { useSocialStore } from '../../store';
import { getFontFamily } from '../../utils';

const SocialScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const { groups } = useSocialStore();

    const isArabic = i18n.language === 'ar';

    const renderGroupItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.groupCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
        >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.groupInfo}>
                <Text style={[styles.groupName, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={[styles.groupMembers, { color: theme.colors.textSecondary }]}>
                    {item.members.length} {t('social.members', 'members')}
                </Text>
            </View>
            <MaterialCommunityIcons
                name={isArabic ? "chevron-left" : "chevron-right"}
                size={24}
                color={theme.colors.textTertiary}
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {t('social.title', 'Social Groups')}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            {groups.length === 0 ? (
                <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="account-group-outline" size={80} color={theme.colors.textTertiary} />
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                        {t('social.noGroups', 'No Groups Yet')}
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                        {t('social.joinOrCreate', 'Create a group to track goals with friends or join an existing one.')}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={groups}
                    renderItem={renderGroupItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 1 }]}
                    onPress={() => navigation.navigate('JoinGroup')}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
                        {t('social.joinGroup', 'Join Group')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('CreateGroup')}
                >
                    <Text style={[styles.actionButtonText, { color: theme.colors.onPrimary }]}>
                        {t('social.createGroup', 'Create Group')}
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
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 20, fontWeight: '600' },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 8 },
    emptySubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
    listContent: { padding: 16 },
    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    groupInfo: { flex: 1 },
    groupName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    groupMembers: { fontSize: 14 },
    actionButtons: {
        padding: 16,
        gap: 12,
    },
    actionButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    actionButtonText: { fontSize: 16, fontWeight: '600' },
});

export default SocialScreen;
