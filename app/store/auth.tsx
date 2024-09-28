"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define the shape of your User object
interface User {
  username: string;
  room: string;
  hostelId: string;
  // Add any other user properties if needed
}

// Define the shape of your context
interface AuthContextType {
  token: string | null;
  user: User | null;
  authorizationToken: string;
  storeTokenInLS: (serverToken: string) => void;
  storeUserInContext: (userData: User) => void;
  storeUserId: (serverUserId: string) => void; // Function to store user ID
  LogoutUser: () => void;
  isLoggedIn: boolean;
  userId: string | null; // Expose userId in the context
  fetchUserDetails: (userId: string) => Promise<void>; // Function to fetch user details
  allUserDetails: User[]; // Expose the array of user details
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
  const [userId, setUserId] = useState<string | null>(null);
  const [allUserDetails, setAllUserDetails] = useState<User[]>([]); // Array to store all user details

  // Function to store the token in both state and localStorage
  const storeTokenInLS = (serverToken: string) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  // Function to store the user ID in both state and localStorage
  const storeUserId = (serverUserId: string) => {
    setUserId(serverUserId);
    localStorage.setItem("userId", serverUserId);
    // Fetch user details whenever the userId is set
    fetchUserDetails(serverUserId);
  };

  // Function to log out the user
  const LogoutUser = () => {
    setToken(null);
    setUser(null);
    setUserId(null); // Clear userId on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setAllUserDetails([]); // Clear the user details array
  };

  // Function to store user information in state, array, and localStorage
  const storeUserInContext = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Push the user data into the array
    setAllUserDetails(prevDetails => [...prevDetails, userData]); 
  };

  // Function to fetch user details from API
  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/userdata/userinfo/${userId}`, {
        method: "POST", // Use POST instead of GET
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token if needed
        },
        body: JSON.stringify({ id: userId }), // Pass userId in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await response.json();
      storeUserInContext(userData); // Store user details in context
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Check if the user is logged in
  const isLoggedIn = !!token;

  // useEffect to synchronize the token and user from localStorage on initial load
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const userFromStorage = localStorage.getItem("user");
    const userIdFromStorage = localStorage.getItem("userId");

    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
    if (userIdFromStorage) {
      setUserId(userIdFromStorage); // Retrieve userId from localStorage
      fetchUserDetails(userIdFromStorage); // Fetch user details on load
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
        storeUserId,
        userId, // Expose userId to context consumers
        isLoggedIn,
        fetchUserDetails, // Expose fetchUserDetails in the context
        allUserDetails, // Expose all user details
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
