export interface User {
    userId: number;
    username: string;
    email: string;
    joinDate: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface ErrorResponse {
    message: string;
}