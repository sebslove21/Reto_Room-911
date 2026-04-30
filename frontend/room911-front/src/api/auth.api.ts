import api from './axios';
import type { LoginRequest, AuthResponse } from '../components/types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/users/me/change-password', { currentPassword, newPassword }),
};
