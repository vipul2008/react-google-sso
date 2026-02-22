import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface GoogleSignInButtonProps {
    onPress: () => void;
    loading?: boolean;
}

export default function GoogleSignInButton({
    onPress,
    loading = false,
}: GoogleSignInButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.85}
        >
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="small" color="#666" style={styles.icon} />
                ) : (
                    <Image
                        source={{
                            uri: 'https://developers.google.com/identity/images/g-logo.png',
                        }}
                        style={styles.googleLogo}
                    />
                )}
                <Text style={styles.text}>
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.googleButtonBg,
        borderRadius: BorderRadius.lg,
        paddingVertical: 16,
        paddingHorizontal: Spacing.lg,
        ...Shadows.medium,
        width: '100%',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleLogo: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    icon: {
        marginRight: 12,
    },
    text: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: '#333',
        letterSpacing: 0.3,
    },
});
