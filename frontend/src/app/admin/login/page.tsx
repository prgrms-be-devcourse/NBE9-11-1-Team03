"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginManager } from "@/lib/manager";

export default function AdminLoginPage() {
    const router = useRouter();

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!loginId.trim() || !password.trim()) {
            showToast("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const res = await loginManager({
                adminId: loginId,
                adminPassword: password,
            });

            showToast(res.message); // "로그인 성공"
            setTimeout(() => {
                router.push("/admin/order");
            }, 700);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
            showToast(message); // 백엔드 에러 메시지 그대로 표시
        }
    };

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap"
                rel="stylesheet"
            />

            <div
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: "#f5f0eb",
                    minHeight: "100vh",
                }}
            >
                <header
                    style={{
                        background: "#fff",
                        borderBottom: "1px solid #ddd6cc",
                        padding: "18px 40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: "black",
                            fontSize: "1.3rem",
                        }}
                    >
                        Grids <span style={{ color: "#3a6b8a" }}>&</span> Circles
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            border: "1.5px solid #3a6b8a",
                            color: "#3a6b8a",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            padding: "8px 18px",
                            borderRadius: "20px",
                        }}
                    >
                        관리자 로그인
                    </div>
                </header>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "calc(100vh - 80px)",
                        padding: "24px",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "460px",
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #ddd6cc",
                            padding: "32px",
                            boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "0.78rem",
                                color: "#7a7068",
                                marginBottom: "14px",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                            }}
                        >
                            Admin access
                        </div>

                        <div
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "1.8rem",
                                color: "#1a1410",
                                marginBottom: "10px",
                            }}
                        >
                            관리자 로그인
                        </div>

                        <div
                            style={{
                                color: "#7a7068",
                                fontSize: "0.92rem",
                                marginBottom: "24px",
                                lineHeight: 1.6,
                            }}
                        >
                            관리자 전용 주문 관리 페이지에 접속하려면
                            <br />
                            계정 정보를 입력해주세요.
                        </div>

                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: "14px" }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "0.8rem",
                                        fontWeight: 500,
                                        color: "#7a7068",
                                        marginBottom: "6px",
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    아이디
                                </label>
                                <input
                                    type="text"
                                    placeholder="admin"
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                    style={{
                                        width: "100%",
                                        background: "#ede8e2",
                                        border: "1.5px solid transparent",
                                        borderRadius: "8px",
                                        padding: "12px 14px",
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: "0.92rem",
                                        color: "#1a1410",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: "0.8rem",
                                        fontWeight: 500,
                                        color: "#7a7068",
                                        marginBottom: "6px",
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    placeholder="1234"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: "100%",
                                        background: "#ede8e2",
                                        border: "1.5px solid transparent",
                                        borderRadius: "8px",
                                        padding: "12px 14px",
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: "0.92rem",
                                        color: "#1a1410",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    background: "#1a1410",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "10px",
                                    padding: "14px",
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1rem",
                                    letterSpacing: "0.05em",
                                    cursor: "pointer",
                                }}
                            >
                                로그인
                            </button>
                        </form>

                        <div
                            style={{
                                marginTop: "18px",
                                fontSize: "0.82rem",
                                color: "#7a7068",
                                textAlign: "center",
                            }}
                        >
                            테스트 계정: admin / 1234
                        </div>
                    </div>
                </div>

                {toast && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: "30px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#1a1410",
                            color: "#fff",
                            padding: "12px 24px",
                            borderRadius: "30px",
                            fontSize: "0.88rem",
                            zIndex: 999,
                        }}
                    >
                        {toast}
                    </div>
                )}
            </div>
        </>
    );
}