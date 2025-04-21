// Type for authentication related responses
import { UserInterface } from '@/types/common/userTypes';

export interface RegisterResponseData {
    user: UserInterface
}

export interface LoginResponseData {
    accessToken: string;
    user: UserInterface
}

export interface RefreshTokenResponseData {
    accessToken: string;
}

export interface MeResponseData {
    user: UserInterface;
}

