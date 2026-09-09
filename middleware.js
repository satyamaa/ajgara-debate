import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Login page को हमेशा allow करें
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // सिर्फ /admin pages protect करें
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("ajgara_session")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    try {
      await jwtVerify(token, secret);

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
