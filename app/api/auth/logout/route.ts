// File: app/api/auth/logout/route.ts

import { NextResponse } from "next/server";

// Server-side logout route in Next.js
export async function POST() {
  // Create the response object
  const response = NextResponse.json({ message: "Logged out" });

  // Clear the user-token cookie
  response.cookies.set('user-token', '', {
    httpOnly: true,
    path: '/', // Make sure the path is correct for your application
    // secure: process.env.NODE_ENV === 'production', // Ensure secure in production
    expires: new Date(0), // Expire immediately
  });

  // Clear the admin-token cookie
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    path: '/', // Make sure the path is correct for your application
    // secure: process.env.NODE_ENV === 'production', // Ensure secure in production
    expires: new Date(0), // Expire immediately
  });

  return response;
}
