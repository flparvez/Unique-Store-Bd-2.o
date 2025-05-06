import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // ✅ Allow guest access to login/register page when not authenticated
    if ((pathname === "/auth/login" || pathname === "/auth/register") && !token) {
      return NextResponse.next();
    }

    // 🚫 Redirect authenticated users away from login/register
    if ((pathname === "/auth/login" || pathname === "/auth/register") && token) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // 🔐 Protect profile routes
    if (pathname.startsWith("/profile") && !token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 🛑 Protect admin routes: only for admin role
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Let your logic above decide access
    },
  }
);

// ✅ Use matcher correctly
export const config = {
  matcher: [
    "/admin/:path*",    
    "/profile/:path*",  
    "/auth/login",      // exact login path
    "/auth/register",   // exact register path
  ],
};
