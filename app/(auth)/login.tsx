import GoogleSignInButton from '@/components/GoogleSignInButton';
import { BorderRadius, Colors, FontSize, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [loading, setLoading] = useState(false);

    // Animated values for entrance
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleSignIn = async () => {
        setLoading(true);
        try {
            await signIn();
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[Colors.background, '#0D0D2B', Colors.backgroundSecondary]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                {/* Decorative orbs */}
                <View style={styles.orbContainer}>
                    <View style={[styles.orb, styles.orb1]} />
                    <View style={[styles.orb, styles.orb2]} />
                    <View style={[styles.orb, styles.orb3]} />
                </View>

                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* App Branding */}
                    <View style={styles.brandSection}>
                        <Text style={styles.logo}>📝</Text>
                        <Text style={styles.appName}>NoteSync</Text>
                        <Text style={styles.tagline}>
                            Real-time notes, everywhere.
                        </Text>
                    </View>

                    {/* Features */}
                    <View style={styles.features}>
                        <FeatureItem icon="⚡" text="Real-time sync across devices" />
                        <FeatureItem icon="🔒" text="Secured with Google authentication" />
                        <FeatureItem icon="☁️" text="Cloud-powered by Firebase" />
                    </View>

                    {/* Sign In Button */}
                    <View style={styles.buttonSection}>
                        <GoogleSignInButton onPress={handleSignIn} loading={loading} />
                        <Text style={styles.terms}>
                            By signing in, you agree to our Terms of Service
                        </Text>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
    return (
        <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>{icon}</Text>
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    orbContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    orb: {
        position: 'absolute',
        borderRadius: 9999,
    },
    orb1: {
        width: 300,
        height: 300,
        backgroundColor: 'rgba(108, 99, 255, 0.08)',
        top: -50,
        right: -80,
    },
    orb2: {
        width: 200,
        height: 200,
        backgroundColor: 'rgba(0, 217, 255, 0.06)',
        bottom: 100,
        left: -60,
    },
    orb3: {
        width: 150,
        height: 150,
        backgroundColor: 'rgba(108, 99, 255, 0.05)',
        top: height * 0.35,
        right: -30,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: height * 0.12,
        paddingBottom: Spacing.xxl,
    },
    brandSection: {
        alignItems: 'center',
    },
    logo: {
        fontSize: 80,
        marginBottom: 16,
    },
    appName: {
        fontSize: 42,
        fontWeight: '800',
        color: Colors.text,
        letterSpacing: 2,
        marginBottom: 8,
    },
    tagline: {
        fontSize: FontSize.lg,
        color: Colors.textSecondary,
        letterSpacing: 0.5,
    },
    features: {
        backgroundColor: 'rgba(30, 30, 56, 0.6)',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    featureIcon: {
        fontSize: 22,
        marginRight: 14,
    },
    featureText: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        flex: 1,
    },
    buttonSection: {
        alignItems: 'center',
    },
    terms: {
        marginTop: Spacing.md,
        fontSize: FontSize.xs,
        color: Colors.textTertiary,
        textAlign: 'center',
    },
});
