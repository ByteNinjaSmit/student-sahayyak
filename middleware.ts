import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

//   // Define public paths
  const publicPaths = ["/faq", "/contact", "/login", "/rule-regulations"];
  const publicApiPath = ["/api/auth/user/login","/api/auth/user/register","/api/auth/admin/login","/api/auth/logout"]
//   // Define user-specific paths
  // const userPaths = [
  //   "/user:/dashboard",
  //   "/user:/issue/categories:/issue:/form",
  //   "/user:/issue/categories:",
  // ];

//   // Define admin-specific paths
//   const adminPaths = ["/admin/admin:/dashboard"];

//   // Define protected API routes
//   const userAPIRoutes = [
//     "/api/userdata/userinfo/id:",
//     "/issues/user:/issue:",
//   ];

//   // Get tokens from cookies
  const userToken = request.cookies.get("user-token")?.value || "";
  const adminToken = request.cookies.get("admin-token")?.value || "";

  if(!userToken || !adminToken){

  }

//   // Redirect logic for public paths
//   if (publicPaths.includes(path) && userToken) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Redirect if accessing a protected path without a user token
//   if (!publicPaths.includes(path) && !userToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Additional check for user paths
//   if (userPaths.includes(path) && !userToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Admin path protection
//   if (adminPaths.includes(path) && !adminToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Protect API routes
//   if (userAPIRoutes.some(route => path.startsWith(route)) && !userToken) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }
}

// // Configuration for which paths to apply the middleware to
export const config = {
  matcher: [
    // "/",
    // "/faq",
    // "/contact",
    // "/api/:path*", // Apply middleware to all API routes
    // "/:user/dashboard",
    // "/:user/:path"
    // "/:user/issue/categories:/issue:/form",
    // "/admin/admin:/dashboard",
  ],
};
