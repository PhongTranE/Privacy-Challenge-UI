import { create } from 'zustand'
import { UserInterface } from '@/types/common/userTypes';
import { checkAuth } from '@/services/api/authApi';

type AuthState = {
    user: UserInterface | null
    isAuthenticated: boolean
    isCheckingAuth: boolean

    checkAuth: () => Promise<void>
    authenticate: (userData: UserInterface) => void
    unauthenticate: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    isCheckingAuth: false,
    user: null,

    authenticate: (userData) => {
        set({isAuthenticated: true, user: userData})
    },

    unauthenticate: () => {
        set({isAuthenticated: false, user: null})
    },

    checkAuth: async () => {
        set({isCheckingAuth: true})
        try{
            const res = await checkAuth();
            const userData = res.data?.user;
            if (userData){
                get().authenticate(userData);
            }
        } catch(error){
            get().unauthenticate();
            throw error;
        } finally{
            set({isCheckingAuth: false})
        }
    }

}))
