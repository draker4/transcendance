import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

	const	code: string | null = req.nextUrl.searchParams.get('code');
	
	if (code) {
		try {
			const	res = await fetch(`http://backend:4000/api/auth/42/${code}`);
			
			const	{ access_token } = await res.json();
			if (!access_token)
				throw new Error("no token");
			
			const	response = NextResponse.redirect(`http://${process.env.HOST_IP}:3000/home`);
			response.cookies.set({
				name: "crunchy-token",
				value: access_token,
				httpOnly: true,
				sameSite: true,
				path: "/",
			})
			return response;

		} catch (err) {
			console.log(err);
		}
	}
	
	redirect("/welcome/login/wrong");
}
