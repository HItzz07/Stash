import { dbPromise } from './db';
import { pb, COLLECTION_ID } from '../lib/pb';

// Helper to ignore errors (like 403 or offline)
const safePbCall = async (fn: () => Promise<any>) => {
    try {
        return await fn();
    } catch (e) {
        console.warn('PocketBase sync error (ignored):', e);
        return null;
    }
};

export async function getLocalNotes() {
    const db = await dbPromise;
    const allNotes = await db.getAll('notes');
    const userId = pb.authStore.model?.id;

    if (!userId) return [];

    return allNotes.filter(n => n.user_id === userId);
}

export async function syncNotes() {
    if (!pb.authStore.isValid || !pb.authStore.model?.id) return await getLocalNotes();

    const userId = pb.authStore.model.id;

    // 1. Fetch from PB
    const records = await safePbCall(() => pb.collection(COLLECTION_ID).getFullList({
        filter: `user_id = "${userId}"`,
        sort: '-updated',
    }));

    if (!records) return await getLocalNotes();

    const db = await dbPromise;
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');

    // 2. Update local IDB with server data
    for (const record of records) {
        const note = {
            id: record.id,
            content: record.content,
            createdAt: new Date(record.created).getTime(),
            updatedAt: new Date(record.updated).getTime(),
            user_id: record.user_id
        };
        await store.put(note);
    }

    await tx.done;
    return db.getAll('notes');
}

export async function addNote(content: string) {
    const db = await dbPromise;
    const now = Date.now();
    const userId = pb.authStore.model?.id;

    // Generate a 15-char random string for ID (PocketBase compatible)
    const generateId = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 15; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        return result;
    };

    const id = generateId();

    const note = {
        id,
        content,
        createdAt: now,
        updatedAt: now,
        user_id: userId
    };

    // 1. Save to IDB immediately
    await db.put('notes', note);

    // 2. Sync to PB
    if (userId) {
        safePbCall(async () => {
            await pb.collection(COLLECTION_ID).create({
                id: note.id,
                content,
                user_id: userId,
            });
        });
    }

    return note;
}

export async function updateNote(id: string, content: string) {
    const db = await dbPromise;
    const note = await db.get('notes', id);
    if (!note) return;

    note.content = content;
    note.updatedAt = Date.now();

    // 1. Update IDB
    await db.put('notes', note);

    // 2. Sync to PB
    if (pb.authStore.isValid) {
        safePbCall(async () => {
            await pb.collection(COLLECTION_ID).update(id, { content });
        });
    }
}

export async function deleteNote(id: string) {
    const db = await dbPromise;

    // 1. Delete from IDB
    await db.delete('notes', id);

    // 2. Sync to PB
    if (pb.authStore.isValid) {
        safePbCall(async () => {
            await pb.collection(COLLECTION_ID).delete(id);
        });
    }
}
