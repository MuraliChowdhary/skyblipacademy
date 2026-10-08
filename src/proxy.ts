import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";

// test
const PROTECTED_PAGE_PREFIXES = ["/dashboard"];
const PROTECTED_API_PREFIXES = ["/api/me"];

function isProtected(pathname: string): boolean {
  if (PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return true;
  }

  if (PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return true;
  }

  if (
    pathname.startsWith("/api/courses/") &&
    pathname.endsWith("/purchase")
  ) {
    return true;
  }

  return false;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const requestId =
    req.headers.get("x-request-id") ?? crypto.randomUUID();

  // Already logged in → don't allow visiting login again
  if (pathname === "/login" && req.auth) {
    const dest = req.auth.user?.role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.nextUrl.origin));
  }

  // Admin page protection
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (req.auth.user?.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard", req.nextUrl.origin)
      );
    }
  }

  // Admin API protection
  if (pathname.startsWith("/api/admin")) {
    if (!req.auth) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Sign in required.",
          },
        },
        {
          status: 401,
          headers: { "x-request-id": requestId },
        }
      );
    }

    if (req.auth.user?.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Admin access required.",
          },
        },
        {
          status: 403,
          headers: { "x-request-id": requestId },
        }
      );
    }
  }

  // General protected routes
  if (isProtected(pathname) && !req.auth) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Sign in required.",
          },
        },
        {
          status: 401,
          headers: {
            "x-request-id": requestId,
          },
        }
      );
    }

    const loginUrl = new URL("/login", req.nextUrl.origin);

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/register",
    "/login",
    "/api/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
