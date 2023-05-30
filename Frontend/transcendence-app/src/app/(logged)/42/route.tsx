import Client from "@/services/Client.service";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const	client = new Client();

export async function GET(req: NextRequest) {
	// const	{ client } = useClientContext();
	const code: string | null = req.nextUrl.searchParams.get('code');

	if (code) {

		await client.logIn42(code);
		
		if (client.token.length > 0) {
			const	response = NextResponse.redirect("http://localhost:3000/home");
			response.cookies.set({
				name: "crunchy-token",
				value: client.token,
			})
			// console.log(client.profile.login);
			return response;
		}
		// const	cookie = serialize(
		// 	"crunchy-token",
		// 	client.token,
		// 	{
		// 		httpOnly: true,
		// 		path: "/",
		// 	}
		// );
	}
	
	redirect("/");
}
