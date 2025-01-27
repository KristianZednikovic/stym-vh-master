import {writable} from 'svelte/store';

interface User {
    userId: number;
    username: string;
    email: string;
    joinDate?: string;  // Added this field
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const createAuthStore = () => {
    const {subscribe, set, update} = writable<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false
    });

    return {
        subscribe,
        login: (userData: User, token: string) => {
            if (!userData.joinDate) {
                userData.joinDate = new Date().toLocaleDateString();
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            set({
                user: userData,
                token,
                isAuthenticated: true
            });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({
                user: null,
                token: null,
                isAuthenticated: false
            });
        },
        initialize: () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                const user = JSON.parse(storedUser);
                set({
                    user,
                    token,
                    isAuthenticated: true
                });
            }
        },
        updateUser: (updateUser: User) => {
            update(store => ({
                ...store,
                user: updateUser
            }));
        }
    };
};

export const authStore = createAuthStore();