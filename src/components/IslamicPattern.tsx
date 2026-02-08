// Islamic Geometric Pattern Component
// SVG-based decorative pattern for backgrounds
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

interface IslamicPatternProps {
    size?: number;
    color?: string;
    opacity?: number;
}

const IslamicPattern: React.FC<IslamicPatternProps> = ({
    size = 200,
    color = '#A4D96C',
    opacity = 0.1,
}) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <G opacity={opacity}>
                    {/* Octagonal star pattern - common in Islamic art */}
                    <Path
                        d="M100,20 L120,60 L160,60 L130,85 L145,125 L100,100 L55,125 L70,85 L40,60 L80,60 Z"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />
                    <Path
                        d="M100,40 L115,70 L145,70 L120,90 L130,120 L100,105 L70,120 L80,90 L55,70 L85,70 Z"
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                    />

                    {/* Circular geometric pattern */}
                    <Path
                        d="M100,100 m-60,0 a60,60 0 1,0 120,0 a60,60 0 1,0 -120,0"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                    />
                    <Path
                        d="M100,100 m-45,0 a45,45 0 1,0 90,0 a45,45 0 1,0 -90,0"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                    />

                    {/* Interlocking squares */}
                    <Path
                        d="M70,70 L130,70 L130,130 L70,130 Z"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        transform="rotate(45 100 100)"
                    />
                    <Path
                        d="M80,80 L120,80 L120,120 L80,120 Z"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        transform="rotate(45 100 100)"
                    />
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default IslamicPattern;
