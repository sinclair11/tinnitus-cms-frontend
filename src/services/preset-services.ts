import { PresetEditInfo, PresetInfo } from '@src/types/preset';
import { Endpoints } from '@src/constants';
import axios from 'axios';

export async function getPresets(): Promise<PresetInfo[]> {
    try {
        const response = await axios.get(Endpoints.API_GET_PRESETS);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getPresetById(id: string): Promise<PresetInfo> {
    try {
        const response = await axios.get(`${Endpoints.API_PRESET}/${id}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function checkPresetName(name: string): Promise<boolean> {
    try {
        return (await axios.get(`${Endpoints.API_PRESET_CHECK}/${name}`)).data;
    } catch (error) {
        throw error;
    }
}

export async function uploadPresetInfo(info: PresetInfo): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_PRESET,
            data: info,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function uploadPresetFile(form: FormData, controller: AbortController): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_PRESET_POST_AUDIO,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: form,
            signal: controller.signal,
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function uploadPresetArtwork(form: FormData, controller: AbortController): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_PRESET_POST_ARTWORK,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: form,
            signal: controller.signal,
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function editPresetData(info: PresetEditInfo): Promise<string> {
    try {
        const response = await axios({
            method: 'PUT',
            url: Endpoints.API_PRESET,
            data: info,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deletePreset(id: string): Promise<string> {
    try {
        const response = await axios.delete(`${Endpoints.API_PRESET}/${id}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getPresetReviews(id: string, date: Date): Promise<any[]> {
    try {
        return [];
    } catch (error) {
        throw error;
    }
}
