import { AlbumInfo, AlbumEditInfo } from '@src/types/album';
import axios from 'axios';
import { Endpoints } from '@src/constants';

export async function getAlbums(): Promise<AlbumInfo[]> {
    try {
        return await (
            await axios.get(Endpoints.API_GET_ALBUMS, {})
        ).data;
    } catch (error) {
        throw error;
    }
}

export async function getAlbum(id: string): Promise<AlbumInfo> {
    try {
        return await (
            await axios.get(`${Endpoints.API_ALBUM}/${id}`, {})
        ).data;
    } catch (error) {
        throw error;
    }
}

export async function checkAlbumName(name: string): Promise<boolean> {
    try {
        return await (
            await axios.get(`${Endpoints.API_ALBUM_CHECK}/${name}`)
        ).data;
    } catch (error) {
        throw error;
    }
}

export async function uploadAlbumInfo(album: AlbumInfo): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_ALBUM,
            data: album,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function uploadAlbumFile(form: FormData): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_ALBUM_POST_AUDIO,
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function uploadAlbumArtowrk(form: FormData): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_ALBUM_POST_ARTWORK,
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function getAlbumFile(id: string, name: string): Promise<any> {
    try {
        const response = await axios({
            method: 'GET',
            url: `${Endpoints.API_ALBUM_GET_AUDIO}/${id}/${name}`,
        });

        return response;
    } catch (error: any) {
        throw error;
    }
}

export async function editAlbumData(albumEdit: AlbumEditInfo): Promise<string> {
    try {
        const response = await axios({
            method: 'PUT',
            url: Endpoints.API_ALBUM,
            data: albumEdit,
        });
        return response.data;
    } catch (error: any) {
        return error.message;
    }
}

export async function deleteAlbum(id: string): Promise<string> {
    try {
        const response = await axios.delete(`${Endpoints.API_ALBUM}/${id}`);

        return response.data;
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
