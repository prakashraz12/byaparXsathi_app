import { BASE_API_URL } from "@/config/app.config";
import { QueriesContext } from "./queries-context";
import * as SecureStore from "expo-secure-store";
const baseUrl = "http://192.168.43.60:3000"; // TODO add your baseUrl

export type ErrorWrapper<TError> =
  | TError
  | { status: "unknown"; payload: string };

export type QueriesFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> =
  {
    url: string;
    method: string;
    body?: TBody;
    headers?: THeaders;
    queryParams?: TQueryParams;
    pathParams?: TPathParams;
    signal?: AbortSignal;
  } & QueriesContext["fetcherOptions"];

export async function queriesFetch<
  TData,
  TError,
  TBody extends {} | FormData | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {},
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  signal,
}: QueriesFetcherOptions<
  TBody,
  THeaders,
  TQueryParams,
  TPathParams
>): Promise<TData> {
  let token = await SecureStore.getItemAsync("token");
  const makeRequest = async (): Promise<Response> => {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      "X-Platform": "MOBILE",
      Authorization: `Bearer ${token}`,
      ...headers,
    };

    if (body instanceof FormData) {
      delete requestHeaders["Content-Type"];
    }

    return fetch(`${baseUrl}${resolveUrl(url, queryParams, pathParams)}`, {
      signal,
      method: method.toUpperCase(),
      body: body
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
      headers: requestHeaders,
    });
  };

  try {
    let response = await makeRequest();

    if (response.status === 401) {
      console.log("hey hey hey");
      //revalidate token
      const tokenResponse = await fetch(
        `${baseUrl}/api/v1/auth/revalidate-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Platform": "MOBILE",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json()).catch((e) => {
        console.log(e, "this is an error");
      });
      console.log(tokenResponse, "this is an tokenResponse");
      // Retry the original request with new token
      response = await makeRequest();
    }

    if (!response.ok) {
      let error: ErrorWrapper<TError>;
      try {
        error = await response.json();
      } catch (e) {
        error = { status: "unknown", payload: "Unexpected error" };
      }
      throw error;
    }

    // Return JSON or blob
    if (response.headers.get("content-type")?.includes("json")) {
      return await response.json();
    } else {
      return (await response.blob()) as unknown as TData;
    }
  } catch (e) {
    throw {
      status: "network",
      payload: e instanceof Error ? e.message : "Network error",
    };
  }
}
const resolveUrl = (
  url: string,
  queryParams: Record<string, string> = {},
  pathParams: Record<string, string> = {}
) => {
  let query = new URLSearchParams(queryParams).toString();
  if (query) query = `?${query}`;
  return (
    url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)] ?? "") + query
  );
};
