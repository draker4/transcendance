import { deleteCookie } from "cookies-next";
import { NextResponse } from "next/server";

export async function GET() {
	const	response = new NextResponse;
	response.cookies.set({
		name: "crunchy-token",
		value: "",
		httpOnly: true,
		sameSite: true,
	})
	response.cookies.set({
		name: "refresh-token",
		value: "",
		httpOnly: true,
		sameSite: true,
	})
	return response;
}
