import { NextResponse } from "next/server";

export async function GET() {
	const	response = new NextResponse;
	response.cookies.set({
		name: "crunchy-token",
		value: "",
		httpOnly: true,
		sameSite: true,
	})
	return response;
}
