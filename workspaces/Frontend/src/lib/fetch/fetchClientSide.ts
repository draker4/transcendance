type RequestInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  credentials?: "include";
};

export default async function fetchClientSide(
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  }
) {
  try {
    // Make the API request with the access token in the "Authorization" header
    const fetchOptions: RequestInit = {
      method: options?.method || "GET",
      headers: {
        ...options?.headers,
      },
      credentials: "include",
    };

    if (options?.body) {
      fetchOptions.body = options.body;
    }

    const response = await fetch(url, fetchOptions);

    // If the response is unauthorized (401), attempt to refresh the token and retry the request
    if (response.status === 401) {
      const res = await fetch(
        `http://${process.env.HOST_IP}:4000/api/auth/refreshToken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

	  // [!][!][!] Use "disconnect" for build versions
      if (!res.ok) {
        if (process.env.DISCONNECT)
		  		throw new Error("disconnect");
        throw new Error("should disconnect here, change .env file");
      }

      const data = await res.json();
      const token = data.access_token;
      const refreshToken = data.refresh_token;
      fetch(`http://${process.env.HOST_IP}:3000/api/auth/setCookies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: token,
          refreshToken: refreshToken,
        }),
      });

      // If the token refresh was successful, retry the original request with the new access token
      const fetchOptions: RequestInit = {
        method: options?.method || "GET",
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${token}`,
        },
      };

      if (options?.body) {
        fetchOptions.body = options.body;
      }

      const resAgain = await fetch(url, fetchOptions);
      if (resAgain.status === 401) throw new Error("disconnect");

      return resAgain;
    }
    return response;
  } catch (error: any) {
    console.log("fetchClientSide function: ", error.message);
    console.log(url);
    console.log(
      `Error while fetching api on ClientSide: ${url}. Error log: ${error}`
    );
    throw new Error(error.message);
  }
}
