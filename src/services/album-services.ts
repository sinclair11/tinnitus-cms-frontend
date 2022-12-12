import { AlbumFormData, SongData, AlbumInfo } from '@src/types/album';
import axios from 'axios';

export async function getAlbums(auth: string): Promise<AlbumInfo[]> {
    try {
        return await (
            await axios.get('http://localhost:8080/api/admin/albums', {
                headers: { Authorization: `Bearer ${auth}` },
            })
        ).data;
    } catch (error) {
        throw error;
    }
}

export async function getAlbum(auth: string, id: string): Promise<AlbumInfo> {
    try {
        return await (
            await axios.get(`http://localhost:8080/api/admin/albums/album?id=${id}`, {
                headers: { Authorization: `Bearer ${auth}` },
            })
        ).data;
    } catch (error) {
        throw error;
    }
}

export async function uploadAlbumInfo(auth: string, album: AlbumInfo): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8080/api/admin/albums',
            data: album,
            headers: { Authorization: `Bearer ${auth}` },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function uploadAlbumFile(file: any): Promise<string> {

}

export async function editAlbumData(id: string, info: AlbumFormData, tableData: SongData[]): Promise<string> {
    try {
        // const albumDocRef = doc(db, 'albums', id);
        // await setDoc(
        //     albumDocRef,
        //     {
        //         name: info.name,
        //         description: info.description,
        //         tags: info.tags,
        //         category: info.category,
        //         length: info.length,
        //         songs: tableData,
        //     },
        //     { merge: true },
        // );
        return 'Album updated in database';
    } catch (error: any) {
        return error.message;
    }
}

export async function deleteAlbum(id: string): Promise<{ result: boolean; message: string }> {
    try {
        //Delete everyting related to this album
        // await deleteDoc(doc(db, 'albums', id));
        // //Temporary store in db the id of deleted album
        // await updateDoc(doc(db, 'misc', 'albums'), {
        //     deleted_albums: arrayUnion(id),
        // });
        return { result: true, message: 'Album deleted' };
    } catch (error) {
        throw error;
    }
}

export async function getAlbumReviews(id: string, date: Date): Promise<any[]> {
    try {
        return [];
    } catch (error) {
        throw error;
    }
}
