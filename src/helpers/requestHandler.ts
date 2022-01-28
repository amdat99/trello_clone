import { serverUrl } from "./urlConfig";

type Params = {
  url?: string;
  route: string;
  type: string;
  body?: any;
  credentials?: "same-origin" | "include" | "omit" | undefined;
  contentType?: string;
};

export const requestHandler = async ({
  url = serverUrl,
  route,
  type,
  body,
  credentials = "include",
  contentType = "application/json",
}: Params) => {
  try {
    const response = await fetch(url + route, {
      method: type,
      headers: { "Content-Type": contentType, "Access-Control-Allow-Origin": "*" },
      body: body && JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
