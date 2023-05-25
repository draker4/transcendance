import { verifyAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import Client from "./services/Client.service";

const	client = new Client();

export async function middleware(req: NextRequest) {

	// console.log("middleware");
	const token = req.cookies.get('crunchy-token')?.value;

	const verifiedToken = client.token.length > 0
		&& token
		&& await verifyAuth(token)
		.catch((err) => {
			console.log(err);
		})

	// console.log("la",verifiedToken);

	
	// if (req.nextUrl.pathname === '/' && !verifiedToken) {
	// 	console.log("0", req.nextUrl.pathname);
	// 	return ;
	// }

	if (req.nextUrl.pathname === '/' && verifiedToken) {
		console.log("0", req.nextUrl.pathname);
		return NextResponse.redirect(new URL('/home', req.url));
	}

	if (req.nextUrl.pathname === '/signin' && verifiedToken) {
		console.log("1");
		return NextResponse.redirect(new URL('/home', req.url));
	}

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
