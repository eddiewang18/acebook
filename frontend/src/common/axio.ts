// src/common/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request 攔截器 → 自動加 access token
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// ✅ Response 攔截器 → 自動刷新 token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // 用 refresh token 換新 access token
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}token/refresh/`,
            { refresh: refreshToken },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );

          const newAccessToken = res.data.access;

          // ✅ 存回正確位置！
          localStorage.setItem('access_token', newAccessToken);

          // ✅ 更新 header 再重發原請求
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error('刷新失敗，強制登出或導向登入頁');
          // 可加上：localStorage.clear()、router.push('/login')
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
