import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const	id: string | null = req.nextUrl.searchParams.get('id');

	if (id)
		fetch(`http://backend:4000/api/users/disconnect/${id}`, {
			method: "DELETE",
		});

	const	response = new NextResponse;
	
	response.cookies.set({
		name: "crunchy-token",
		value: "",
		httpOnly: true,
		sameSite: "strict",
	});

	response.cookies.set({
		name: "refresh-token",
		value: "",
		httpOnly: true,
		sameSite: "strict",
	});
	
	return response;
}
