"use client";

import LogInComponent from "@/components/not-logged/login/LogInComponent";
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
      }}
    >
      <LogInComponent />
    </GoogleReCaptchaProvider>
  );
}
