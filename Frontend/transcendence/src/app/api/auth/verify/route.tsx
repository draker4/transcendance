import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const	code: string | null = req.nextUrl.searchParams.get('code');
	const	cookie = getCookie("crunchy-token");

	if (code && !cookie) {
		try {
			const	res = await fetch(`http://backend:4000/api/auth/verifyCode/${code}`);
			const	data = await res.json();

			const	response = NextResponse.json(data);
			if (data?.message === "Loading...") {
				response.cookies.set({
					name: "crunchy-token",
					value: data.token,
					httpOnly: true,
					sameSite: true,
					path: "/",
				});
				response.cookies.set({
					name: "refresh-token",
					value: data.refresh_token,
					httpOnly: true,
					sameSite: true,
					path: "/",
				});
			}

			if (data?.message)
				return response;
			throw new Error("Cannot verify user");
		}
		catch (err) {
			console.log(err);
		}
	}
}
