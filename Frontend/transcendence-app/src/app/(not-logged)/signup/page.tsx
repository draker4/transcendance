"use client"

import SignUpComponent from "@/components/signup/SignUpComponent";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function SignUpPage() {

	return (
		<GoogleReCaptchaProvider
			reCaptchaKey={process.env.WEBSITE_KEY as string}
			scriptProps={{
				async: false,
				defer: false,
				appendTo: "head",
				nonce: undefined,
			}}>
			< SignUpComponent />
		</GoogleReCaptchaProvider>
	);
}
