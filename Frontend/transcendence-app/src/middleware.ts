import { verifyAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import Client from "./services/Client.service";

// const	client = new Client();

export async function middleware(req: NextRequest) {

	// console.log("middleware");
	// const	crunchyToken = req.cookies.get('crunchy-token')?.value;
	// const	token42 = req.cookies.get('_intra_42_session_production')?.value;

	// console.log("token42=",token42);
	// console.log("token42=",client.profile.login);
	// if (client.student42 && !token42) {
	// 	client.token = '';
	// 	return NextResponse.redirect(new URL('/', req.url));
	// }

	// const verifiedToken = client.token.length > 0
	// 	&& crunchyToken
	// 	&& await verifyAuth(crunchyToken)
	// 	.catch((err) => {
	// 		console.log(err);
	// 	})

	// console.log("la",verifiedToken);

	
	// if (req.nextUrl.pathname === '/' && !verifiedToken) {
	// 	console.log("0", req.nextUrl.pathname);
	// 	return ;
	// }

	// if (req.nextUrl.pathname === '/' && verifiedToken) {
	// 	console.log("0", req.nextUrl.pathname);
	// 	return NextResponse.redirect(new URL('/home', req.url));
	// }

	// if (req.nextUrl.pathname === '/signin' && verifiedToken) {
	// 	console.log("1");
	// 	return NextResponse.redirect(new URL('/home', req.url));
	// }

	// if (req.nextUrl.pathname.startsWith('/home') && !verifiedToken) {
	// 	console.log(req.nextUrl.pathname);
	// 	console.log(req);
	// 	console.log("2");
	// 	return NextResponse.redirect(new URL('/signin', req.url));
	// }
	
	
	// if (req.nextUrl.pathname === '/' && !verifiedToken) {
	// 	console.log("2");
	// 	return ;
	// }
	
	// if (req.nextUrl.pathname === '/signin' && verifiedToken) {
	// 	console.log("3");
	// 	return NextResponse.redirect(new URL('/home', req.url));
	// }
}

export const config = {
	matcher: ["/:path*"],
}
