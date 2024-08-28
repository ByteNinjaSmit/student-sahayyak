"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the shape of your context
interface AuthContextType {
  token: string | null;
  authorizationToken: string;
  storeTokenInLS: (serverToken: string) => void;
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

  // Function to store the token in both state and localStorage
  const storeTokenInLS = (serverToken: string) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  // Function to log out the user
  const LogoutUser = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  // Check if the user is logged in
  const isLoggedIn = !!token;

  // useEffect to synchronize the token from localStorage on initial load
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
    setIsLoading(false); // Stop loading once token is initialized
  }, []);

  // If loading, you might want to return a loader or null to prevent flashing UI
  if (isLoading) {
    return null; // or return a loader/spinner here
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        authorizationToken: `Bearer ${token}`,
        storeTokenInLS,
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
