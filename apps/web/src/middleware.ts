import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/mypage"];
const AUTH_PAGES = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  if (token && AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!token && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
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
