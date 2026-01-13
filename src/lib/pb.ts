import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://37.60.252.247:8090');

export const COLLECTION_ID = 'pbc_2565122414';

export const logout = () => {
    pb.authStore.clear();
}
