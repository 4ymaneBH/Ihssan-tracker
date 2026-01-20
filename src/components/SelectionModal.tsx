// Selection Modal - generic bottom sheet for selecting options
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { useTranslation } from 'react-i18next';
import { getFontFamily } from '../utils';


export interface SelectionOption {
    label: string;
    value: string;
    icon?: string;
    iconColor?: string;
}

interface SelectionModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    options: SelectionOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
    visible,
    onClose,
    title,
    subtitle,
    options,
    selectedValue,
    onSelect,
}) => {
    const { theme, isDark } = useTheme();
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const handleSelect = (value: string) => {
        onSelect(value);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1}>
                    <BlurView intensity={isDark ? 40 : 80} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />
                </TouchableOpacity>

                <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={[
                                styles.headerTitle,
                                { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }
                            ]}>
                                {title}
                            </Text>
                            {subtitle && (
                                <Text style={[
                                    styles.headerSubtitle,
                                    { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }
                                ]}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Options List */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.optionsContainer}
                    >
                        {options.map((option) => {
                            const isSelected = option.value === selectedValue;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionItem,
                                        {
                                            backgroundColor: isSelected
                                                ? theme.colors.primary + '15'
                                                : 'transparent',
                                            borderColor: isSelected
                                                ? theme.colors.primary
                                                : theme.colors.border,
                                            borderWidth: isSelected ? 1 : 1, // Always show border for clarity
                                        }
                                    ]}
                                    onPress={() => handleSelect(option.value)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.optionLeft}>
                                        {option.icon && (
                                            <View style={[
                                                styles.iconContainer,
                                                {
                                                    backgroundColor: isSelected
                                                        ? theme.colors.primary
                                                        : (option.iconColor || theme.colors.textSecondary) + '20'
                                                }
                                            ]}>
                                                <MaterialCommunityIcons
                                                    name={option.icon as any}
                                                    size={22}
                                                    color={isSelected ? '#FFF' : (option.iconColor || theme.colors.textSecondary)}
                                                />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.optionLabel,
                                            {
                                                color: isSelected ? theme.colors.primary : theme.colors.text,
                                                fontWeight: isSelected ? '600' : '400'
                                            }
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </View>

                                    {isSelected && (
                                        <MaterialCommunityIcons
                                            name="check-circle"
                                            size={24}
                                            color={theme.colors.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 24,
        paddingBottom: 40,
        paddingHorizontal: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionsContainer: {
        gap: 12,
        paddingBottom: 20,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionLabel: {
        fontSize: 16,
    },
});

export default SelectionModal;
