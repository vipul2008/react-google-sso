import { Colors, FontSize } from '@/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.logo}>📝</Text>
                <Text style={styles.appName}>NoteSync</Text>
                <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        fontSize: 64,
        marginBottom: 12,
    },
    appName: {
        fontSize: FontSize.xxl,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 32,
        letterSpacing: 1,
    },
    spinner: {
        marginBottom: 16,
    },
    message: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 8,
    },
});
