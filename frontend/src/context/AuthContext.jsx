import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    let initialUser = null;
    let initialToken = null;

    try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        // Prevent JSON.parse crash on invalid values
        if (storedUser && storedUser !== "undefined") {
            initialUser = JSON.parse(storedUser);
        }

        if (storedToken && storedToken !== "undefined") {
            initialToken = storedToken;
        }
    } catch (error) {
        console.error("Invalid auth data in localStorage. Clearing...");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    const [user, setUser] = useState(initialUser);
    const [token, setToken] = useState(initialToken);
    const [loading, setLoading] = useState(false);

    const login = (authToken, userData) => {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};