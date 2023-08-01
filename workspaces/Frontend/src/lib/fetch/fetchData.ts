import fetchClientSide from "./fetchClientSide";

export default async function fetchData(
  token: string | undefined,
  apiName: string,
  url: string,
  method: string,
  body: any = null
) {
  const preUrl = token
    ? `http://backend:4000/api/${apiName}/`
    : `http://${process.env.HOST_IP}:4000/api/${apiName}/`;

  if (token) {
    const response = await fetch(preUrl + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: body,
    });

    if (!response.ok) throw new Error("fetched failed at " + preUrl + url);
    return response;
  } else {
    const response = await fetchClientSide(preUrl + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) throw new Error("fetched failed at " + preUrl + url);

    return response;
  }
}
