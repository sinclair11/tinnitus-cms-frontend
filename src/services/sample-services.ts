import { SampleInfo, SampleInfoEdit } from '@src/types/sample';
import { Endpoints } from '@src/constants';
import axios from 'axios';

export async function getSamples(): Promise<SampleInfo[]> {
    try {
        const response = await axios.get(Endpoints.API_GET_SAMPLES);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getSampleById(id: string): Promise<SampleInfo> {
    try {
        const response = await axios.get(`${Endpoints.API_SAMPLE}/${id}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function checkSampleName(name: string): Promise<boolean> {
    try {
        return await (
            await axios.get(`${Endpoints.API_SAMPLE_CHECK}/${name}`)
        ).data;
    } catch (error) {
        throw error;
    }
}

export async function uploadSampleInfo(info: SampleInfo): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_SAMPLE,
            data: info,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function editSampleData(info: SampleInfoEdit): Promise<string> {
    try {
        const response = await axios({
            method: 'PUT',
            url: Endpoints.API_SAMPLE,
            data: info,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function uploadSampleFile(form: FormData): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_SAMPLE_POST_AUDIO,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: form,
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function uploadSampleArtwork(form: FormData): Promise<string> {
    try {
        const response = await axios({
            method: 'POST',
            url: Endpoints.API_SAMPLE_POST_ARTWORK,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: form,
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function deleteSample(id: string): Promise<string> {
    try {
        const response = await axios.delete(`${Endpoints.API_SAMPLE}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getSampleReviews(id: string, date: Date): Promise<any[]> {
    try {
        return [];
    } catch (error) {
        throw error;
    }
}
