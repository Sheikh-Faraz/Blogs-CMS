const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  return fetch(input, init);
};
