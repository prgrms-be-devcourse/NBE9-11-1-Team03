// src/app/admin/admin-order/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/client";

type ProductDto = {
  prodId: number;
  prodName: string;
  prodPrice: number;
};

type OrderItemDto = {
  productId: number;
  prodName: string;
  prodQuantity: number;
  prodPrice: number;
};

type OrderResponseDto = {
  orderId: number;
  email: string;
  postalCode: string;
  detailAddress: string;
  orderTime: string;
  items: OrderItemDto[];
};

type UpdateItemDto = {
  productId: number;
  quantity: number;
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    loadProducts();
    loadAllOrders();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const loadProducts = async () => {
    try {
      const data = await fetchApi("/api/v1/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      showToast("상품 목록을 불러오지 못했습니다.");
    }
  };

  const loadAllOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/api/v1/orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
      setOrders([]);
      showToast("주문 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const searchOrders = async () => {
    if (!searchEmail.trim()) {
      showToast("이메일을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchApi(
        `/api/v1/orders?email=${encodeURIComponent(searchEmail.trim())}`
      );
      setOrders(data);
    } catch (error) {
      console.error(error);
      setOrders([]);
      showToast("검색 결과가 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingOrderId(null);
    setEmail("");
    setDetailAddress("");
    const initial: Record<number, number> = {};
    products.forEach((p) => {
      initial[p.prodId] = 0;
    });
    setQuantities(initial);
  };

  const fillEditForm = (order: OrderResponseDto) => {
    setEditingOrderId(order.orderId);
    setEmail(order.email ?? "");
    setDetailAddress(order.detailAddress ?? "");

    const next: Record<number, number> = {};
    products.forEach((p) => {
      next[p.prodId] = 0;
    });

    order.items?.forEach((item) => {
      next[item.productId] = item.prodQuantity;
    });

    setQuantities(next);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value < 0 ? 0 : value,
    }));
  };

  const executeUpdate = async () => {
    if (editingOrderId === null) return;

    const items: UpdateItemDto[] = products.map((product) => ({
      productId: product.prodId,
      quantity: quantities[product.prodId] ?? 0,
    }));

    try {
      await fetchApi(`/api/v1/orders/${editingOrderId}`, {
        method: "PATCH",
        body: JSON.stringify({
          email,
          detailAddress,
          items,
        }),
      });

      showToast("수정 완료!");
      resetForm();
      await loadAllOrders();
    } catch (error) {
      console.error(error);
      showToast("수정에 실패했습니다.");
    }
  };

  const deleteOrder = async (orderId: number) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await fetchApi(`/api/v1/orders/${orderId}`, {
        method: "DELETE",
      });

      showToast("삭제 완료!");
      if (editingOrderId === orderId) {
        resetForm();
      }
      await loadAllOrders();
    } catch (error) {
      console.error(error);
      showToast("삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (products.length > 0 && Object.keys(quantities).length === 0) {
      resetForm();
    }
  }, [products]);

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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => router.push("/admin/menu")}
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
              품목 관리
            </button>

            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#ede8e2",
                border: "1.5px solid #ddd6cc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7a7068",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              A
            </div>
          </div>
        </header>

        <div
          style={{
            padding: "28px 40px 0",
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.6rem",
            color: "#1a1410",
          }}
        >
          관리자 주문 조회 페이지
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "24px",
            padding: "24px 40px 40px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #ddd6cc",
              padding: "28px",
              boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "0.78rem",
                color: "#7a7068",
                marginBottom: "20px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Order management
            </div>

            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
                color: "#1a1410",
                marginBottom: "16px",
              }}
            >
              전체 주문 목록
            </div>

            {loading ? (
              <div
                style={{
                  color: "#7a7068",
                  textAlign: "center",
                  padding: "40px 0",
                }}
              >
                로딩중..
              </div>
            ) : orders.length === 0 ? (
              <div
                style={{
                  color: "#7a7068",
                  textAlign: "center",
                  padding: "40px 0",
                }}
              >
                주문 내역이 없습니다
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    style={{
                      border: "1px solid #e5ddd3",
                      borderRadius: "14px",
                      background: "#fcfaf8",
                      padding: "16px",
                      display: "grid",
                      gridTemplateColumns: "80px 1fr 1.3fr auto",
                      gap: "14px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.05rem",
                        color: "#1a1410",
                      }}
                    >
                      #{order.orderId}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          color: "#1a1410",
                          wordBreak: "break-all",
                          marginBottom: "6px",
                        }}
                      >
                        {order.email}
                      </div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "#7a7068",
                        }}
                      >
                        {order.orderTime}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.88rem",
                          color: "#7a7068",
                          wordBreak: "break-word",
                        }}
                      >
                        {order.detailAddress}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {order.items?.length > 0 ? (
                          order.items.map((item) => (
                            <span
                              key={`${order.orderId}-${item.productId}`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "6px 10px",
                                borderRadius: "999px",
                                background: "#f1ebe4",
                                border: "1px solid #ddd6cc",
                                color: "#5d554d",
                                fontSize: "0.78rem",
                              }}
                            >
                              {item.prodName} {item.prodQuantity}개
                            </span>
                          ))
                        ) : (
                          <span
                            style={{
                              color: "#7a7068",
                              fontSize: "0.8rem",
                            }}
                          >
                            품목 없음
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() => fillEditForm(order)}
                        style={{
                          background: "#3a6b8a",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                        }}
                      >
                        수정
                      </button>

                      <button
                        onClick={() => deleteOrder(order.orderId)}
                        style={{
                          background: "#fff",
                          color: "#b14f48",
                          border: "1.5px solid #d9a3a0",
                          borderRadius: "8px",
                          padding: "10px 12px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #ddd6cc",
                padding: "24px",
                boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "black",
                  fontSize: "1.1rem",
                  marginBottom: "16px",
                }}
              >
                Search
              </div>

              <div style={{ marginBottom: "12px" }}>
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
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#ede8e2",
                    border: "1.5px solid transparent",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem",
                    color: "#1a1410",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={searchOrders}
                  style={{
                    width: "100%",
                    background: "#1a1410",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.98rem",
                    cursor: "pointer",
                  }}
                >
                  검색하기
                </button>

                <button
                  onClick={loadAllOrders}
                  style={{
                    width: "100%",
                    background: "#fff",
                    color: "#1a1410",
                    border: "1.5px solid #ddd6cc",
                    borderRadius: "10px",
                    padding: "12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.92rem",
                    cursor: "pointer",
                  }}
                >
                  전체 조회
                </button>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid #ddd6cc",
                padding: "24px",
                boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "black",
                  fontSize: "1.1rem",
                  marginBottom: "16px",
                }}
              >
                {editingOrderId ? "Order Edit" : "Edit Preview"}
              </div>

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
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  style={{
                    width: "100%",
                    background: "#ede8e2",
                    border: "1.5px solid transparent",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "0.9rem",
                    color: "#1a1410",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

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
                  주소
                </label>
                <input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="배송 주소"
                  style={{
                    width: "100%",
                    background: "#ede8e2",
                    border: "1.5px solid transparent",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "0.9rem",
                    color: "#1a1410",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "#7a7068",
                    marginBottom: "8px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  품목별 수량
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {products.map((product) => (
                    <div key={product.prodId}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.82rem",
                          color: "#7a7068",
                          marginBottom: "6px",
                        }}
                      >
                        {product.prodName}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={quantities[product.prodId] ?? 0}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.prodId,
                            Number(e.target.value)
                          )
                        }
                        style={{
                          width: "100%",
                          background: "#ede8e2",
                          border: "1.5px solid transparent",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          fontSize: "0.9rem",
                          color: "#1a1410",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={executeUpdate}
                  disabled={editingOrderId === null}
                  style={{
                    width: "100%",
                    background: editingOrderId === null ? "#c8c1ba" : "#3a6b8a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.98rem",
                    cursor: editingOrderId === null ? "default" : "pointer",
                  }}
                >
                  수정 저장
                </button>

                <button
                  onClick={resetForm}
                  style={{
                    width: "100%",
                    background: "#fff",
                    color: "#1a1410",
                    border: "1.5px solid #ddd6cc",
                    borderRadius: "10px",
                    padding: "12px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.92rem",
                    cursor: "pointer",
                  }}
                >
                  수정 취소
                </button>
              </div>
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