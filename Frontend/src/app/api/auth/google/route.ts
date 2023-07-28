import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const	refreshToken = cookies().get("refresh-token")?.value;
	const	crunchyToken = cookies().get("crunchy-token")?.value;

	console.log(refreshToken, crunchyToken);
	if (crunchyToken) {
		try {
			
			const	response = NextResponse.json({status:200});
			response.cookies.set({
				name: "crunchy-token",
				value: crunchyToken,
				httpOnly: true,
				sameSite: "strict",
				path: "/",
			});

			if (refreshToken)
				response.cookies.set({
					name: "refresh-token",
					value: refreshToken,
					httpOnly: true,
					sameSite: "strict",
					path: "/",
				});

			return response;

		} catch (err) {
			console.log(err);
		}
	}
	return NextResponse.json({status: 400});
}
