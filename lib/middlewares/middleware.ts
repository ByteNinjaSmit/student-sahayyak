// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { connectToDatabase } from "@/database/dbConn";
// import User from "@/database/models/user-model";
// // Define your secret key (store this securely in environment variables)
// const secretKey = process.env.JWT_SECRET_KEY;

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // Skip middleware for non-protected routes (like login, public routes, etc.)
//   if (pathname.startsWith('/api/public') || pathname === '/login') {
//     return NextResponse.next();
//   }

//   // Get the authorization header
//   const authHeader = req.headers.get('authorization');
//   if (!authHeader) {
//     return NextResponse.json(
//       { message: 'Unauthorized HTTP, Token not provided' },
//       { status: 401 }
//     );
//   }

//   const token = authHeader.replace('Bearer', '').trim();
//   if (!token) {
//     return NextResponse.json(
//       { message: 'Unauthorized, Token not provided' },
//       { status: 401 }
//     );
//   }

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
