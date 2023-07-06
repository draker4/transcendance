import { verifyAuth } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const crunchyToken = req.cookies.get("crunchy-token")?.value;

  const verifiedToken =
    crunchyToken &&
    (await verifyAuth(crunchyToken).catch((err) => {
      console.log(err);
    }));
  // const url = req.nextUrl;
  // console.log(verifiedToken, url);

  if (
    verifiedToken &&
    verifiedToken.login &&
    req.nextUrl.pathname === "/home/create"
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (
    verifiedToken &&
    !verifiedToken.login &&
    req.nextUrl.pathname.startsWith("/home") &&
    req.nextUrl.pathname !== "/home/create"
  ) {
    return NextResponse.redirect(new URL("/home/create", req.url));
  }

  if (req.nextUrl.pathname === "/" && !verifiedToken) {
    return NextResponse.redirect(new URL("/welcome", req.url));
  }

  if (req.nextUrl.pathname === "/" && verifiedToken) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/welcome") && verifiedToken) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/home") && !verifiedToken) {
    return NextResponse.redirect(new URL("/welcome", req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - icon, images
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|icon|images|_next/static|_next/image|favicon.ico).*)',
  ],
};
