export async function fetchApi(url: string, options?: RequestInit) {
  const res = await fetch(`http://localhost:8080${url}`, {
    ...options,
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...(options?.headers || {}),
    },
  });

  const text = await res.text();
  console.log("응답 내용:", text);

  if (!res.ok) {
    throw new Error(text || `API 오류: ${res.status}`);
  }

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}