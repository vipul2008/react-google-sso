import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AddNoteModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (text: string) => void;
}

export default function AddNoteModal({ visible, onClose, onAdd }: AddNoteModalProps) {
    const [text, setText] = React.useState('');

    const handleAdd = () => {
        if (text.trim()) {
            onAdd(text.trim());
            setText('');
            onClose();
        }
    };

    const handleClose = () => {
        setText('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>New Note</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Write something..."
                        placeholderTextColor={Colors.textTertiary}
                        value={text}
                        onChangeText={setText}
                        multiline
                        autoFocus
                        textAlignVertical="top"
                    />

                    {/* Add Button */}
                    <TouchableOpacity
                        style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
                        onPress={handleAdd}
                        disabled={!text.trim()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={20} color={Colors.text} />
                        <Text style={styles.addButtonText}>Add Note</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: Colors.backgroundSecondary,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
        minHeight: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Colors.text,
    },
    closeButton: {
        padding: Spacing.xs,
    },
    input: {
        backgroundColor: Colors.backgroundTertiary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.text,
        minHeight: 120,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    addButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.small,
    },
    addButtonDisabled: {
        opacity: 0.4,
    },
    addButtonText: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.text,
        marginLeft: Spacing.xs,
    },
});
