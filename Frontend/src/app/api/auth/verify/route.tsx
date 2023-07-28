import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const	code: string | null = req.nextUrl.searchParams.get('code');

	if (code) {
		try {
			const	res = await fetch(`http://backend:4000/api/auth/verifyCode/${code}`);
			const	data = await res.json();

			const	response = NextResponse.json(data);
			if (data?.message === "Loading...") {
				response.cookies.set({
					name: "crunchy-token",
					value: data.access_token,
					httpOnly: true,
					sameSite: "strict",
					path: "/",
				});

				if (data.refresh_token)
					response.cookies.set({
						name: "refresh-token",
						value: data.refresh_token,
						httpOnly: true,
						sameSite: "strict",
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
	const	data = {
		message: "Something went wrong, please try again !",
	}
	return NextResponse.json(data);
}
