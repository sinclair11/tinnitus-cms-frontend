import axios from 'axios';

export async function refreshToken(token: string): Promise<any> {
    try {
        const response = await axios.get('http://localhost/api/auth/refresh', {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}
