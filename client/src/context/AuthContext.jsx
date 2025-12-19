import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext); // Renamed to avoid key collision with Clerk's useAuth

export const AuthProvider = ({ children }) => {
    const { getToken, signOut } = useAuth();
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const [mongoUser, setMongoUser] = useState(null);

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

    // Fetch MongoDB user when Clerk user is loaded
    useEffect(() => {
        const fetchMongoUser = async () => {
            if (isSignedIn) {
                try {
                    const { data } = await axios.get('/queries');
                    // The backend will sync the user, so we just need to get any endpoint
                    // to trigger the sync. Let's create a specific endpoint instead.
                    const response = await axios.get('/me');
                    setMongoUser(response.data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };

        if (isLoaded && isSignedIn) {
            fetchMongoUser();
        }
    }, [isLoaded, isSignedIn]);

    // Adapter for legacy context consumers
    const value = {
        user: mongoUser,  // MongoDB user with _id
        clerkUser: clerkUser,  // Original Clerk user
        loading: !isLoaded,
        isAuthenticated: isSignedIn,
        logout: signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoaded ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
