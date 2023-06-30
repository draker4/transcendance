import Client from "@/services/Client.service";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const	client = new Client();

export async function GET(req: NextRequest) {

	const	code: string | null = req.nextUrl.searchParams.get('code');
	const	cookie = getCookie("crunchy-token");
	
	if (code && !cookie) {
		try {
			await client.logIn42(code);
		} catch (err) {
			console.log(err);
		}
		
		if (client.token.length > 0) {
			const	response = NextResponse.redirect(`http://${process.env.HOST_IP}:3000/home`);
			response.cookies.set({
				name: "crunchy-token",
				value: client.token,
			})
			return response;
		}
	}
	
	redirect("/welcome/login/wrong");
}
