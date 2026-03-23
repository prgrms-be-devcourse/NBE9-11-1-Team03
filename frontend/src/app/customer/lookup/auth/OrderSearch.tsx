"use client";

import { useState } from "react";
import OrderList from "./OrderList";

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
  const [orders, setOrders] = useState<Order[] | null>(null); // null이면 아직 조회 전
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/orders?email=${email}`, {
        method: "GET"
      });

      if (!res.ok) throw new Error("주문 조회 실패");

      const data = await res.json();
      setOrders(data); // OrderList에 전달
    } catch (err) {
      console.error(err);
      alert("주문 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 조회 완료되면 OrderList 화면 보여주기
  if (orders) return <OrderList orders={orders} />;

  // 이메일 입력 화면
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">주문 내역 조회하기</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          주문 시 기입한 이메일을 입력해주세요
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !email}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "조회 중..." : "조회"}
        </button>
      </div>
    </div>
  );
}