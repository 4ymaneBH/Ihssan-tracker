import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useKhatamStore } from '../store';
import { getFontFamily, getDateString } from '../utils';
import { AppCard, QuickActionButton } from '../components';
import DateTimePicker from '@react-native-community/datetimepicker';

const KhatamTrackerScreen: React.FC = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isArabic = i18n.language === 'ar';

    // Store
    const { currentSession, startKhatam, logDailyReading, updateProgress, getDailyPageGoal, deleteKhatam } = useKhatamStore();

    // Local state for setup
    const [targetDate, setTargetDate] = useState(new Date(Date.now() + 30 * 86400000)); // Default 30 days
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Local state for logging
    const [pagesInput, setPagesInput] = useState('');
    const [currentPageInput, setCurrentPageInput] = useState('');

    const dailyGoal = getDailyPageGoal();

    const handleStart = () => {
        const today = new Date();
        const diffTime = targetDate.getTime() - today.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (days < 1) {
            Alert.alert(t('common.error'), isArabic ? 'يجب أن يكون تاريخ الانتهاء في المستقبل' : 'Target date must be in the future');
            return;
        }

        startKhatam(days);
    };

    const handleLogPages = () => {
        const pages = parseInt(pagesInput);
        if (isNaN(pages) || pages <= 0) return;

        logDailyReading(pages);
        setPagesInput('');
        Alert.alert(t('common.success'), isArabic ? 'تم تسجيل القراءة' : 'Reading logged successfully');
    };

    const handleUpdateCurrentPage = () => {
        const page = parseInt(currentPageInput);
        if (isNaN(page) || page <= 0 || page > 604) return;

        updateProgress(page);
        setCurrentPageInput('');
        Alert.alert(t('common.success'), isArabic ? 'تم تحديث الصفحة' : 'Page updated successfully');
    };

    const handleCancel = () => {
        Alert.alert(
            isArabic ? 'إلغاء الختمة' : 'Cancel Khatam',
            isArabic ? 'هل أنت متأكد من إلغاء الختمة الحالية؟' : 'Are you sure you want to cancel the current Khatam?',
            [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('common.delete'), style: 'destructive', onPress: deleteKhatam }
            ]
        );
    };

    // Render Setup Mode
    if (!currentSession || currentSession.status !== 'active') {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialCommunityIcons name={isArabic ? "arrow-right" : "arrow-left"} size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                        {isArabic ? 'ختمة القرآن' : 'Quran Khatam'}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <View style={[styles.setupCard, { backgroundColor: theme.colors.surface }]}>
                        <MaterialCommunityIcons name="book-open-page-variant" size={64} color={theme.colors.primary} />
                        <Text style={[styles.setupTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                            {isArabic ? 'ابدأ ختمة جديدة' : 'Start a New Khatam'}
                        </Text>
                        <Text style={[styles.setupDesc, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                            {isArabic
                                ? 'حدد موعداً لختم القرآن الكريم وسنقوم بحساب الورد اليومي لك.'
                                : 'Set a deadline to complete the Quran, and we will calculate your daily goal.'}
                        </Text>

                        <View style={styles.datePickerContainer}>
                            <Text style={[styles.label, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium') }]}>
                                {isArabic ? 'تاريخ الانتهاء' : 'Target Date'}
                            </Text>

                            <TouchableOpacity
                                style={[styles.dateButton, { borderColor: theme.colors.border }]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={[styles.dateText, { color: theme.colors.text }]}>
                                    {getDateString(targetDate)}
                                </Text>
                                <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
                            onPress={handleStart}
                        >
                            <Text style={[styles.startButtonText, { fontFamily: getFontFamily(isArabic, 'bold') }]}>
                                {isArabic ? 'بدء الختمة' : 'Start Khatam'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={targetDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        minimumDate={new Date()}
                        onChange={(event: any, date?: Date) => {
                            setShowDatePicker(false);
                            if (date) setTargetDate(date);
                        }}
                    />
                )}
            </SafeAreaView>
        );
    }

    // Render Active Mode
    const progress = currentSession.currentPage / 604;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name={isArabic ? "arrow-right" : "arrow-left"} size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {isArabic ? 'متابعة الختمة' : 'Track Khatam'}
                </Text>
                <TouchableOpacity onPress={handleCancel}>
                    <MaterialCommunityIcons name="delete-outline" size={24} color={theme.colors.error.main} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Progress Card */}
                <View style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.progressCircleContainer}>
                        {/* Simple text representation if no circular progress lib available yet */}
                        <Text style={[styles.progressPercent, { color: theme.colors.primary }]}>
                            {Math.round(progress * 100)}%
                        </Text>
                        <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                            {isArabic ? 'تمت القراءة' : 'Completed'}
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>{currentSession.currentPage}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{isArabic ? 'الصفحة الحالية' : 'Current Page'}</Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>{604 - currentSession.currentPage}</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{isArabic ? 'صفحة متبقية' : 'Pages Left'}</Text>
                        </View>
                    </View>
                </View>

                {/* Daily Goal */}
                <AppCard backgroundColor={theme.colors.primary + '10'}>
                    <View style={styles.goalContainer}>
                        <MaterialCommunityIcons name="target" size={32} color={theme.colors.primary} />
                        <View style={styles.goalTextCtx}>
                            <Text style={[styles.goalTitle, { color: theme.colors.text }]}>
                                {isArabic ? 'الورد اليومي' : 'Daily Goal'}
                            </Text>
                            <Text style={[styles.goalValue, { color: theme.colors.text }]}>
                                {dailyGoal} {isArabic ? 'صفحة' : 'pages'}
                            </Text>
                        </View>
                    </View>
                </AppCard>

                {/* Actions */}
                <View style={[styles.actionSection, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                        {isArabic ? 'تسجيل القراءة' : 'Log Reading'}
                    </Text>

                    <View style={styles.inputRow}>
                        <TextInput
                            style={[styles.input, {
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                textAlign: isArabic ? 'right' : 'left'
                            }]}
                            placeholder={isArabic ? 'عدد الصفحات المقروءة' : 'Pages read today'}
                            placeholderTextColor={theme.colors.textTertiary}
                            keyboardType="number-pad"
                            value={pagesInput}
                            onChangeText={setPagesInput}
                        />
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.colors.success.main }]}
                            onPress={handleLogPages}
                        >
                            <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.orText, { color: theme.colors.textSecondary }]}>— {isArabic ? 'أو' : 'OR'} —</Text>

                    <View style={styles.inputRow}>
                        <TextInput
                            style={[styles.input, {
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                                textAlign: isArabic ? 'right' : 'left'
                            }]}
                            placeholder={isArabic ? 'رقم الصفحة التي وصلت إليها' : 'Update current page number'}
                            placeholderTextColor={theme.colors.textTertiary}
                            keyboardType="number-pad"
                            value={currentPageInput}
                            onChangeText={setCurrentPageInput}
                        />
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.colors.info.main }]}
                            onPress={handleUpdateCurrentPage}
                        >
                            <MaterialCommunityIcons name="bookmark" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
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
    backButton: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { flex: 1, padding: 16, justifyContent: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, gap: 16 },

    // Setup Styles
    setupCard: {
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        gap: 16,
        elevation: 2,
    },
    setupTitle: { fontSize: 22, textAlign: 'center' },
    setupDesc: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
    datePickerContainer: { width: '100%', gap: 8, marginTop: 16 },
    label: { fontSize: 14 },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
    },
    dateText: { fontSize: 16 },
    startButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    startButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

    // Progress Styles
    progressCard: {
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
    },
    progressCircleContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 8,
        borderColor: '#eee', // Should be dynamic
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    progressPercent: { fontSize: 28, fontWeight: 'bold' },
    progressLabel: { fontSize: 12 },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold' },
    statLabel: { fontSize: 12 },
    divider: { width: 1, height: '80%' },

    // Goal Styles
    goalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    goalTextCtx: {},
    goalTitle: { fontSize: 14, opacity: 0.8 },
    goalValue: { fontSize: 22, fontWeight: 'bold' },

    // Action Styles
    actionSection: {
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },
    sectionTitle: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
    inputRow: { flexDirection: 'row', gap: 12 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orText: { textAlign: 'center', fontSize: 12 },
});

export default KhatamTrackerScreen;
