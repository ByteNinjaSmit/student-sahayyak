"use client";
import React, { useState, createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

// Define the session state type
interface User {
  id: string;
  name: string;
  email: string;
  isHighAuth?: boolean;
  isRector?: boolean;
}

interface SessionState {
  user?: User;
  isAuth: boolean;
  isAdmin: boolean;
  isHighAuth: boolean;
  isRector: boolean;
}

// Create the context
const SessionContext = createContext<SessionState | undefined>(undefined);

// Utility function to reset session state
const resetSessionState = (): SessionState => ({
  user: undefined,
  isAuth: false,
  isAdmin: false,
  isHighAuth: false,
  isRector: false,
});

// Create a provider component
const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionState>(resetSessionState());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const isLoggedInCookie = document.cookie.split('; ').find(row => row.startsWith('isLoggedIn='))?.split('=')[1];
        // console.log("isLoggedInCookie:", isLoggedInCookie); // Debugging line

        if (isLoggedInCookie === "true") {
          // Fetch user data if logged in
          const userResponse = await fetch("/api/auth/user/current");
          if (userResponse.ok) {
            const userData: User = await userResponse.json();
            console.log("User data fetched:", userData); // Debugging line
            setSession(prev => ({ ...prev, user: userData, isAuth: true }));
            setIsLoggedIn(true); // Set isLoggedIn to true when user data is fetched
          } else {
            console.warn("User response not ok:", userResponse.status); // Debugging line
            setSession(resetSessionState());
          }
        } else {
          const adminToken = document.cookie.split('; ').find(row => row.startsWith('admin-token='));
          if (adminToken) {
            const adminResponse = await fetch("/api/auth/admin/current");
            if (adminResponse.ok) {
              const adminData = await adminResponse.json();
              setSession(prev => ({
                ...prev,
                user: adminData,
                isAuth: true,
                isAdmin: true,
                isHighAuth: Boolean(adminData.isHighAuth),
                isRector: Boolean(adminData.isRector),
              }));
              setIsLoggedIn(true); // Set isLoggedIn to true for admin as well
            } else {
              console.warn("Admin response not ok:", adminResponse.status); // Debugging line
              setSession(resetSessionState());
            }
          } else {
            setSession(resetSessionState());
          }
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
        setSession(resetSessionState());
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      document.cookie = "user-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setSession(resetSessionState());
      setIsLoggedIn(false); // Reset isLoggedIn on logout
      router.push("/login");
      toast.success("Logout Successful");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout Failed");
    }
  };

  // Derive states
  const { isAuth, isAdmin, isHighAuth, isRector, user } = session;
  const isUser = isAuth && !isAdmin;
  const isAdminUser = isAdmin;
  const isAdminHighAuth = isAdmin && isHighAuth;
  const isAdminRector = isAdmin && isRector;

  return (
    <SessionContext.Provider
      value={{
        isLoggedIn,
        isUser,
        isAdmin: isAdminUser,
        isHighAuth: isAdminHighAuth,
        isRector: isAdminRector,
        user,
        logout,
        setIsLoggedIn // Provide setIsLoggedIn to the context
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use the Session Context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

// Export the provider
export default SessionProvider;
