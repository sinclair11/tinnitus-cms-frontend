import axios from 'axios';

export function refreshToken(token: string, expiration: number): void {
    window.setTimeout(async () => {
        try {
            const response = await axios.get('http://localhost/api/auth/refresh', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const receivedToken = response.data;
            window.sessionStorage.setItem('token', JSON.stringify(receivedToken));
            refreshToken(receivedToken.value, receivedToken.expiration);
        } catch (error) {
            throw error;
        }
    }, expiration - 1000 * 60);
}
