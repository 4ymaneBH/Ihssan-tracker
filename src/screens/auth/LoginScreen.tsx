import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { useAuthStore } from '../../store';
import { getFontFamily } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { signIn, isLoading } = useAuthStore();
    const isArabic = i18n.language === 'ar';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert(t('common.error'), t('auth.fillAllFields') || 'Please fill in all fields');
            return;
        }

        try {
            await signIn({
                id: 'mock-id',
                name: 'User',
                email,
            });
            // Navigation handled by auth state change
        } catch (error) {
            Alert.alert(t('common.error'), t('auth.signInFailed') || 'Sign in failed');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <MaterialCommunityIcons
                                name={isArabic ? "arrow-right" : "arrow-left"}
                                size={24}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {t('auth.welcomeBack') || 'Welcome Back'}
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                            {t('auth.signInSubtitle') || 'Sign in to continue'}
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium') }]}>
                                {t('auth.email') || 'Email'}
                            </Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'regular'), textAlign: isArabic ? 'right' : 'left' }]}
                                    placeholder={t('auth.emailPlaceholder') || 'Enter your email'}
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium') }]}>
                                {t('auth.password') || 'Password'}
                            </Text>
                            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'regular'), textAlign: isArabic ? 'right' : 'left' }]}
                                    placeholder={t('auth.passwordPlaceholder') || 'Enter your password'}
                                    placeholderTextColor={theme.colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <MaterialCommunityIcons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={theme.colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.colors.primary, opacity: isLoading ? 0.7 : 1 }]}
                            onPress={handleSignIn}
                            disabled={isLoading}
                        >
                            <Text style={[styles.buttonText, { color: theme.colors.onPrimary, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                {isLoading ? (t('common.loading') || 'Loading...') : (t('auth.signIn') || 'Sign In')}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                                {t('auth.dontHaveAccount') || "Don't have an account?"}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp' as any)}>
                                <Text style={[styles.link, { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                    {t('auth.signUp') || 'Sign Up'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    backButton: {
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    button: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    buttonText: {
        fontSize: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
    },
    footerText: {
        fontSize: 14,
    },
    link: {
        fontSize: 14,
    },
});

export default LoginScreen;
