"use client";

import { Refresher } from "@/components/refresher/Refresher";
import LogIn from "@/components/welcome/login/LogIn";
import ChatService from "@/services/Chat.service";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function SignUpPage() {
  
	ChatService.instance = null;
  
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.WEBSITE_KEY as string}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      <Refresher />
      <LogIn />
    </GoogleReCaptchaProvider>
  );
}
