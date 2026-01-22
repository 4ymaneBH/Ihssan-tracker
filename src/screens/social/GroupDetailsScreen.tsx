import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../context';
import { useSocialStore } from '../../store';
import { getFontFamily, formatNumber } from '../../utils';
import { RootStackParamList } from '../../types';

type GroupDetailsRouteProp = RouteProp<RootStackParamList, 'GroupDetails'>;

const GroupDetailsScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<GroupDetailsRouteProp>();
    const { groupId } = route.params;

    // We get the latest group data from store
    const { getGroup, simulateFriendJoin } = useSocialStore();
    const group = getGroup(groupId);

    const isArabic = i18n.language === 'ar';

    if (!group) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <Text>Group not found</Text>
            </SafeAreaView>
        );
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: isArabic
                    ? `انضم لمجموعتي "${group.name}" في تطبيق إحسان! رمز الدعوة: ${group.code}`
                    : `Join my group "${group.name}" on Ihssan App! Enter code: ${group.code}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    // For demo purposes
    const handleSimulateJoin = () => {
        const names = ['Ahmed', 'Fatima', 'Omar', 'Aisha', 'Khalid'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        simulateFriendJoin(groupId, randomName);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        {group.name}
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                        {group.members.length} {t('social.members', 'members')}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleShare} style={styles.backButton}>
                    <MaterialCommunityIcons name="share-variant" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Invite Code Card */}
                <View style={[styles.codeCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={[styles.codeLabel, { color: theme.colors.textSecondary }]}>
                        {t('social.inviteCode', 'Invite Code')}
                    </Text>
                    <Text style={[styles.codeValue, { color: theme.colors.primary }]}>
                        {group.code}
                    </Text>
                    <Text style={[styles.codeDesc, { color: theme.colors.textTertiary }]}>
                        {t('social.shareCodeDesc', 'Share this code with friends to let them join')}
                    </Text>
                </View>

                {/* Goal Summary */}
                <View style={[styles.goalSection, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.goalIcon}>
                        <MaterialCommunityIcons name="target" size={24} color={theme.colors.success.main} />
                    </View>
                    <View>
                        <Text style={[styles.goalTitle, { color: theme.colors.text }]}>
                            {t('social.dailyGoal', 'Daily Goal')}
                        </Text>
                        <Text style={[styles.goalTarget, { color: theme.colors.textSecondary }]}>
                            {formatNumber(group.goalTarget, i18n.language)} {t('quran.pages', 'pages')}
                        </Text>
                    </View>
                </View>

                {/* Leaderboard */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    {t('social.leaderboard', 'Leaderboard')}
                </Text>

                <View style={styles.leaderboard}>
                    {group.leaderboard.map((member, index) => (
                        <View
                            key={member.id}
                            style={[
                                styles.memberRow,
                                {
                                    backgroundColor: theme.colors.surface,
                                    borderBottomWidth: index < group.members.length - 1 ? 1 : 0,
                                    borderBottomColor: theme.colors.border
                                }
                            ]}
                        >
                            <View style={styles.rankContainer}>
                                {index < 3 ? (
                                    <MaterialCommunityIcons
                                        name="trophy"
                                        size={24}
                                        color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
                                    />
                                ) : (
                                    <Text style={[styles.rankText, { color: theme.colors.textSecondary }]}>
                                        {formatNumber(index + 1, i18n.language)}
                                    </Text>
                                )}
                            </View>

                            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                                <Text style={styles.avatarText}>
                                    {member.nickname.charAt(0).toUpperCase()}
                                </Text>
                            </View>

                            <View style={styles.memberInfo}>
                                <Text style={[styles.memberName, { color: theme.colors.text }]}>
                                    {member.nickname} {member.id === 'me' && t('social.you', '(You)')}
                                </Text>
                            </View>

                            <View style={styles.memberProgress}>
                                <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
                                    {formatNumber(member.progress, i18n.language)}
                                </Text>
                                <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                                    {t('quran.pages', 'pages')}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Demo Button */}
                <TouchableOpacity
                    style={[styles.demoButton, { borderColor: theme.colors.border }]}
                    onPress={handleSimulateJoin}
                >
                    <Text style={{ color: theme.colors.textTertiary, fontSize: 12 }}>
                        [Dev] Simulate Friend Joining
                    </Text>
                </TouchableOpacity>

            </ScrollView>
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
    headerTitle: { fontSize: 18, fontWeight: '700' },
    headerSubtitle: { fontSize: 12 },
    content: { padding: 16 },

    codeCard: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
    },
    codeLabel: { fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    codeValue: { fontSize: 32, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
    codeDesc: { fontSize: 12 },

    goalSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 16,
    },
    goalIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#DCFCE7', // Light green hardcoded or use theme
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalTitle: { fontSize: 16, fontWeight: '600' },
    goalTarget: { fontSize: 14 },

    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },

    leaderboard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    rankContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: 8,
    },
    rankText: { fontSize: 16, fontWeight: 'bold' },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    memberInfo: { flex: 1 },
    memberName: { fontSize: 16, fontWeight: '500' },
    memberProgress: { alignItems: 'flex-end' },
    progressValue: { fontSize: 18, fontWeight: '700' },
    progressLabel: { fontSize: 12 },

    demoButton: {
        alignItems: 'center',
        padding: 12,
        marginTop: 32,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
});

export default GroupDetailsScreen;
