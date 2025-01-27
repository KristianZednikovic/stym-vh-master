import { goto } from '$app/navigation';
import { fetchApi } from './api';
import { authStore } from '../../stores/authStore';
import type { AuthResponse, ErrorResponse } from '../types/user';

export async function login(username: string, password: string) {
    try {
        const response = await fetchApi('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json() as AuthResponse;
            authStore.login(data.user, data.token);
            return { success: true };
        } else {
            const error = await response.json() as ErrorResponse;
            return { success: false, error: error.message };
        }
    } catch (error) {
        return { success: false, error: 'An error occurred while logging in' };
    }
}

export async function logout() {
    try {
        await fetchApi('/api/users/logout', {
            method: 'POST',
            auth: true
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        authStore.logout();
        goto('/login');
    }
}

export function requireAuth() {
    if (!localStorage.getItem('token')) {
        goto('/login');
    }
}