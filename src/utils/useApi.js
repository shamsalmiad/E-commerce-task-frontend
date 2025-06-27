import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            console.log(error.response.status, 'error response status');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/refresh-token`, {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });

                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('access_token', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

const apiCall = async (method, url, data = null, params = null) => {
    try {
        const config = {
            method,
            url,
            data,
            params,
            headers: {
                'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
            },
        };

        const response = await axiosInstance(config);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response || error.message);
        throw error.response ? error.response.data : error.message;
    }
};

export default apiCall;
