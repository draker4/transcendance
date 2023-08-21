import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
	const	id: string | null = req.nextUrl.searchParams.get('id');
	const	crunchyToken = cookies().get('crunchy-token')?.value;

	if (id && id.length > 0) {
		try {
			fetch(`http://backend:4000/api/users/disconnect/${id}`, {
				method: "DELETE",
			});
		}
		catch (error: any) {
			console.log(error.message);
		}
	}
	else if (crunchyToken) {
		try {
			fetch(`http://backend:4000/api/users/disconnectByToken`, {
				method: "DELETE",
				credentials: 'include',
			});
		}
		catch (error: any) {
			console.log(error.message);
		}
	}
	
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
