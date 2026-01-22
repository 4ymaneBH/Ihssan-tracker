import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocialGroup, GroupMember, GoalType } from '../types';

interface SocialState {
    groups: SocialGroup[];
    activeGroupId?: string;

    // Actions
    createGroup: (name: string, nickname: string, goalType: GoalType, target: number, frequency: 'daily' | 'weekly') => string; // returns groupId
    joinGroup: (code: string, nickname: string) => boolean; // returns success
    getGroup: (groupId: string) => SocialGroup | undefined;
    updateProgress: (groupId: string, progress: number) => void;
    leaveGroup: (groupId: string) => void;

    // Simulations (for demo purposes since no backend)
    simulateFriendJoin: (groupId: string, name: string) => void;
}

// Helper to generate random 6-char code
const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const useSocialStore = create<SocialState>()(
    persist(
        (set, get) => ({
            groups: [],

            createGroup: (name, nickname, goalType, target, frequency) => {
                const id = `group-${Date.now()}`;
                const code = generateCode();
                const adminMember: GroupMember = {
                    id: 'me', // Current user
                    nickname,
                    progress: 0,
                    lastUpdated: Date.now(),
                    joinedAt: Date.now(),
                    isAdmin: true,
                };

                const newGroup: SocialGroup = {
                    id,
                    name,
                    code,
                    goalType,
                    goalTarget: target,
                    frequency,
                    members: [adminMember],
                    createdAt: Date.now(),
                    leaderboard: [adminMember],
                };

                set((state) => ({
                    groups: [...state.groups, newGroup],
                }));

                return id;
            },

            joinGroup: (code, nickname) => {
                const state = get();
                const groupIndex = state.groups.findIndex(g => g.code === code);

                if (groupIndex === -1) return false;

                const group = state.groups[groupIndex];

                // Check if already joined
                if (group.members.some(m => m.id === 'me')) return true;

                const newMember: GroupMember = {
                    id: 'me',
                    nickname,
                    progress: 0,
                    lastUpdated: Date.now(),
                    joinedAt: Date.now(),
                };

                const updatedGroup = {
                    ...group,
                    members: [...group.members, newMember],
                    leaderboard: [...group.members, newMember].sort((a, b) => b.progress - a.progress)
                };

                const updatedGroups = [...state.groups];
                updatedGroups[groupIndex] = updatedGroup;

                set({ groups: updatedGroups });
                return true;
            },

            getGroup: (groupId) => {
                return get().groups.find(g => g.id === groupId);
            },

            updateProgress: (groupId, progress) => {
                set((state) => {
                    const groups = state.groups.map(group => {
                        if (group.id !== groupId) return group;

                        const updatedMembers = group.members.map(member =>
                            member.id === 'me'
                                ? { ...member, progress, lastUpdated: Date.now() }
                                : member
                        );

                        // Re-sort leaderboard
                        const leaderboard = [...updatedMembers].sort((a, b) => b.progress - a.progress);

                        return { ...group, members: updatedMembers, leaderboard };
                    });

                    return { groups };
                });
            },

            leaveGroup: (groupId) => {
                set((state) => ({
                    groups: state.groups.filter(g => g.id !== groupId)
                }));
            },

            simulateFriendJoin: (groupId, name) => {
                set((state) => {
                    const groups = state.groups.map(group => {
                        if (group.id !== groupId) return group;

                        const newMember: GroupMember = {
                            id: `friend-${Date.now()}`,
                            nickname: name,
                            progress: Math.floor(Math.random() * group.goalTarget), // Random initial progress
                            lastUpdated: Date.now(),
                            joinedAt: Date.now(),
                        };

                        const updatedMembers = [...group.members, newMember];
                        const leaderboard = [...updatedMembers].sort((a, b) => b.progress - a.progress);

                        return { ...group, members: updatedMembers, leaderboard };
                    });

                    return { groups };
                });
            }
        }),
        {
            name: 'social-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
