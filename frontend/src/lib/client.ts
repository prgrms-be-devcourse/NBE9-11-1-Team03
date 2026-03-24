export async function fetchApi(url: string, options?: RequestInit) {
    const res = await fetch(`http://localhost:8080${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const text = await res.text();
    console.log("응답 내용:", text);

    if (!res.ok) throw new Error(`API 오류: ${res.status}`);

    if (!text) return null;  // ← 빈 응답이면 null 반환

    return JSON.parse(text);
}