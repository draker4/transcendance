import { NextRequest } from "next/server";
import { emailer } from "@/services/Emailer.service";

export async function POST(req: NextRequest) {
	const	data = await req.json();
	emailer.verifyUserInscription(data.email, data.login);
}
