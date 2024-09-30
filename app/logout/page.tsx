"use client";
import { useEffect } from "react";
import { useAuth } from "../store/auth";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

export default function Logout() {
  const { LogoutUser, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // Call the server-side logout route to remove the auth-token
        await fetch("/api/auth/logout", {
          method: "POST",
        });

        // Perform the client-side logout action (e.g., removing local state)
        LogoutUser();

        // Redirect to login page after logging out
        router.push("/login");
        
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    // Perform the logout operation only if the user is logged in
    if (isLoggedIn) {
      logout();
      toast.success("Logout Successful");
    } else {
      router.push("/");
    }
  }, [isLoggedIn, LogoutUser, router]);

  // No JSX needed since the component just handles logout and redirection
  return null;
}
