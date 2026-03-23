export async function fetchApi(url: string, options?: RequestInit) {
    const res = await fetch(`http://localhost:8080${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const text = await res.text();
    console.log("응답 내용:", text);  // ← 콘솔에서 확인

    if (!res.ok) throw new Error(`API 오류: ${res.status}`);
    
    return JSON.parse(text);  // text로만 파싱
}