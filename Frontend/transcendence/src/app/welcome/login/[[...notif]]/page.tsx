"use client";

import LogIn from "@/components/welcome/login/LogIn";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function SignUpPage() {
  console.log("confirm");
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
      <LogIn />
    </GoogleReCaptchaProvider>
  );
}
