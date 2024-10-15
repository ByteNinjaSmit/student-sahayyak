import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const publicPaths = ["/login", "/register"];
  const publicVisitsPath = ["/contact", "/faq", "/rule-regulations"];
  const publicApiPath = [
    "/api/auth/user/login",
    "/api/auth/admin/login",
    "/api/auth/logout",
  ];


  // Define user-specific paths
  const userPaths = [
    "/client/:path", // Match any path under a user's route
  ];
  const adminPaths = [
    "/admin/:path", // Match any path under an admin's route
  ];

  // Define protected API routes
  const userAPIRoutes = ["/api/issues/:path"];
  const adminAPIRoutes = ["/api/admin/:path*","/api/auth/user/register","/api/userdata/userinfo/:path*","/api/issues/:path*","/api/auth/admin/users"];

  // Get tokens from cookies
  const userToken = request.cookies.get("user-token")?.value || "";
  const adminToken = request.cookies.get("admin-token")?.value || "";

  // Verify Token
  //   try {
//     // Verify the JWT token
//     const isVerified = jwt.verify(token, secretKey);

//     // Connect to the database
//     await connectToDatabase();

//     // Fetch user data excluding the password
//     const userData = await User.findOne({ email: isVerified.email }).select({
//       password: 0,
//     });

//     if (!userData) {
//       return NextResponse.json(
//         { message: 'Unauthorized, User not found' },
//         { status: 404 }
//       );
//     }

//     // Attach user data and token to the request object (Next.js way)
//     req.user = userData;
//     req.token = token;
//     req.userID = userData._id;

//     return NextResponse.next(); // Allow the request to continue
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     return NextResponse.json(
//       { message: 'Unauthorized. Invalid Token.' },
//       { status: 401 }
//     );
//   }
// }




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
      if ((request.nextUrl.pathname.startsWith("/api"))) {
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

  // Admin Protect API Routes
  if (
    adminAPIRoutes.some((route) =>
      path.startsWith(route.replace(/:\w+/g, ""))
    ) &&
    !adminToken
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
