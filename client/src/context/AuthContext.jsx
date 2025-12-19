import { createContext, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext); // Renamed to avoid key collision with Clerk's useAuth

export const AuthProvider = ({ children }) => {
    const { getToken, signOut } = useAuth();
    const { user, isLoaded, isSignedIn } = useUser();

    // Configure axios defaults and interceptors
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

    useEffect(() => {
        const interceptorId = axios.interceptors.request.use(async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptorId);
        };
    }, [getToken]);

    // Adapter for legacy context consumers
    const value = {
        user: user,
        loading: !isLoaded,
        isAuthenticated: isSignedIn,
        logout: signOut,
        // login/signup are now handled by Clerk UI components directly
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoaded ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
