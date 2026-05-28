import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/mypage"];
const AUTH_PAGES = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const loginHint = req.cookies.get("tilda_logged_in")?.value;
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(token || loginHint);

  if (isLoggedIn && AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!isLoggedIn && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*", "/login", "/signup"],
};
