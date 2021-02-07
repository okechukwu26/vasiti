import fetch, * as fetchTypes from "node-fetch";

export async function httpReq<T>(url: string, options: fetchTypes.RequestInit): Promise<T> {
  const response = await fetch(url, options);
  return await (response.json() as Promise<T>);
}
