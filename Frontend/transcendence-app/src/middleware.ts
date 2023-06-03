import { verifyAuth } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {

	const	crunchyToken = req.cookies.get('crunchy-token')?.value;
	// const	token42 = req.cookies.get("_intra_42_session_production")?.value;

	// console.log("token42=",token42);
	// console.log("token42=",client.profile.login);
	// if (client.student42 && !token42) {
	// 	client.token = '';
	// 	return NextResponse.redirect(new URL('/', req.url));
	// }
	const	verifiedToken = crunchyToken && await verifyAuth(crunchyToken)
		.catch((err) => {
			console.log(err);
		});
	
	
	if (req.nextUrl.pathname === '/' && !verifiedToken) {
		return ;
	}

	if (req.nextUrl.pathname === '/' && verifiedToken) {
		return NextResponse.redirect(new URL('/home', req.url));
	}

	if (req.nextUrl.pathname === '/signin' && verifiedToken) {
		return NextResponse.redirect(new URL('/home', req.url));
	}

	if ((req.nextUrl.pathname.startsWith('/home')
		|| req.nextUrl.pathname.startsWith('/game'))
		&& !verifiedToken) {
		return NextResponse.redirect(new URL('/signin', req.url));
	}
}

export const config = {
	matcher: ["/:path*"],
}
