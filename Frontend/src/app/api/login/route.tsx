import { NextRequest, NextResponse } from "next/server";

export async function POST(
	req: NextRequest,
) {
	const	{access_token, refresh_token} = await req.json();

	try {
		if (!access_token)
			throw new Error("No valid token");

		const	data = {
			error: false,
		}
		const	response = NextResponse.json(data);
		response.cookies.set({
			name: "crunchy-token",
			value: access_token,
			httpOnly: true,
			sameSite: "strict",
			path: "/",
		});

		if (refresh_token)
			response.cookies.set({
				name: "refresh-token",
				value: refresh_token,
				httpOnly: true,
				sameSite: "strict",
				path: "/",
			});
			
		return response;
	}
	catch (err) {
		console.log(err);
		const	data = {
			error: true,
		}
		return NextResponse.json(data);
	}
}
