import { fetchApi } from "./client";

// 로그인 요청 시 백엔드로 보내는 데이터 타입
export interface ManagerLoginRequest {
    adminId: string;
    adminPassword: string;
}

// 로그인 성공 시 백엔드에서 받아오는 응답 데이터 타입
export interface ManagerLoginResponse {
    managerId: number;
    adminId: string;
    message: string;
}

// 관리자 로그인 API 호출 - POST /api/manager/login
export async function loginManager(
    data: ManagerLoginRequest
): Promise<ManagerLoginResponse> {
    return fetchApi("/api/manager/login", {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include", // 세션 쿠키 유지를 위해 필수
    });
}

// 관리자 로그아웃 API 호출 - POST /api/manager/logout (세션 무효화)
export async function logoutManager(): Promise<void> {
    return fetchApi("/api/manager/logout", {
        method: "POST",
        credentials: "include",
    });
}