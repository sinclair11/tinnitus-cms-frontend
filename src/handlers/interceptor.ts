import axios from 'axios';

export function initInterceptorHandler(): void {
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error: any) => {
            if (error.response.status === 401) {
                window.sessionStorage.clear();
                error.message = 'Unauthorized access';
                return (window.location.href = '/login');
            }
            return Promise.reject(error);
        },
    );

    axios.interceptors.request.use((config) => {
        const tokenJSON = window.sessionStorage.getItem('token');
        //Token available only after login
        if (tokenJSON != null) {
            const token = JSON.parse(tokenJSON);
            config.headers.Authorization = `Bearer ${token.value}`;
        }
        return config;
    });
}
