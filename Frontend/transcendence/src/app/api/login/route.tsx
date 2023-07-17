import { deleteCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
	req: NextRequest,
) {
	const	{access_token} = await req.json();

	try {
		if (!access_token)
			throw new Error("No valid token");
	
		deleteCookie("crunchy-token");
		const	data = {
			error: false,
		}
		const	response = NextResponse.json(data);
		response.cookies.set({
			name: "crunchy-token",
			value: access_token,
			httpOnly: true,
			sameSite: true,
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
