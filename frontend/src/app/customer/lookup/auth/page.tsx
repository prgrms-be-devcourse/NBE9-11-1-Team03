"use client";

import { useState } from "react";
import OrderList from "../list/page";
import { useRouter } from "next/navigation";

type Item = {
  productId: number;
  prodName: string;
  prodQuantity: number;
  prodPrice: number;
};

type Order = {
  orderId: number;
  email: string;
  postalCode: string;
  detailAddress: string;
  orderTime: string;
  totalPrice: number;
  items: Item[];
};

export default function OrderSearch() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/orders?email=${email}`, {
        method: "GET"
      });

      if (!res.ok) throw new Error("주문 조회 실패");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("주문 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (orders) return <OrderList orders={orders} />;

  return (
    <>
      {/* 폰트 */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <header
                style={{
                    background: "#fff", borderBottom: "1px solid #ddd6cc",
                    padding: "18px 40px", display: "flex",
                    alignItems: "center", justifyContent: "space-between",
                }}>
                <div
                    onClick={() => router.push(`/customer/order`)}
                    style={{
                        fontFamily: "'Playfair Display', serif", color: "black", fontSize: "1.3rem",
                        cursor: "pointer"
                    }}>
                    Grids <span style={{ color: "#3a6b8a" }}>&</span> Circles
                </div>
            </header>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: "#f5f0eb",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "36px",
            borderRadius: "16px",
            border: "1px solid #ddd6cc",
            boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
            width: "100%",
            maxWidth: "420px"
          }}
        >
          {/* 타이틀 */}
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.6rem",
              color: "#1a1410",
              textAlign: "center",
              marginBottom: "12px"
            }}
          >
            주문 조회
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "#7a7068",
              textAlign: "center",
              marginBottom: "24px"
            }}
          >
            주문 시 입력한 이메일을 입력해주세요
          </p>

          {/* 입력 */}
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              background: "#ede8e2",
              border: "1.5px solid transparent",
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "0.9rem",
              color: "#1a1410",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "16px"
            }}
          />

          {/* 버튼 */}
          <button
            onClick={handleSearch}
            disabled={loading || !email}
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
              opacity: loading || !email ? 0.6 : 1,
              transition: "all 0.2s"
            }}
          >
            {loading ? "조회 중..." : "조회하기"}
          </button>
        </div>
      </div>
    </>
  );
}