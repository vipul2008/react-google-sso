import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '@/constants/theme';
import type { Note } from '@/services/firestore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface NoteCardProps {
    note: Note;
    onDelete: (noteId: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
    const formattedDate = note.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View style={styles.card}>
            <View style={styles.body}>
                <Text style={styles.text} numberOfLines={5}>
                    {note.text}
                </Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.date}>{formattedDate}</Text>
                <TouchableOpacity
                    onPress={() => onDelete(note.id)}
                    style={styles.deleteButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadows.small,
    },
    body: {
        marginBottom: Spacing.sm,
    },
    text: {
        fontSize: FontSize.md,
        color: Colors.text,
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    date: {
        fontSize: FontSize.xs,
        color: Colors.textTertiary,
    },
    deleteButton: {
        padding: 4,
        borderRadius: BorderRadius.sm,
    },
});
