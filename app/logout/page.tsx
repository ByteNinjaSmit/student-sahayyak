"use client";

import { useEffect } from "react";
import { useAuth } from "../store/auth";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { LogoutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Perform the logout operation
    LogoutUser();
    // Redirect to the login page
    router.push("/login");
  }, [LogoutUser, router]);

  // Since the redirect happens in useEffect, you don't need to return any JSX
  return null;
}
