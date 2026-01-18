// Export Modal - Month/Week selection for analytics export
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context';
import { useSalatStore, useHabitsStore } from '../store';
import {
    gatherMonthlyData,
    gatherReportData,
    getWeekDates,
    exportCSV,
    exportPDF,
    getMonthName,
    ReportData,
} from '../services/exportService';
import { getDateString } from '../utils';

interface ExportModalProps {
    visible: boolean;
    onClose: () => void;
}

type ExportFormat = 'csv' | 'pdf';
type ReportPeriod = 'monthly' | 'weekly';

const ExportModal: React.FC<ExportModalProps> = ({ visible, onClose }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isArabic = i18n.language === 'ar';

    // Get store data
    const salatLogs = useSalatStore((state) => state.logs);
    const adhkarLogs = useHabitsStore((state) => state.adhkarLogs);
    const quranLogs = useHabitsStore((state) => state.quranLogs);
    const charityLogs = useHabitsStore((state) => state.charityLogs);
    const tahajjudLogs = useHabitsStore((state) => state.tahajjudLogs);

    // Memoize the habits state object
    const habitsState = useMemo(() => ({
        adhkarLogs,
        quranLogs,
        charityLogs,
        tahajjudLogs,
    }), [adhkarLogs, quranLogs, charityLogs, tahajjudLogs]);

    // State
    const currentDate = new Date();
    const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('monthly');

    // Monthly State
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

    // Weekly State
    // Default to start of current week (assuming Sunday start)
    const getStartOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day; // adjust when day is sunday
        return new Date(d.setDate(diff));
    };
    const [selectedWeekStart, setSelectedWeekStart] = useState<string>(getDateString(getStartOfWeek(currentDate)));

    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    // Generate last 12 months options
    const monthOptions: { year: number; month: number; label: string }[] = [];
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        monthOptions.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            label: `${getMonthName(date.getMonth(), i18n.language)} ${date.getFullYear()}`,
        });
    }

    // Generate last 8 weeks options
    const weekOptions: { startDate: string; label: string }[] = [];
    for (let i = 0; i < 8; i++) {
        const d = getStartOfWeek(new Date());
        d.setDate(d.getDate() - (i * 7));
        const dateStr = getDateString(d);

        // Format label: "Jan 12 - Jan 18"
        const endD = new Date(d);
        endD.setDate(d.getDate() + 6);
        const label = `${d.getDate()} ${getMonthName(d.getMonth(), i18n.language).slice(0, 3)} - ${endD.getDate()} ${getMonthName(endD.getMonth(), i18n.language).slice(0, 3)}`;

        weekOptions.push({
            startDate: dateStr,
            label: label
        });
    }

    const handleExport = async () => {
        setIsExporting(true);
        setExportSuccess(false);

        try {
            let data: ReportData;

            if (selectedPeriod === 'monthly') {
                data = gatherMonthlyData(
                    selectedYear,
                    selectedMonth,
                    salatLogs,
                    habitsState,
                    i18n.language
                );
            } else {
                const dates = getWeekDates(selectedWeekStart);
                const title = isArabic ? 'التقرير الأسبوعي' : 'Weekly Report';
                // Find label for period
                const weekLabel = weekOptions.find(w => w.startDate === selectedWeekStart)?.label || selectedWeekStart;

                data = gatherReportData(
                    dates,
                    title,
                    weekLabel,
                    salatLogs,
                    habitsState
                );
            }

            if (selectedFormat === 'csv') {
                await exportCSV(data);
            } else {
                await exportPDF(data);
            }

            setExportSuccess(true);
            setTimeout(() => {
                onClose();
                setExportSuccess(false);
            }, 1500);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleSelectMonth = (year: number, month: number) => {
        setSelectedYear(year);
        setSelectedMonth(month);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.modalContainer,
                        { backgroundColor: theme.colors.surface },
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            {isArabic ? 'تصدير التقرير' : 'Export Report'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons
                                name="close"
                                size={24}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Period Selector Toggle */}
                    <View style={[styles.toggleContainer, { backgroundColor: theme.colors.background }]}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                selectedPeriod === 'monthly' && { backgroundColor: theme.colors.primary }
                            ]}
                            onPress={() => setSelectedPeriod('monthly')}
                        >
                            <Text style={[
                                styles.toggleText,
                                { color: selectedPeriod === 'monthly' ? theme.colors.onPrimary : theme.colors.textSecondary }
                            ]}>
                                {isArabic ? 'شهري' : 'Monthly'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                selectedPeriod === 'weekly' && { backgroundColor: theme.colors.primary }
                            ]}
                            onPress={() => setSelectedPeriod('weekly')}
                        >
                            <Text style={[
                                styles.toggleText,
                                { color: selectedPeriod === 'weekly' ? theme.colors.onPrimary : theme.colors.textSecondary }
                            ]}>
                                {isArabic ? 'أسبوعي' : 'Weekly'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Date Selection */}
                    <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                        {selectedPeriod === 'monthly'
                            ? (isArabic ? 'اختر الشهر' : 'Select Month')
                            : (isArabic ? 'اختر الأسبوع' : 'Select Week')
                        }
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.monthScroll}
                        contentContainerStyle={styles.monthScrollContent}
                    >
                        {selectedPeriod === 'monthly' ? (
                            monthOptions.map((option) => {
                                const isSelected = option.year === selectedYear && option.month === selectedMonth;
                                return (
                                    <TouchableOpacity
                                        key={`${option.year}-${option.month}`}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: isSelected ? theme.colors.primary : theme.colors.background,
                                                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                                            },
                                        ]}
                                        onPress={() => handleSelectMonth(option.year, option.month)}
                                    >
                                        <Text style={[styles.chipText, { color: isSelected ? theme.colors.onPrimary : theme.colors.text }]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            weekOptions.map((option) => {
                                const isSelected = option.startDate === selectedWeekStart;
                                return (
                                    <TouchableOpacity
                                        key={option.startDate}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: isSelected ? theme.colors.primary : theme.colors.background,
                                                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                                            },
                                        ]}
                                        onPress={() => setSelectedWeekStart(option.startDate)}
                                    >
                                        <Text style={[styles.chipText, { color: isSelected ? theme.colors.onPrimary : theme.colors.text }]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </ScrollView>

                    {/* Format Selection */}
                    <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                        {isArabic ? 'اختر الصيغة' : 'Select Format'}
                    </Text>
                    <View style={styles.formatOptions}>
                        <TouchableOpacity
                            style={[
                                styles.formatOption,
                                {
                                    backgroundColor:
                                        selectedFormat === 'csv'
                                            ? theme.colors.primaryLight
                                            : theme.colors.background,
                                    borderColor:
                                        selectedFormat === 'csv'
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                },
                            ]}
                            onPress={() => setSelectedFormat('csv')}
                        >
                            <MaterialCommunityIcons
                                name="file-delimited-outline"
                                size={28}
                                color={
                                    selectedFormat === 'csv'
                                        ? theme.colors.primary
                                        : theme.colors.textSecondary
                                }
                            />
                            <Text
                                style={[
                                    styles.formatLabel,
                                    {
                                        color:
                                            selectedFormat === 'csv'
                                                ? theme.colors.primary
                                                : theme.colors.text,
                                    },
                                ]}
                            >
                                Google Sheets
                            </Text>
                            <Text
                                style={[styles.formatHint, { color: theme.colors.textTertiary }]}
                            >
                                CSV
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.formatOption,
                                {
                                    backgroundColor:
                                        selectedFormat === 'pdf'
                                            ? theme.colors.primaryLight
                                            : theme.colors.background,
                                    borderColor:
                                        selectedFormat === 'pdf'
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                },
                            ]}
                            onPress={() => setSelectedFormat('pdf')}
                        >
                            <MaterialCommunityIcons
                                name="file-pdf-box"
                                size={28}
                                color={
                                    selectedFormat === 'pdf'
                                        ? theme.colors.primary
                                        : theme.colors.textSecondary
                                }
                            />
                            <Text
                                style={[
                                    styles.formatLabel,
                                    {
                                        color:
                                            selectedFormat === 'pdf'
                                                ? theme.colors.primary
                                                : theme.colors.text,
                                    },
                                ]}
                            >
                                PDF Report
                            </Text>
                            <Text
                                style={[styles.formatHint, { color: theme.colors.textTertiary }]}
                            >
                                {isArabic ? 'تقرير منظم' : 'Formatted'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Export Button */}
                    <TouchableOpacity
                        style={[
                            styles.exportButton,
                            {
                                backgroundColor: exportSuccess
                                    ? theme.colors.success.main
                                    : theme.colors.primary,
                            },
                        ]}
                        onPress={handleExport}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <ActivityIndicator color={theme.colors.onPrimary} />
                        ) : exportSuccess ? (
                            <>
                                <MaterialCommunityIcons
                                    name="check-circle"
                                    size={22}
                                    color={theme.colors.onPrimary}
                                />
                                <Text style={[styles.exportButtonText, { color: theme.colors.onPrimary }]}>
                                    {isArabic ? 'تم التصدير!' : 'Exported!'}
                                </Text>
                            </>
                        ) : (
                            <>
                                <MaterialCommunityIcons
                                    name="download"
                                    size={22}
                                    color={theme.colors.onPrimary}
                                />
                                <Text style={[styles.exportButtonText, { color: theme.colors.onPrimary }]}>
                                    {isArabic ? 'تصدير التقرير' : 'Export Report'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    },
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 8,
    },
    monthScroll: {
        marginBottom: 16,
    },
    monthScrollContent: {
        gap: 8,
        paddingRight: 20,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    formatOptions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    formatOption: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 16,
        borderWidth: 2,
        gap: 6,
    },
    formatLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    formatHint: {
        fontSize: 12,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 14,
    },
    exportButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ExportModal;
