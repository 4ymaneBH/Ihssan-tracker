// Onboarding Screen with multi-step flow
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useUserPreferencesStore } from '../store';
import { changeLanguage } from '../i18n';
import { getFontFamily } from '../utils';


const { width } = Dimensions.get('window');

type OnboardingStep = 'language' | 'theme' | 'goals' | 'complete';

const OnboardingScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isArabic = i18n.language === 'ar';
    const [step, setStep] = useState<OnboardingStep>('language');
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('ar');
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
                    <View style={[styles.langIconContainer, { backgroundColor: '#3B82F6' + '20' }]}>
                        <MaterialCommunityIcons name="alpha-a-box" size={36} color="#3B82F6" />
                    </View>
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
                    <View style={[styles.langIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <MaterialCommunityIcons name="abjad-arabic" size={36} color={theme.colors.primary} />
                    </View>
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
                    <MaterialCommunityIcons name="white-balance-sunny" size={32} color="#F59E0B" />
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
                    <MaterialCommunityIcons name="moon-waning-crescent" size={32} color="#818CF8" />
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
                    <View style={[styles.goalIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                        <MaterialCommunityIcons name="mosque" size={24} color={theme.colors.primary} />
                    </View>
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
                    <View style={[styles.goalIconContainer, { backgroundColor: theme.colors.success.main + '20' }]}>
                        <MaterialCommunityIcons name="book-open-page-variant" size={24} color={theme.colors.success.main} />
                    </View>
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
                    <View style={[styles.goalIconContainer, { backgroundColor: theme.colors.info.main + '20' }]}>
                        <MaterialCommunityIcons name="hands-pray" size={24} color={theme.colors.info.main} />
                    </View>
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
                <Text style={[
                    styles.appName,
                    { color: theme.colors.primary, fontFamily: getFontFamily(isArabic, 'bold') }
                ]}>
                    {t('common.appName')}
                </Text>
                <Text style={[
                    styles.tagline,
                    { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }
                ]}>
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
    langIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    goalsContainer: {
        gap: 16,
    },
    goalIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
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
