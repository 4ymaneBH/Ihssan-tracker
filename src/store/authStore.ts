import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (user: User) => Promise<void>;
    signUp: (user: User) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            signIn: async (user) => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                set({ user, isAuthenticated: true, isLoading: false });
            },
            signUp: async (user) => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                set({ user, isAuthenticated: true, isLoading: false });
            },
            signOut: async () => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ user: null, isAuthenticated: false, isLoading: false });
            },
            updateProfile: async (name) => {
                set((state) => ({
                    user: state.user ? { ...state.user, name } : null,
                }));
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
