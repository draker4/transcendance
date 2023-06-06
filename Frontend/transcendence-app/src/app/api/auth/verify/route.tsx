import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const	code: string | null = req.nextUrl.searchParams.get('code');
	const	cookie = getCookie("crunchy-token");

	if (code && !cookie) {
		try {
			const	res = await fetch(`http://backend:4000/api/auth/verifyCode/${code}`);
			const	data = await res.json();
			console.log(data);
			const	response = NextResponse.json(data);
			if (data?.message === "Loading...") {
				response.cookies.set({
					name: "crunchy-token",
					value: data.token,
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
