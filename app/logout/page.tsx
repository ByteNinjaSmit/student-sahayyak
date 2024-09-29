"use client";
import { useEffect } from "react";
import { useAuth } from "../store/auth";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { LogoutUser, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Perform the logout operation only if the user is logged in
    if (isLoggedIn) {
      LogoutUser();
      // Redirect to the login page after logging out
      router.push("/login");
    } else {
      // If already logged out, redirect to home
      router.push("/");
    }
  }, [isLoggedIn, LogoutUser, router]);

  // No JSX needed since the component just handles logout and redirection
  return null;
}
