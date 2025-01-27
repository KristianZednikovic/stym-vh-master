import {get} from 'svelte/store';
import {authStore} from '../../stores/authStore';
import {API_URL} from '../../config/constants';

interface FetchOptions extends RequestInit {
    auth?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
    try {
        const {auth = false, ...fetchOptions} = options;

        const headers = new Headers({
            'Content-Type': 'application/json',
            ...(fetchOptions.headers as Record<string, string> || {})
        });

        // Add auth token if required
        if (auth) {
            const token = get(authStore).token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }

        console.log('Sending request to:', `${API_URL}${endpoint}`);
        console.log('Request options:', {...fetchOptions, headers});

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...fetchOptions,
            headers
        });

        // Log response status
        console.log('Response status:', response.status);

        return response;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}