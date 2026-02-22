import AddNoteModal from '@/components/AddNoteModal';
import NoteCard from '@/components/NoteCard';
import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { addNote, deleteNote, subscribeToNotes, type Note } from '@/services/firestore';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Real-time subscription to notes
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotes(user.uid, (updatedNotes) => {
      setNotes(updatedNotes);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddNote = useCallback(
    async (text: string) => {
      if (!user) return;
      try {
        await addNote(user.uid, text);
      } catch (error) {
        Alert.alert('Error', 'Failed to add note. Please try again.');
        console.error('Add note error:', error);
      }
    },
    [user]
  );

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      if (!user) return;

      Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(user.uid, noteId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note.');
              console.error('Delete note error:', error);
            }
          },
        },
      ]);
    },
    [user]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // The subscription will automatically update, so just set refreshing
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>No notes yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to create your first note.{'\n'}
        Notes sync in real-time across all your devices!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.displayName?.split(' ')[0] ?? 'there'} 👋
          </Text>
          <Text style={styles.subtitle}>
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} • Real-time sync
          </Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard note={item} onDelete={handleDeleteNote} />
        )}
        contentContainerStyle={[
          styles.list,
          notes.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.text} />
      </TouchableOpacity>

      {/* Add Note Modal */}
      <AddNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddNote}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.2)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  liveText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.success,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 100,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
});
