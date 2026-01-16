// Onboarding Screen with multi-step flow
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context';
import { useUserPreferencesStore } from '../store';
import { changeLanguage } from '../i18n';

const { width } = Dimensions.get('window');

type OnboardingStep = 'language' | 'theme' | 'goals' | 'complete';

const OnboardingScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const [step, setStep] = useState<OnboardingStep>('language');
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');
    const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');

    const {
        setLanguage,
        setTheme,
        setGoals,
        completeOnboarding,
    } = useUserPreferencesStore();

    const handleLanguageSelect = async (lang: 'en' | 'ar') => {
        setSelectedLanguage(lang);
        await setLanguage(lang);
    };

    const handleThemeSelect = (themeChoice: 'light' | 'dark') => {
        setSelectedTheme(themeChoice);
        setTheme(themeChoice);
    };

    const handleNext = () => {
        if (step === 'language') {
            setStep('theme');
        } else if (step === 'theme') {
            setStep('goals');
        } else if (step === 'goals') {
            completeOnboarding();
        }
    };

    const renderLanguageStep = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                {t('onboarding.chooseLanguage')}
            </Text>

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.optionCard,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor:
                                selectedLanguage === 'en'
                                    ? theme.colors.primary
                                    : theme.colors.border,
                            borderWidth: selectedLanguage === 'en' ? 2 : 1,
                        },
                    ]}
                    onPress={() => handleLanguageSelect('en')}
                >
                    <Text style={[styles.optionEmoji]}>🇬🇧</Text>
                    <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                        English
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.optionCard,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor:
                                selectedLanguage === 'ar'
                                    ? theme.colors.primary
                                    : theme.colors.border,
                            borderWidth: selectedLanguage === 'ar' ? 2 : 1,
                        },
                    ]}
                    onPress={() => handleLanguageSelect('ar')}
                >
                    <Text style={[styles.optionEmoji]}>🇸🇦</Text>
                    <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
                        العربية
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderThemeStep = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                {t('onboarding.chooseTheme')}
            </Text>

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.optionCard,
                        {
                            backgroundColor: '#FFFFFF',
                            borderColor:
                                selectedTheme === 'light'
                                    ? theme.colors.primary
                                    : theme.colors.border,
                            borderWidth: selectedTheme === 'light' ? 2 : 1,
                        },
                    ]}
                    onPress={() => handleThemeSelect('light')}
                >
                    <Text style={[styles.optionEmoji]}>☀️</Text>
                    <Text style={[styles.optionLabel, { color: '#1F2937' }]}>
                        {t('onboarding.lightTheme')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.optionCard,
                        {
                            backgroundColor: '#1F2937',
                            borderColor:
                                selectedTheme === 'dark'
                                    ? theme.colors.primary
                                    : theme.colors.border,
                            borderWidth: selectedTheme === 'dark' ? 2 : 1,
                        },
                    ]}
                    onPress={() => handleThemeSelect('dark')}
                >
                    <Text style={[styles.optionEmoji]}>🌙</Text>
                    <Text style={[styles.optionLabel, { color: '#FFFFFF' }]}>
                        {t('onboarding.darkTheme')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderGoalsStep = () => (
        <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                {t('onboarding.setGoals')}
            </Text>

            <View style={styles.goalsContainer}>
                <View
                    style={[
                        styles.goalCard,
                        { backgroundColor: theme.colors.cards.salat },
                    ]}
                >
                    <Text style={styles.goalEmoji}>🕌</Text>
                    <Text style={[styles.goalLabel, { color: theme.colors.text }]}>
                        {t('salat.title')}
                    </Text>
                    <Text style={[styles.goalValue, { color: theme.colors.textSecondary }]}>
                        5 {t('salat.prayersCompleted')}
                    </Text>
                </View>

                <View
                    style={[
                        styles.goalCard,
                        { backgroundColor: theme.colors.cards.quran },
                    ]}
                >
                    <Text style={styles.goalEmoji}>📖</Text>
                    <Text style={[styles.goalLabel, { color: theme.colors.text }]}>
                        {t('quran.title')}
                    </Text>
                    <Text style={[styles.goalValue, { color: theme.colors.textSecondary }]}>
                        2 {t('quran.pages')}/{i18n.language === 'ar' ? 'يوم' : 'day'}
                    </Text>
                </View>

                <View
                    style={[
                        styles.goalCard,
                        { backgroundColor: theme.colors.cards.adhkar },
                    ]}
                >
                    <Text style={styles.goalEmoji}>📿</Text>
                    <Text style={[styles.goalLabel, { color: theme.colors.text }]}>
                        {t('adhkar.title')}
                    </Text>
                    <Text style={[styles.goalValue, { color: theme.colors.textSecondary }]}>
                        {t('adhkar.morning')} & {t('adhkar.evening')}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderCurrentStep = () => {
        switch (step) {
            case 'language':
                return renderLanguageStep();
            case 'theme':
                return renderThemeStep();
            case 'goals':
                return renderGoalsStep();
            default:
                return null;
        }
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <View style={styles.header}>
                <Text style={[styles.appName, { color: theme.colors.primary }]}>
                    {t('common.appName')}
                </Text>
                <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
                    {t('onboarding.tagline')}
                </Text>
            </View>

            <View style={styles.content}>{renderCurrentStep()}</View>

            <View style={styles.footer}>
                <View style={styles.dots}>
                    {['language', 'theme', 'goals'].map((s, i) => (
                        <View
                            key={s}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor:
                                        step === s ? theme.colors.primary : theme.colors.border,
                                },
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleNext}
                >
                    <Text style={[styles.nextButtonText, { color: theme.colors.onPrimary }]}>
                        {step === 'goals' ? t('common.getStarted') : t('common.next')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
    },
    appName: {
        fontSize: 36,
        fontWeight: '700',
    },
    tagline: {
        fontSize: 16,
        marginTop: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    stepContainer: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 32,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    optionCard: {
        width: (width - 72) / 2,
        aspectRatio: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    optionEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    goalsContainer: {
        gap: 16,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
    },
    goalEmoji: {
        fontSize: 32,
        marginRight: 16,
    },
    goalLabel: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    goalValue: {
        fontSize: 14,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    nextButton: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
});

export default OnboardingScreen;
