import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";

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

  // Already logged in → don't allow visiting login again
  if (pathname === "/login" && req.auth) {
    return NextResponse.redirect(
      new URL("/dashboard", req.nextUrl.origin)
    );
  }

  const requestId =
    req.headers.get("x-request-id") ?? crypto.randomUUID();

  // Protected routes
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
  ],
};