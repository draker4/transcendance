import { verifyAuth } from "@/lib/auth/auth";
import { Token } from "@mui/icons-material";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const crunchyToken = req.cookies.get("crunchy-token")?.value;
  let refreshToken: string = "";

  let verifiedToken =
    crunchyToken &&
    (await verifyAuth(crunchyToken).catch((err) => {
      console.log(err);
    }));
  // const url = req.nextUrl;
  // console.log(verifiedToken);

  // refresh token if token expires in less than 5 minutes
  if (verifiedToken && verifiedToken.exp && req.nextUrl.pathname.startsWith("/home")) {

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (verifiedToken.exp - currentTimestamp < 300) {
      console.log(verifiedToken.exp - currentTimestamp);
    }
    // try {
    //   const res = await fetch(`http://${process.env.HOST_IP}:4000/api/auth/refresh`, {
    //     method: "POST",
    //   });

    //   refreshToken = await res.json();
    // }
    // catch (error) {
    //   console.log(error);
    // }
  }

  if (
    verifiedToken &&
    verifiedToken.login &&
    req.nextUrl.pathname === "/home/create"
  ) {
    const response = NextResponse.redirect(new URL("/home", req.url));
    if (refreshToken.length > 0)
      response.cookies.set("crunchy-token", refreshToken, {
        httpOnly: true,
        sameSite: true,
      });
    return response;
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
    const response = NextResponse.redirect(new URL("/home", req.url));
    if (refreshToken.length > 0)
      response.cookies.set("crunchy-token", refreshToken, {
        httpOnly: true,
        sameSite: true,
      });
    return response;
  }

  if (req.nextUrl.pathname.startsWith("/welcome") && verifiedToken) {
    const response = NextResponse.redirect(new URL("/home/create", req.url));
    if (refreshToken.length > 0)
      response.cookies.set("crunchy-token", refreshToken, {
        httpOnly: true,
        sameSite: true,
      });
    return response;
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
