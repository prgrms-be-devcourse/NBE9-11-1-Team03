// src/app/customer/success/[transactionId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/client";

export default function OrderSuccess() {

    const [order, setOrder] = useState<any | null>(null);
    const { transactionId } = useParams();
    const router = useRouter();

    useEffect(() => {
        fetchApi(`/api/v1/orders/${transactionId}`)
            .then(setOrder)
            .catch((err) => {
                alert(err);
                router.replace("/customer/order");
            });
    }, []);

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "#f5f0eb",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px"
            }}>

                {order === null
                    ? <div style={{ color: "#7a7068" }}>로딩중..</div>
                    : <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        width: "100%",
                        maxWidth: "480px"
                    }}>

                        {/* 제목 */}
                        <div style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.4rem",
                            color: "#1a1410",
                            textAlign: "center",
                            marginBottom: "8px"
                        }}>
                            결제 완료 페이지
                        </div>

                        {/* 결제 방식 카드 */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #ddd6cc",
                            padding: "20px 24px",
                            boxShadow: "0 4px 24px rgba(26,20,16,0.08)"
                        }}>
                            <div style={{
                                fontWeight: 500,
                                color: "#1a1410",
                                marginBottom: "8px",
                                fontSize: "0.95rem"
                            }}>
                                결제가 완료되었습니다!
                            </div>
                            <div style={{ color: "#7a7068", fontSize: "0.88rem" }}>
                                결제 방식
                            </div>
                            <div style={{ color: "#1a1410", fontSize: "0.88rem" }}>
                                무통장 입금 : 1234 - 56 - 7890 국민은행
                            </div>
                        </div>

                        {/* 주문 상세 카드 */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #ddd6cc",
                            padding: "20px 24px",
                            boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
                            display: "flex",
                            gap: "16px"
                        }}>
                            {/* 이미지 */}
                            <div style={{
                                width: "64px", height: "64px",
                                background: "linear-gradient(135deg, #e8ddd0, #d4c4b0)",
                                borderRadius: "8px",
                                display: "flex", alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.8rem",
                                flexShrink: 0
                            }}>
                                ☕
                            </div>

                            {/* 주문 정보 */}
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                                <div style={{ color: "#1a1410", fontSize: "0.88rem" }}>
                                    <span style={{ color: "#7a7068" }}>주문ID: </span>
                                    {order.orderId}
                                </div>

                                {/* 상세 주문 내역 */}
                                <div style={{ fontSize: "0.85rem" }}>
                                    <div style={{ color: "#7a7068", marginBottom: "4px" }}>상세주문내용</div>
                                    {order.items?.map((item: any, index: number) => (
                                        <div key={index} style={{ color: "#1a1410" }}>
                                            - {item.prodName} {item.prodQuantity}개 / {item.prodPrice.toLocaleString()}원
                                        </div>
                                    ))}
                                </div>

                                <div style={{ color: "#1a1410", fontSize: "0.85rem" }}>
                                    <span style={{ color: "#7a7068" }}>주소 : </span>
                                    {order.detailAddress}
                                </div>

                                <div style={{ color: "#1a1410", fontSize: "0.85rem" }}>
                                    <span style={{ color: "#7a7068" }}>주문시간: </span>
                                    {order.orderTime?.replace("T", " ").slice(0, 16)}
                                </div>

                                {/* 총 금액 */}
                                <div style={{
                                    marginTop: "8px",
                                    paddingTop: "8px",
                                    borderTop: "1px solid #ddd6cc",
                                    color: "#c9773a",
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "1rem"
                                }}>
                                    총 결제금액 : {order.totalPrice?.toLocaleString()}원
                                </div>
                            </div>
                        </div>

                        {/* 유의사항 카드 */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #ddd6cc",
                            padding: "20px 24px",
                            boxShadow: "0 4px 24px rgba(26,20,16,0.08)"
                        }}>
                            <div style={{
                                fontWeight: 500,
                                color: "#1a1410",
                                marginBottom: "12px",
                                fontSize: "0.9rem"
                            }}>
                                유의사항
                            </div>
                            <ul style={{
                                paddingLeft: "16px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px"
                            }}>
                                <li style={{ color: "#7a7068", fontSize: "0.83rem" }}>
                                    주문 결제는 당일 오후 11시 59분 59초까지 결제가 진행되어야 합니다
                                </li>
                                <li style={{ color: "#7a7068", fontSize: "0.83rem" }}>
                                    결제가 진행되지 않았을 경우 주문 취소 처리됩니다.
                                </li>
                            </ul>
                        </div>

                        {/* 돌려보기 버튼 */}
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                                onClick={() => router.replace("/customer/order")}
                                style={{ background: "#1a1410",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "10px",
                                    padding: "12px 24px",
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: "0.95rem",
                                    cursor: "pointer"
                                }}>
                                둘러보기
                            </button>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}
        