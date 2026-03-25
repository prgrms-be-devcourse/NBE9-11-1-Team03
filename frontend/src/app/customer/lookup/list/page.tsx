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
    <>
      {/* 폰트 */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          background: "#f5f0eb",
          minHeight: "100vh",
          padding: "40px 20px"
        }}
      >
        {/* 타이틀 */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem",
            color: "#1a1410",
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          주문 목록
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          {safeOrders.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#7a7068",
                padding: "40px 0"
              }}
            >
              주문 내역이 없습니다
            </div>
          )}

          {safeOrders.map((order) => (
            <div
              key={order.orderId}
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #ddd6cc",
                padding: "24px",
                boxShadow: "0 4px 24px rgba(26,20,16,0.08)"
              }}
            >
              {/* 주문 정보 */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: "10px",
                  fontSize: "0.85rem",
                  color: "#7a7068",
                  marginBottom: "16px"
                }}
              >
                <span style={{ color: "#1a1410", fontWeight: 500 }}>
                  주문번호: {order.orderId}
                </span>
                <span>이메일: {order.email}</span>
                <span>주소: {order.detailAddress}</span>
              </div>

              {/* 상품 목록 */}
              <div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#7a7068",
                    marginBottom: "10px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase"
                  }}
                >
                  상품 목록
                </div>

                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #ddd6cc"
                    }}
                  >
                    <span style={{ color: "#1a1410", fontSize: "0.9rem" }}>
                      {item.prodName}
                    </span>

                    <span style={{ color: "#7a7068", fontSize: "0.85rem" }}>
                      수량: {item.prodQuantity}
                    </span>

                    <span style={{ color: "#7a7068", fontSize: "0.85rem" }}>
                      {item.prodPrice.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>

              {/* 총 금액 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "14px",
                  paddingTop: "14px",
                  borderTop: "2px solid #1a1410"
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#1a1410"
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.2rem",
                    color: "#c9773a"
                  }}
                >
                  {order.totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}