"use client";

import { CryptoService } from "@/services/crypto/Crypto.service";
import { getDoubleLogin } from "./checkLogin";

const Crypto = new CryptoService();

export async function handleActionServer(
  login: string,
  avatarChosen: Avatar,
  token: string
): Promise<{
  exists: string;
  token: string;
}> {
  try {
    const res = await getDoubleLogin(login);

    if (res.length > 0)
      return {
        exists: res,
        token: "",
      };

    if (avatarChosen.decrypt && avatarChosen.image !== "") {
      avatarChosen.image = await Crypto.encrypt(avatarChosen.image);
    }

    const register = await fetch(
      `http://${process.env.HOST_IP}:4000/api/auth/firstLogin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          login,
          avatarChosen,
        }),
      }
    );

    const data = await register.json();

    if (data.error) throw new Error(data.message);

    return {
      exists: res,
      token: data.access_token,
    };
  } catch (err) {
    return {
      exists: "Something went wrong, please try again!",
      token: "",
    };
  }
}
