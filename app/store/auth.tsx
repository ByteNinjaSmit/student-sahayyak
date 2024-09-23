"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the shape of your User object
interface User {
  username: string;
  room: string;
  hostelId: string;
  // add any other user properties if needed
}

// Define the shape of your context
interface AuthContextType {
  token: string | null;
  user: User | null;
  authorizationToken: string;
  storeTokenInLS: (serverToken: string) => void;
  storeUserInContext: (userData: User) => void;
  LogoutUser: () => void;
  isLoggedIn: boolean;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Function to store the token in both state and localStorage
  const storeTokenInLS = (serverToken: string) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  // Function to log out the user
  const LogoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Function to store user information in state and localStorage
  const storeUserInContext = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Check if the user is logged in
  const isLoggedIn = !!token;

  // useEffect to synchronize the token and user from localStorage on initial load
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const userFromStorage = localStorage.getItem("user");

    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }

    if (userFromStorage) {
      try {
        setUser(JSON.parse(userFromStorage));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }

    setIsLoading(false); // Stop loading once token and user are initialized
  }, []);

  // If loading, you might want to return a loader or null to prevent flashing UI
  if (isLoading) {
    return null; // or return a loader/spinner here
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authorizationToken: token ? `Bearer ${token}` : "",
        storeTokenInLS,
        storeUserInContext,
        LogoutUser,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return authContextValue;
};
