// Export Modal - Month and format selection for analytics export
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
    exportCSV,
    exportPDF,
    getMonthName,
} from '../services/exportService';

interface ExportModalProps {
    visible: boolean;
    onClose: () => void;
}

type ExportFormat = 'csv' | 'pdf';

const ExportModal: React.FC<ExportModalProps> = ({ visible, onClose }) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const isArabic = i18n.language === 'ar';

    // Get store data - use individual selectors to avoid creating new objects
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
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
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

    const handleExport = async () => {
        setIsExporting(true);
        setExportSuccess(false);

        try {
            const data = gatherMonthlyData(
                selectedYear,
                selectedMonth,
                salatLogs,
                habitsState,
                i18n.language
            );

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
                            {isArabic ? 'تصدير التقرير الشهري' : 'Export Monthly Report'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons
                                name="close"
                                size={24}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Month Selection */}
                    <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                        {isArabic ? 'اختر الشهر' : 'Select Month'}
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.monthScroll}
                        contentContainerStyle={styles.monthScrollContent}
                    >
                        {monthOptions.map((option) => {
                            const isSelected =
                                option.year === selectedYear && option.month === selectedMonth;
                            return (
                                <TouchableOpacity
                                    key={`${option.year}-${option.month}`}
                                    style={[
                                        styles.monthChip,
                                        {
                                            backgroundColor: isSelected
                                                ? theme.colors.primary
                                                : theme.colors.background,
                                            borderColor: isSelected
                                                ? theme.colors.primary
                                                : theme.colors.border,
                                        },
                                    ]}
                                    onPress={() => handleSelectMonth(option.year, option.month)}
                                >
                                    <Text
                                        style={[
                                            styles.monthChipText,
                                            {
                                                color: isSelected
                                                    ? theme.colors.onPrimary
                                                    : theme.colors.text,
                                            },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
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
    monthChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    monthChipText: {
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
