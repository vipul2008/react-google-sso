import { db } from '@/config/firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';

export interface Note {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get a reference to the user's notes collection.
 */
function notesRef(userId: string) {
  return collection(db, 'users', userId, 'notes');
}

/**
 * Add a new note for a user.
 */
export async function addNote(userId: string, text: string): Promise<string> {
  const docRef = await addDoc(notesRef(userId), {
    text,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update an existing note.
 */
export async function updateNote(
  userId: string,
  noteId: string,
  text: string
): Promise<void> {
  const noteDoc = doc(db, 'users', userId, 'notes', noteId);
  await updateDoc(noteDoc, {
    text,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a note.
 */
export async function deleteNote(
  userId: string,
  noteId: string
): Promise<void> {
  const noteDoc = doc(db, 'users', userId, 'notes', noteId);
  await deleteDoc(noteDoc);
}

/**
 * Subscribe to real-time note updates for a user.
 * Returns an unsubscribe function.
 */
export function subscribeToNotes(
  userId: string,
  callback: (notes: Note[]) => void
): () => void {
  const q = query(notesRef(userId), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const notes: Note[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        text: data.text,
        createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
      };
    });
    callback(notes);
  });
}
