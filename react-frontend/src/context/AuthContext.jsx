import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize axios defaults
    axios.defaults.baseURL = API_BASE_URL;

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const res = await axios.get('/api/auth/me');
                setUser(res.data.user);
            } catch (err) {
                console.error("Token verification failed", err);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email, password, readiness = null) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/login', {
                email,
                password,
                readiness // Pass CRG state to backend
            });

            const { access_token, refresh_token, user } = res.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser(user);
            return true;
        } catch (err) {
            console.error("Login failed", err);
            setError(err.response?.data?.error || 'Login failed');
            return false;
        }
    };

    const register = async (name, email, password) => {
        setError(null);
        try {
            const res = await axios.post('/api/auth/register', { name, email, password });
            // Could auto-login here or ask to login.
            // Let's return success so UI can redirect to login or auto-login.
            return true;
        } catch (err) {
            console.error("Registration failed", err);
            setError(err.response?.data?.error || 'Registration failed');
            return false;
        }
    };

    const logout = async () => {
        // Optional: Call backend logout to blacklist token
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const uploadProfileImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await axios.post('/api/user/upload-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update local user state with new image
            if (user) {
                const updatedUser = { ...user, profile_image: res.data.profile_image };
                setUser(updatedUser);
            }
            return true;
        } catch (err) {
            console.error("Upload failed", err);
            return false;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        uploadProfileImage
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
