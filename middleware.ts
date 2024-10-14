import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const publicPaths = ["/login", "/register"];
  const publicVisitsPath = ["/contact", "/faq", "/rule-regulations"];
  const publicApiPath = [
    "/api/auth/user/login",
    "/api/auth/user/register",
    "/api/auth/admin/login",
    "/api/auth/logout",
    "/api/auth/admin/register",
  ];

  // Define user-specific paths
  const userPaths = [
    "/client/:path", // Match any path under a user's route
  ];
  const adminPaths = [
    "/admin/:path", // Match any path under an admin's route
  ];

  // Define protected API routes
  const userAPIRoutes = ["/issues/:path"];

  // Get tokens from cookies
  const userToken = request.cookies.get("user-token")?.value || "";
  const adminToken = request.cookies.get("admin-token")?.value || "";

  // Redirect logic for public paths
  if (publicPaths.includes(path)) {
    if (userToken || adminToken) {
      // If user or admin is logged in, redirect them to the home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Redirect if accessing a protected path without a user token
  if (
    !publicPaths.includes(path) &&
    !publicVisitsPath.includes(path) &&
    !publicApiPath.includes(path)
  ) {
    if (!userToken && !adminToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect user-specific paths
  if (path.startsWith("/client/")) {
    // Redirect to login if accessing client paths without a user token
    if (!userToken) {
      if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json(
          {
            message: "Access Denied!!",
            success: false,
          },
          {
            status: 401,
          }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  // Protect user-specific paths
  if (path.startsWith("/admin/")) {
    // Redirect to login if accessing client paths without a user token
    if (!adminToken) {
      if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json(
          {
            message: "Access Denied!!",
            success: false,
          },
          {
            status: 401,
          }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect API routes
  if (
    userAPIRoutes.some((route) =>
      path.startsWith(route.replace(/:\w+/g, ""))
    ) &&
    !userToken
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Add other custom logic if needed
}

// Configuration for which paths to apply the middleware to
export const config = {
  matcher: [
    "/login",
    "/register",
    "/api/:path*", // Apply middleware to all API routes
    "/client/:path*", // Apply middleware to all client-specific routes
    "/admin/:path*",
  ],
};
