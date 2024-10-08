"use client";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Define the user object shape
interface User {
  id: string;
  name: string;
  isHighAuth?: boolean;
  isRector?: boolean;
}

// Define the session state type
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
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | undefined>(undefined);

  // Function to store token in cookie (for auth) and localStorage (for persistence)
  const storeTokenInLS = (serverToken: string) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const isLoggedIn = !!token;

  // Fetch user details based on cookie or localStorage
  const fetchUserData = async () => {
    if (!token) return;
    try {
      const isLoggedInCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("isLoggedIn="))
        ?.split("=")[1];

      if (isLoggedInCookie === "true") {
        const userResponse = await fetch("/api/auth/user/current");
        if(!userResponse.ok){
          toast.error("error getting User")
        }
        if (userResponse.ok) {
          // toast.error("Fetched Again")
          const userData: User = await userResponse.json();
          setUserData(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          setSession((prev) => ({
            ...prev,
            user: userData,
            isAuth: true,
          }));
          setIsLoading(false);
        } else {
          setSession(resetSessionState());
        }
      } else {
        // Check for admin token
        const adminToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("admin-token="));
        if (adminToken) {
          const adminResponse = await fetch("/api/auth/admin/current");
          if(!adminResponse.ok){
            toast.error("error getting User")
          }
          if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            setUserData(adminData);
            localStorage.setItem("user", JSON.stringify(adminData));

            setSession((prev) => ({
              ...prev,
              user: adminData,
              isAuth: true,
              isAdmin: true,
              isHighAuth: Boolean(adminData.isHighAuth),
              isRector: Boolean(adminData.isRector),
            }));
          } else {
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

  // Load token and user from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userFromStorage = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (userFromStorage) {
      try {
        setUserData(JSON.parse(userFromStorage));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }

    setIsLoading(false); // Stop loading once token and user are initialized
  }, []);

  useEffect(() => {
    if (token) {
      if(userData === undefined)
        fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [userData,token]);

  // Logout function to clear cookies and localStorage
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      document.cookie =
        "user-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.clear();
      setToken(null);
      setUserData(null);
      setSession(resetSessionState());
      router.push("/login");
      toast.success("Logout Successful");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout Failed");
    }
  };

  // Derive the user states
  const { isAuth, isAdmin, isHighAuth, isRector, user } = session;

  return (
    <SessionContext.Provider
      value={{
        ...session,
        isLoggedIn,
        storeTokenInLS,
        isUser: isAuth && !isAdmin,
        isAdmin,
        isHighAuth: isAdmin && isHighAuth,
        isRector: isAdmin && isRector,
        user,
        userData,
        logout,
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
