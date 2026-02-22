import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToNotes } from '@/services/firestore';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const [noteCount, setNoteCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToNotes(user.uid, (notes) => {
            setNoteCount(notes.length);
        });
        return () => unsubscribe();
    }, [user]);

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: signOut,
            },
        ]);
    };

    const memberSince = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        })
        : 'Unknown';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Text style={styles.headerTitle}>Profile</Text>

                {/* Avatar Card */}
                <View style={styles.avatarCard}>
                    <View style={styles.avatarGlow}>
                        {user?.photoURL ? (
                            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Ionicons name="person" size={40} color={Colors.textSecondary} />
                            </View>
                        )}
                    </View>
                    <Text style={styles.name}>{user?.displayName ?? 'User'}</Text>
                    <Text style={styles.email}>{user?.email ?? ''}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <StatCard
                        icon="document-text"
                        label="Notes"
                        value={noteCount.toString()}
                        color={Colors.primary}
                    />
                    <StatCard
                        icon="calendar"
                        label="Member since"
                        value={memberSince}
                        color={Colors.accent}
                    />
                </View>

                {/* Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Details</Text>
                    <InfoRow icon="mail-outline" label="Email" value={user?.email ?? 'N/A'} />
                    <InfoRow
                        icon="finger-print-outline"
                        label="User ID"
                        value={user?.uid ? user.uid.slice(0, 12) + '...' : 'N/A'}
                    />
                    <InfoRow icon="shield-checkmark-outline" label="Provider" value="Google" />
                    <InfoRow
                        icon="sync-outline"
                        label="Database"
                        value="Firestore (Real-time)"
                    />
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>NoteSync v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}) {
    return (
        <View style={styles.infoRow}>
            <Ionicons name={icon} size={20} color={Colors.textTertiary} />
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    headerTitle: {
        fontSize: FontSize.xxl,
        fontWeight: '800',
        color: Colors.text,
        paddingTop: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    avatarCard: {
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
        ...Shadows.medium,
    },
    avatarGlow: {
        borderRadius: 50,
        padding: 3,
        borderWidth: 2,
        borderColor: Colors.primary,
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
    },
    avatarPlaceholder: {
        backgroundColor: Colors.backgroundTertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    email: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadows.small,
    },
    statIconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    statValue: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: Colors.textTertiary,
    },
    section: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    infoContent: {
        marginLeft: Spacing.sm,
        flex: 1,
    },
    infoLabel: {
        fontSize: FontSize.xs,
        color: Colors.textTertiary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: FontSize.md,
        color: Colors.text,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 82, 82, 0.08)',
        borderRadius: BorderRadius.md,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 82, 82, 0.2)',
        marginBottom: Spacing.md,
    },
    signOutText: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.error,
        marginLeft: Spacing.sm,
    },
    version: {
        textAlign: 'center',
        fontSize: FontSize.xs,
        color: Colors.textTertiary,
        marginTop: Spacing.sm,
    },
});
