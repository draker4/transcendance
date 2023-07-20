import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const	refreshToken = cookies().get("refresh-token")?.value;
	const	crunchyToken = cookies().get("crunchy-token")?.value;

	if (refreshToken && crunchyToken) {
		try {
			
			const	response = NextResponse.json({status:200});
			response.cookies.set({
				name: "crunchy-token",
				value: crunchyToken,
				httpOnly: true,
				sameSite: "lax",
				path: "/",
			});
			response.cookies.set({
				name: "refresh-token",
				value: refreshToken,
				httpOnly: true,
				sameSite: "lax",
				path: "/",
			});
			return response;

		} catch (err) {
			console.log(err);
		}
	}
	return NextResponse.json({status: 400});
}
