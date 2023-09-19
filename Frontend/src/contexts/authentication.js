import React, { createContext, useState, useContext } from "react";

const auth = createContext();

export const useAuth = () => {
    return useContext(auth);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const saveToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);

        const decodedToken = parseJwt(newToken);
        if (decodedToken && decodedToken.role) {
            setUserRole(decodedToken.role);
            localStorage.setItem("userRole", decodedToken.role);
        }
    };

    const removeToken = () => {
        setToken(null);
        setUserRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");
    };

    const value = {
        token,
        userRole,
        saveToken,
        removeToken
    };

    return <auth.Provider value={value}>{children}</auth.Provider>;
};
