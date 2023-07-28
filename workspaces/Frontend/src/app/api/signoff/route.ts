import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
	const	id: string | null = req.nextUrl.searchParams.get('id');

	if (id)
		fetch(`http://backend:4000/api/users/disconnect/${id}`, {
			method: "DELETE",
		});
	const	response = new NextResponse;
	
	const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

	response.cookies.set({
		name: "crunchy-token",
		value: "",
		httpOnly: true,
		sameSite: "strict",
		expires: yesterday,
	});

	response.cookies.set({
		name: "refresh-token",
		value: "",
		httpOnly: true,
		sameSite: "strict",
		expires: yesterday,
	});
	
	return response;
}
