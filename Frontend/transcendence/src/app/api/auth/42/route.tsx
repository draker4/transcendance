import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

	const	code: string | null = req.nextUrl.searchParams.get('code');
	
	if (code) {
		try {
			const	res = await fetch(`http://${process.env.HOST_IP}:4000/api/auth/42/${code}`);
			
			const	{ access_token, refresh_token } = await res.json();
			console.log(access_token, refresh_token);
			if (!access_token || !refresh_token)
				throw new Error("no token");
			
			const	response = NextResponse.redirect(`http://${process.env.HOST_IP}:3000/home`);
			response.cookies.set({
				name: "crunchy-token",
				value: access_token,
				httpOnly: true,
				sameSite: true,
				path: "/",
			});
			response.cookies.set({
				name: "refresh-token",
				value: refresh_token,
				httpOnly: true,
				sameSite: true,
				path: "/",
			});
			return response;

		} catch (err) {
			console.log(err);
		}
	}
	
	redirect("/welcome/login/wrong");
}
