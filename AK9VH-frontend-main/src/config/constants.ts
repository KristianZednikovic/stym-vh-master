export const API_URL = 'http://localhost:3000';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    HOMEPAGE: '/homepage',
    PROFILE: '/homepage/profile',
    STORE: '/homepage/store',
    LIBRARY: '/homepage/library',
    SETTINGS: '/homepage/settings',
    GAME_ONE: '/games/game-one',
    GAME_TWO: '/games/game-two'
} as const;

export const API_ENDPOINTS = {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    LOGOUT: '/api/users/logout'
} as const;

export const DELAYS = {
    LOGIN_DELAY: 500,
    REGISTER_REDIRECT_DELAY: 1000
}