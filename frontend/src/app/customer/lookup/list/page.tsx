"use client";

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

type Props = {
  orders: Order[] | null | undefined;
};

export default function OrderList({ orders }: Props) {
  const safeOrders: Order[] = Array.isArray(orders) ? orders : [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8">주문 목록</h1>
      <div className="w-full max-w-3xl space-y-6">
        {safeOrders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            {/* 주문 기본 정보 (수평 정렬) */}
            <div className="flex flex-wrap justify-between mb-4 text-sm text-gray-700">
              <span className="font-medium">주문번호: {order.orderId}</span>
              <span>이메일: {order.email}</span>
              <span>주소: {order.detailAddress}</span>
              <span>총 가격: {order.totalPrice}원</span>
            </div>

            {/* 상품 목록 */}
            <div>
              <h4 className="font-semibold mb-2">상품 목록</h4>
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200 rounded-md">
                {order.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between px-4 py-2 text-gray-800"
                  >
                    <span>{item.prodName}</span>
                    <span>수량: {item.prodQuantity}</span>
                    <span>가격: {item.prodPrice}원</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 삭제 버튼 */}
            <div className="flex justify-end mt-4">
              {/* <button
                onClick={() =>
                  alert("삭제 기능은 아직 구현되지 않았습니다.")
                }
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                삭제
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}