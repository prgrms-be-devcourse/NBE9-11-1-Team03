// src/app/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDto } from "@/types/order";
import { fetchApi } from "@/lib/client";

export default function OrderPage() {

    const [products, setProducts] = useState<ProductDto[] | null>(null);
    const [cart, setCart] = useState<Record<number, number>>({});
    const [email, setEmail] = useState("");
    //const [address, setAddress] = useState("");
    //const [password, setPassword] = useState("");  패스워드 사용 xxx
    const [toast, setToast] = useState("");
    const [zonecode, setZonecode] = useState("");  // 우편번호
    const [roadAddress, setRoadAddress] = useState("");  // 도로명 주소
    const [detailAddress, setDetailAddress] = useState(""); // 상세 주소
    const [flashId, setFlashId] = useState<number | null>(null)
    const router = useRouter();

    useEffect(() => {
        fetchApi("/api/v1/products")
            .then(setProducts)
            .catch((err) => showToast(err.message));
    }, []);

    const selectProduct = (id: number) => {
        setCart(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,  // ← 클릭할 때마다 1씩 증가
        }));

        setFlashId(id);
        setTimeout(() => setFlashId(null), 150);  // 0.15초
    };

    const changeQty = (id: number, delta: number) => {
        setCart(prev => {
            const next = { ...prev };
            next[id] = (next[id] || 0) + delta;
            if (next[id] <= 0) delete next[id];
            return next;
        });
    };

    const calcTotal = () => {
        if (!products) return 0;
        return products
            .filter(p => cart[p.prodId])
            .reduce((sum, p) => sum + p.prodPrice * cart[p.prodId], 0);
    };

    const handleSubmit = async () => {
        if (!email || !roadAddress || !detailAddress) {
            showToast("이메일, 주소를 모두 입력해주세요.");
            return;
        }
        if (Object.keys(cart).length === 0) {
            showToast("상품을 하나 이상 선택해주세요.");
            return;
        }

        const body = {
            email,
            postalCode: Number(zonecode),
            detailAddress: `${roadAddress} ${detailAddress}`,
            items: Object.entries(cart).map(([productId, prodQuantity]) => ({
                productId: Number(productId),
                prodQuantity: prodQuantity,
            }))
        };

        fetchApi("/api/v1/orders", {
            method: "POST",
            body: JSON.stringify(body),
        })
            .then((data) => {
                showToast("주문이 완료되었습니다!");
                setTimeout(() => {
                    router.replace(`/customer/success/${data.orderId}`); // ← orderId 하나만 받아서 이동
                }, 1500);
            })
            .catch(() => showToast("주문에 실패했습니다. 다시 시도해주세요."));
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2800);
    };

    // 카카오 주소 검색 함수 추가
    const openAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: (data: any) => {
                setZonecode(data.zonecode);          // 우편번호
                setRoadAddress(data.roadAddress);    // 도로명 주소
                setDetailAddress("");                // 상세주소 초기화
            }
        }).open();
    };

    return (
        <>
            {/* 폰트 */}
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

            <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f5f0eb", minHeight: "100vh" }}>

                {/* 헤더 */}
                <header style={{
                    background: "#fff", borderBottom: "1px solid #ddd6cc",
                    padding: "18px 40px", display: "flex",
                    alignItems: "center", justifyContent: "space-between"
                }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", color: "black", fontSize: "1.3rem" }}>
                        Grids <span style={{ color: "#3a6b8a" }}>&</span> Circles
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                            onClick={() => router.push("/customer/lookup/auth")}
                            style={{
                                background: "#fff", border: "1.5px solid #3a6b8a",
                                color: "#3a6b8a", fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.85rem", fontWeight: 500,
                                padding: "8px 18px", borderRadius: "20px", cursor: "pointer",
                            }}>
                            주문조회 하기
                        </button>
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: "#ede8e2", border: "1.5px solid #ddd6cc",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer"
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="#7a7068" strokeWidth="1.8">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                        </div>
                    </div>
                </header>

                {/* 페이지 타이틀 */}
                <div style={{
                    padding: "28px 40px 0",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.6rem", color: "#1a1410"
                }}>
                    주문 페이지
                </div>

                {/* 메인 레이아웃 */}
                <div style={{
                    display: "grid", gridTemplateColumns: "1fr 380px",
                    gap: "24px", padding: "24px 40px 40px",
                    maxWidth: "1200px", margin: "0 auto"
                }}>

                    {/* 왼쪽: 상품 목록 */}
                    <div style={{
                        background: "#fff", borderRadius: "16px",
                        border: "1px solid #ddd6cc", padding: "28px",
                        boxShadow: "0 4px 24px rgba(26,20,16,0.08)"
                    }}>
                        <div style={{
                            fontSize: "0.78rem", color: "#7a7068",
                            marginBottom: "20px", letterSpacing: "0.05em",
                            textTransform: "uppercase"
                        }}>
                            원두 패키지 선택
                        </div>

                        {products === null
                            ? <div style={{ color: "#7a7068", textAlign: "center", padding: "40px 0" }}>
                                로딩중..
                            </div>
                            : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                {products.map(p => (
                                    <div key={p.prodId}
                                        onClick={() => selectProduct(p.prodId)}
                                        style={{
                                            border: `1.5px solid ${cart[p.prodId] ? "#3a6b8a" : "#ddd6cc"}`,
                                            borderRadius: "12px", overflow: "hidden",
                                            cursor: "pointer",
                                            background: cart[p.prodId] ? "#eef3f7" : "#f5f0eb",
                                            transform: flashId === p.prodId ? "scale(0.95)" : "scale(1)",  // ← 누를때 살짝 작아짐
                                            boxShadow: flashId === p.prodId ? "none" : "0 2px 8px rgba(0,0,0,0.06)",  // ← 그림자 사라짐
                                            transition: "all 0.2s",
                                        }}>
                                        <div style={{
                                            width: "100%", aspectRatio: "4/3",
                                            background: "linear-gradient(135deg, #e8ddd0, #d4c4b0)",
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", fontSize: "2.5rem", opacity: 0.8
                                        }}>
                                            ☕
                                        </div>
                                        <div style={{ padding: "12px 14px" }}>
                                            <div style={{ fontWeight: 500, color: "black", fontSize: "0.9rem", marginBottom: "4px" }}>
                                                {p.prodName}
                                            </div>
                                            <div style={{ fontSize: "0.82rem", color: "#c9773a", fontWeight: 500 }}>
                                                {p.prodPrice.toLocaleString()}원
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>

                    {/* 오른쪽: Summary + 폼 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Summary */}
                        <div style={{
                            background: "#fff", borderRadius: "16px",
                            border: "1px solid #ddd6cc", padding: "24px",
                            boxShadow: "0 4px 24px rgba(26,20,16,0.08)"
                        }}>
                            <div style={{
                                fontFamily: "'Playfair Display', serif",
                                color: "black",
                                fontSize: "1.1rem", marginBottom: "16px"
                            }}>
                                Summary
                            </div>

                            {products !== null && products.filter(p => cart[p.prodId]).length === 0
                                ? <div style={{ color: "#7a7068", fontSize: "0.88rem", textAlign: "center", padding: "12px 0" }}>
                                    상품을 선택해주세요
                                </div>
                                : products?.filter(p => cart[p.prodId]).map(p => (
                                    <div key={p.prodId} style={{
                                        display: "flex", alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "10px 0", borderBottom: "1px solid #ddd6cc", gap: "8px"
                                    }}>
                                        <span style={{ fontSize: "0.88rem", color: "black", flex: 1 }}>{p.prodName}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <button
                                                onClick={() => changeQty(p.prodId, -1)}
                                                style={{
                                                    width: "22px", height: "22px", borderRadius: "4px",
                                                    border: "1.5px solid #ddd6cc", background: "#ede8e2",
                                                    color: "black",
                                                    cursor: "pointer", fontWeight: 700, fontSize: "0.9rem"
                                                }}>−</button>
                                            <span style={{ fontSize: "0.85rem", color: "black", fontWeight: 500, minWidth: "20px", textAlign: "center" }}>
                                                {cart[p.prodId]}
                                            </span>
                                            <button
                                                onClick={() => changeQty(p.prodId, 1)}
                                                style={{
                                                    width: "22px", height: "22px", borderRadius: "4px",
                                                    border: "1.5px solid #ddd6cc", background: "#ede8e2",
                                                    color: "black",
                                                    cursor: "pointer", fontWeight: 700, fontSize: "0.9rem"
                                                }}>+</button>
                                        </div>
                                        <span style={{ fontSize: "0.85rem", color: "#7a7068", minWidth: "80px", textAlign: "right" }}>
                                            {(p.prodPrice * cart[p.prodId]).toLocaleString()}원
                                        </span>
                                        {/* X 버튼 추가 */}
                                        <button
                                            onClick={() => {
                                                setCart(prev => {
                                                    const next = { ...prev };
                                                    delete next[p.prodId];  // ← cart에서 완전히 제거
                                                    return next;
                                                });
                                            }}
                                            style={{
                                                width: "20px", height: "20px", borderRadius: "50%",
                                                border: "none", background: "#ddd6cc",
                                                color: "#7a7068", cursor: "pointer",
                                                fontSize: "0.75rem", fontWeight: 700,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                marginLeft: "4px"
                                            }}>✕</button>
                                    </div>
                                ))
                            }

                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                marginTop: "14px", paddingTop: "14px", borderTop: "2px solid #1a1410"
                            }}>
                                <span style={{ fontFamily: "'Playfair Display', serif", color: "black", fontSize: "1rem" }}>Total</span>
                                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#c9773a" }}>
                                    {calcTotal().toLocaleString()}원
                                </span>
                            </div>
                        </div>

                        {/* 주문 폼 */}
                        <div style={{
                            background: "#fff", borderRadius: "16px",
                            border: "1px solid #ddd6cc", padding: "24px",
                            boxShadow: "0 4px 24px rgba(26,20,16,0.08)"
                        }}>
                            {/* 이메일 */}
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{
                                    display: "block", fontSize: "0.8rem", fontWeight: 500,
                                    color: "#7a7068", marginBottom: "6px",
                                    letterSpacing: "0.04em", textTransform: "uppercase"
                                }}>
                                    이메일
                                </label>
                                <input
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    style={{
                                        width: "100%", background: "#ede8e2",
                                        border: "1.5px solid transparent", borderRadius: "8px",
                                        padding: "10px 14px", fontFamily: "'DM Sans', sans-serif",
                                        fontSize: "0.9rem", color: "#1a1410", outline: "none",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                            {/* 주소 */}
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{
                                    display: "block", fontSize: "0.8rem", fontWeight: 500,
                                    color: "#7a7068", marginBottom: "6px",
                                    letterSpacing: "0.04em", textTransform: "uppercase"
                                }}>
                                    주소
                                </label>

                                {/* 우편번호 + 검색 버튼 */}
                                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                                    <input
                                        type="text"
                                        placeholder="우편번호"
                                        value={zonecode}
                                        readOnly
                                        style={{
                                            width: "35%", background: "#ede8e2",
                                            border: "1.5px solid transparent", borderRadius: "8px",
                                            padding: "10px 14px", fontSize: "0.9rem",
                                            color: "#1a1410", outline: "none", boxSizing: "border-box"
                                        }}
                                    />
                                    <button
                                        onClick={openAddressSearch}
                                        style={{
                                            flex: 1, background: "#3a6b8a", color: "#fff",
                                            border: "none", borderRadius: "8px", padding: "10px 14px",
                                            fontSize: "0.85rem", cursor: "pointer", fontWeight: 500
                                        }}>
                                        주소 검색
                                    </button>
                                </div>

                                {/* 도로명 주소 */}
                                <input
                                    type="text"
                                    placeholder="도로명 주소"
                                    value={roadAddress}
                                    readOnly
                                    style={{
                                        width: "100%", background: "#ede8e2",
                                        border: "1.5px solid transparent", borderRadius: "8px",
                                        padding: "10px 14px", fontSize: "0.9rem", color: "#1a1410",
                                        outline: "none", boxSizing: "border-box", marginBottom: "8px"
                                    }}
                                />
                                {/* 상세 주소 */}
                                <input
                                    type="text"
                                    placeholder="상세 주소를 입력해주세요 (동/호수 등)"
                                    value={detailAddress}
                                    onChange={e => setDetailAddress(e.target.value)}
                                    style={{
                                        width: "100%", background: "#ede8e2",
                                        border: "1.5px solid transparent", borderRadius: "8px",
                                        padding: "10px 14px", fontSize: "0.9rem", color: "#1a1410",
                                        outline: "none", boxSizing: "border-box"
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    width: "100%", background: "#1a1410", color: "#fff",
                                    border: "none", borderRadius: "10px", padding: "14px",
                                    fontFamily: "'Playfair Display', serif", fontSize: "1rem",
                                    letterSpacing: "0.05em", cursor: "pointer", marginTop: "4px"
                                }}>
                                결제하기
                            </button>
                        </div>
                    </div>
                </div>

                {/* 토스트 */}
                {toast && (
                    <div style={{
                        position: "fixed", bottom: "30px", left: "50%",
                        transform: "translateX(-50%)", background: "#1a1410",
                        color: "#fff", padding: "12px 24px", borderRadius: "30px",
                        fontSize: "0.88rem", zIndex: 999
                    }}>
                        {toast}
                    </div>
                )}
            </div>
        </>
    );
}