// ErrorBoundary - Catches unhandled render errors and shows a fallback UI
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
    children: ReactNode;
    /** Optional custom fallback UI */
    fallback?: ReactNode;
    /** Optional screen/context name for error reporting */
    screenName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });

        // In development, log to console; in production this would go to a crash reporter
        if (__DEV__) {
            console.error(
                `[ErrorBoundary]${this.props.screenName ? ` (${this.props.screenName})` : ''} Caught error:`,
                error,
                errorInfo
            );
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#E57373" />
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.subtitle}>
                        {this.props.screenName
                            ? `An error occurred in ${this.props.screenName}.`
                            : 'An unexpected error occurred.'}
                    </Text>

                    {__DEV__ && this.state.error && (
                        <ScrollView style={styles.debugBox}>
                            <Text style={styles.debugText}>{this.state.error.toString()}</Text>
                            {this.state.errorInfo && (
                                <Text style={styles.debugText}>
                                    {this.state.errorInfo.componentStack}
                                </Text>
                            )}
                        </ScrollView>
                    )}

                    <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                        <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#0D0F12',
        gap: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#9E9E9E',
        textAlign: 'center',
        lineHeight: 22,
    },
    debugBox: {
        maxHeight: 200,
        width: '100%',
        backgroundColor: '#1A1A2E',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    debugText: {
        fontSize: 11,
        color: '#FF7043',
        fontFamily: 'monospace',
        lineHeight: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#A4D96C',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});
