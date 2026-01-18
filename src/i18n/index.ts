// i18n configuration with RTL support
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

import en from './locales/en.json';
import ar from './locales/ar.json';

// Language resources
const resources = {
    en: { translation: en },
    ar: { translation: ar },
};

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Check if language is RTL
export const isRTL = (lang: string): boolean => {
    return RTL_LANGUAGES.includes(lang);
};

// Get device language or default to Arabic (Arabic-first app)
const getDeviceLanguage = (): string => {
    // Default to Arabic for this app
    return 'ar';
};

// Initialize i18n
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getDeviceLanguage(),
        fallbackLng: 'ar', // Fallback to Arabic
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

// Function to change language and update RTL
export const changeLanguage = async (lang: 'en' | 'ar'): Promise<void> => {
    const isRTLLanguage = isRTL(lang);

    // Update i18n language
    await i18n.changeLanguage(lang);

    // Update RTL setting (requires app restart to take full effect)
    if (I18nManager.isRTL !== isRTLLanguage) {
        I18nManager.allowRTL(isRTLLanguage);
        I18nManager.forceRTL(isRTLLanguage);
        // Note: For full RTL change, app needs to restart
        // This is handled by the user preferences store
    }
};

// Get current language
export const getCurrentLanguage = (): string => {
    return i18n.language;
};

// Get current direction
export const getDirection = (): 'ltr' | 'rtl' => {
    return isRTL(i18n.language) ? 'rtl' : 'ltr';
};

export default i18n;
