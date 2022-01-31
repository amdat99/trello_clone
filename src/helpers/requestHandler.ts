import { serverUrl } from "./urlConfig";
import Cookies from "js-cookie";

type Params = {
  url?: string;
  route: string;
  type: string;
  body?: any;
  credentials?: "same-origin" | "include" | "omit";
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
      credentials: credentials,
      headers: { "Content-Type": contentType },
      body: body && JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
