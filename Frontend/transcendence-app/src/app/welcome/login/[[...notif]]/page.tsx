"use client"

import LogInComponent from "@/components/not-logged/login/LogInComponent";
import { useParams } from "next/navigation";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function SignUpPage() {

	const	params = useParams();
	console.log(params);
	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={process.env.WEBSITE_KEY as string}
			scriptProps={{
				async: false,
				defer: false,
				appendTo: "head",
				nonce: undefined,
			}}>
			< LogInComponent />
		</GoogleReCaptchaProvider>
	);
}
