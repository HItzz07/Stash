import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://37.60.252.247:8090');


export const COLLECTION_ID = 'pbc_2565122414';

let authPromise: Promise<void> | null = null;

export const authenticate = async () => {
    if (pb.authStore.isValid) return;

    if (authPromise) return authPromise;

    authPromise = (async () => {
        try {
            await pb.collection('users').authWithPassword(
                'user@email.com',
                'password'
            );
        } catch (err) {
            console.error('PocketBase auth failed', err);
        } finally {
            authPromise = null;
        }
    })();

    return authPromise;
}

export const logout = () => {
    pb.authStore.clear();
}
