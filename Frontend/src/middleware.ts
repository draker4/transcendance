import { verifyAuth } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  let crunchyToken = req.cookies.get("crunchy-token")?.value;
  let refreshToken = req.cookies.get("refresh-token")?.value;
  let changeCookies = false;

  // if (!refreshToken)
  //   crunchyToken = undefined;

  let verifiedToken =
    crunchyToken &&
    (await verifyAuth(crunchyToken).catch((err) => {
      console.log(err);
    }));
  // const url = req.nextUrl;

  if (verifiedToken && req.nextUrl.pathname === "/home/auth/google") {
    // console.log("do nothing go to google");
    return ;
  }

  if (verifiedToken && verifiedToken.twoFactorAuth && req.nextUrl.pathname !== "/home/auth/2fa") {
    return NextResponse.redirect(new URL("/home/auth/2fa", req.url));
  }

  // refresh token if token expires in less than 10 minutes
  if (req.nextUrl.pathname.startsWith("/home") && refreshToken) {

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (!verifiedToken || (verifiedToken && verifiedToken.exp! - currentTimestamp < 300)) {
      try {
        const res = await fetch(`http://backend:4000/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + crunchyToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "refreshToken": refreshToken,
          }),
        });

        if (!res.ok)
          throw new Error('error fetch refresh token');

        const data = await res.json();
        crunchyToken = data.access_token;
        refreshToken = data.refresh_token;
        changeCookies = true;
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  if (
    verifiedToken &&
    verifiedToken.login &&
    req.nextUrl.pathname === "/home/create"
  ) {
    // console.log("redirect go to home")
    const response = NextResponse.redirect(new URL("/home", req.url));
    if (changeCookies && refreshToken) {
      response.cookies.set("crunchy-token", crunchyToken as string, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      response.cookies.set("refresh-token", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
    return response;
  }

  if (
    verifiedToken &&
    !verifiedToken.login &&
    req.nextUrl.pathname.startsWith("/home") &&
    req.nextUrl.pathname !== "/home/create"
  ) {
    // console.log("redkirect go create");
    const response = NextResponse.redirect(new URL("/home/create", req.url));
    if (changeCookies && refreshToken) {
      response.cookies.set("crunchy-token", crunchyToken as string, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      response.cookies.set("refresh-token", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
    return response;
  }

  if (req.nextUrl.pathname === "/" && !verifiedToken && !changeCookies) {
    // console.log("redirect go to welcome")
    return NextResponse.redirect(new URL("/welcome", req.url));
  }

  if (req.nextUrl.pathname === "/" && (verifiedToken || changeCookies)) {
    // console.log("redirect go to home from /")
    const response = NextResponse.redirect(new URL("/home", req.url));
    if (changeCookies && refreshToken) {
      response.cookies.set("crunchy-token", crunchyToken as string, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      response.cookies.set("refresh-token", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
    return response;
  }

  if (req.nextUrl.pathname.startsWith("/welcome") && (verifiedToken || changeCookies)) {
    // console.log("redirect go to home from /welcome")

    const response = NextResponse.redirect(new URL("/home", req.url));
    if (changeCookies && refreshToken) {
      response.cookies.set("crunchy-token", crunchyToken as string, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      response.cookies.set("refresh-token", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    }
    return response;
  }

  if (req.nextUrl.pathname.startsWith("/home") && !verifiedToken && !changeCookies) {
    // console.log("redirect go to welcome from /home")

    return NextResponse.redirect(new URL("/welcome/notif", req.url));
  }

  // console.log("nothing redirected");

  if (changeCookies && refreshToken) {
    const response = NextResponse.next();
    response.cookies.set("crunchy-token", crunchyToken as string, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    response.cookies.set("refresh-token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    return response;
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
