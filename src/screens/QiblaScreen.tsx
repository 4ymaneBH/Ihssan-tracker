import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Line, Polygon, G, Text as SvgText } from 'react-native-svg';
import { calculateQibla } from '../utils/qibla';
import { getFontFamily } from '../utils/fonts';
import { useUserPreferencesStore } from '../store';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.8;

const QiblaScreen = () => {
    const { theme, isDark } = useTheme();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { language } = useUserPreferencesStore();
    const isArabic = language === 'ar';

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [magnetometer, setMagnetometer] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState(0);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkPermissions();
        return () => {
            unsubscribe();
        };
    }, []);

    const checkPermissions = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('locationPermissionDenied');
                setLoading(false);
                return;
            }
            setHasPermission(true);
            getLocation();
        } catch (err) {
            setError('errorFetchingLocation');
            setLoading(false);
        }
    };

    const getLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setLocation(location);
            const qibla = calculateQibla(location.coords.latitude, location.coords.longitude);
            setQiblaDirection(qibla);
            subscribe();
        } catch (err) {
            setError('errorFetchingLocation');
        } finally {
            setLoading(false);
        }
    };

    const subscribe = () => {
        setSubscription(
            Magnetometer.addListener((data) => {
                setMagnetometer(_angle(data));
            })
        );
        Magnetometer.setUpdateInterval(100);
    };

    const unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    const _angle = (magnetometer: any) => {
        let angle = 0;
        if (magnetometer) {
            let { x, y } = magnetometer;
            if (Math.atan2(y, x) >= 0) {
                angle = Math.atan2(y, x) * (180 / Math.PI);
            } else {
                angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
            }
        }
        return Math.round(angle);
    };

    // Adjust angle logic:
    // Math.atan2(y, x) gives angle from X axis. Device heading is usually 0 at North.
    // We need to verify device-specific behavior.
    // Standard expo-sensors formula:
    // angle = atan2(y, x) * (180 / PI)
    // Usually this needs adjustment based on usage (portrait vs landscape).
    // For basic portrait: angle = angle - 90.

    const getDegree = (magnetometer: number) => {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    const displayHeading = getDegree(magnetometer);

    // Example logic adjustment for Compass visual:
    // We rotate the CARD/DIAL against the phone's heading.
    // If phone points North (0deg), dial is 0.
    // If phone points East (90deg), dial should rotate -90deg so "N" stays North.
    // So dial rotation = -heading.

    // Qibla pointer logic:
    // If Qibla is at 45deg (NE).
    // If phone points North (0deg), Qibla is 45deg to the right. Pointer is at 45deg.
    // If phone points East (90deg), Qibla is -45deg (relative to phone top). Pointer is at -45deg.
    // Pointer Rotation = QiblaBearing - Heading.

    const compassRotation = -displayHeading; // Rotates the dial
    const qiblaPointerRotation = qiblaDirection - displayHeading; // Rotates the needle relative to screen top

    // However, simpler visualization:
    // Rotate the whole Compass Dial so 'N' points North.
    // Draw the Kaaba icon at the fixed Qibla angle on the Dial.
    // Then the needle/Kaaba icon stays at the correct World Bearing on the Dial, and the Dial rotates.

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.errorText, { color: theme.colors.text }]}>{t(error)}</Text>
                <TouchableOpacity style={styles.button} onPress={checkPermissions}>
                    <Text style={styles.buttonText}>{t('retry')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={isArabic ? "arrow-forward" : "arrow-back"} size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'bold') }]}>
                    {t('qiblaCompass')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.compassContainer}>
                <Text style={[styles.headingText, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                    {Math.round(displayHeading)}°
                </Text>

                <View style={{ transform: [{ rotate: `${-displayHeading}deg` }] }}>
                    <Svg height={COMPASS_SIZE} width={COMPASS_SIZE} viewBox="0 0 100 100">
                        {/* Compass Circle */}
                        <Circle cx="50" cy="50" r="48" stroke={theme.colors.border} strokeWidth="1" fill={theme.colors.surface} />

                        {/* Cardinal Points */}
                        <SvgText x="50" y="12" fill={theme.colors.error.main} fontSize="8" fontWeight="bold" textAnchor="middle">N</SvgText>
                        <SvgText x="50" y="92" fill={theme.colors.text} fontSize="8" fontWeight="bold" textAnchor="middle">S</SvgText>
                        <SvgText x="92" y="52" fill={theme.colors.text} fontSize="8" fontWeight="bold" textAnchor="middle">E</SvgText>
                        <SvgText x="8" y="52" fill={theme.colors.text} fontSize="8" fontWeight="bold" textAnchor="middle">W</SvgText>

                        {/* Ticks */}
                        {[...Array(12)].map((_, i) => (
                            <Line
                                key={i}
                                x1="50" y1="5"
                                x2="50" y2={i % 3 === 0 ? "10" : "7"}
                                stroke={theme.colors.textSecondary}
                                strokeWidth="1"
                                transform={`rotate(${i * 30}, 50, 50)`}
                            />
                        ))}

                        {/* Qibla Indicator (Kaaba direction) on the Compass Dial */}
                        <G transform={`rotate(${qiblaDirection}, 50, 50)`}>
                            <Line x1="50" y1="50" x2="50" y2="15" stroke={theme.colors.primary} strokeWidth="3" strokeLinecap="round" />
                            <Circle cx="50" cy="15" r="3" fill={theme.colors.primary} />
                        </G>
                    </Svg>
                </View>

                {/* Fixed Pointer at top of screen (Phone heading) */}
                <View style={styles.pointerContainer}>
                    <Ionicons name="caret-up" size={32} color={theme.colors.text} />
                </View>

            </View>

            <View style={styles.infoContainer}>
                <Text style={[styles.infoText, { color: theme.colors.text, fontFamily: getFontFamily(isArabic, 'medium') }]}>
                    {t('qiblaDirection')}: {Math.round(qiblaDirection)}°
                </Text>
                <Text style={[styles.subText, { color: theme.colors.textSecondary, fontFamily: getFontFamily(isArabic, 'regular') }]}>
                    {t('rotatePhone')}
                </Text>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
    },
    compassContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: COMPASS_SIZE + 60,
    },
    headingText: {
        fontSize: 24,
        marginBottom: 20,
    },
    pointerContainer: {
        position: 'absolute',
        top: 35, // Adjust based on layout
        alignItems: 'center',
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    infoText: {
        fontSize: 18,
        marginBottom: 8,
    },
    subText: {
        fontSize: 14,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        padding: 12,
        backgroundColor: '#2D9CDB',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default QiblaScreen;
