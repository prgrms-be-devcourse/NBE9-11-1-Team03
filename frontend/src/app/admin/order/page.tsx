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
    isOrderState: boolean; // 추가: false=접수, true=완료
    items: OrderItemDto[];
};

type UpdateItemDto = {
    productId: number;
    quantity: number;
};

// 공통 label 스타일
const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#7a7068",
    marginBottom: "6px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
};

// 공통 input/select 스타일
const inputStyle: React.CSSProperties = {
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
};

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponseDto[]>([]);
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState("");

    // 필터 상태
    const [filterType, setFilterType] = useState<"all" | "email" | "product" | "state" | "delivery">("all");
    const [searchEmail, setSearchEmail] = useState("");
    const [filterProdId, setFilterProdId] = useState("");
    const [filterState, setFilterState] = useState<"false" | "true">("false");

    // 수정 폼 상태
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

    // 전체 주문 조회 (관리자 API)
    const loadAllOrders = async () => {
        try {
            setLoading(true);
            const data = await fetchApi("/api/manager/orders", { credentials: "include" });
            setOrders(data);
        } catch (error) {
            console.error(error);
            setOrders([]);
            showToast("주문 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 필터 통합 조회
    const applyFilter = async () => {
        try {
            setLoading(true);
            let url = "";

            if (filterType === "all") {
                url = "/api/manager/orders";
            } else if (filterType === "email") {
                if (!searchEmail.trim()) { showToast("이메일을 입력해주세요."); setLoading(false); return; }
                url = `/api/manager/orders/email?email=${encodeURIComponent(searchEmail.trim())}`;
            } else if (filterType === "product") {
                if (!filterProdId) { showToast("품목을 선택해주세요."); setLoading(false); return; }
                url = `/api/manager/orders/product?prodId=${filterProdId}`;
            } else if (filterType === "state") {
                url = `/api/manager/orders/state?isOrderState=${filterState}`;
            } else if (filterType === "delivery") {
                url = "/api/manager/orders/delivery";
            }

            const data = await fetchApi(url, { credentials: "include" });
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
        products.forEach((p) => { initial[p.prodId] = 0; });
        setQuantities(initial);
    };

    const fillEditForm = (order: OrderResponseDto) => {
        setEditingOrderId(order.orderId);
        setEmail(order.email ?? "");
        setDetailAddress(order.detailAddress ?? "");

        const next: Record<number, number> = {};
        products.forEach((p) => { next[p.prodId] = 0; });
        order.items?.forEach((item) => { next[item.productId] = item.prodQuantity; });
        setQuantities(next);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleQuantityChange = (productId: number, value: number) => {
        setQuantities((prev) => ({ ...prev, [productId]: value < 0 ? 0 : value }));
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
                body: JSON.stringify({ email, detailAddress, items }),
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
            await fetchApi(`/api/v1/orders/${orderId}`, { method: "DELETE" });
            showToast("삭제 완료!");
            if (editingOrderId === orderId) resetForm();
            await loadAllOrders();
        } catch (error) {
            console.error(error);
            showToast("삭제에 실패했습니다.");
        }
    };

    useEffect(() => {
        if (products.length > 0 && Object.keys(quantities).length === 0) resetForm();
    }, [products]);

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap"
                rel="stylesheet"
            />

            <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f5f0eb", minHeight: "100vh" }}>
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
                    <div style={{ fontFamily: "'Playfair Display', serif", color: "black", fontSize: "1.3rem" }}>
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
                                cursor: "pointer",
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

                <div style={{ padding: "28px 40px 0", fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#1a1410" }}>
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
                    {/* 좌측: 주문 목록 */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            border: "1px solid #ddd6cc",
                            padding: "28px",
                            boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
                        }}
                    >
                        <div style={{ fontSize: "0.78rem", color: "#7a7068", marginBottom: "20px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Order management
                        </div>

                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#1a1410", marginBottom: "16px" }}>
                            전체 주문 목록
                        </div>

                        {loading ? (
                            <div style={{ color: "#7a7068", textAlign: "center", padding: "40px 0" }}>로딩중..</div>
                        ) : orders.length === 0 ? (
                            <div style={{ color: "#7a7068", textAlign: "center", padding: "40px 0" }}>주문 내역이 없습니다</div>
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
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "#1a1410" }}>
                                            #{order.orderId}
                                        </div>

                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: "0.95rem", fontWeight: 500, color: "#1a1410", wordBreak: "break-all", marginBottom: "4px" }}>
                                                {order.email}
                                            </div>
                                            <div style={{ fontSize: "0.82rem", color: "#7a7068", marginBottom: "4px" }}>
                                                {order.orderTime}
                                            </div>
                                            {/* 주문 상태 뱃지 */}
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    padding: "2px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 500,
                                                    background: order.isOrderState ? "#d4edda" : "#fff3cd",
                                                    color: order.isOrderState ? "#2d6a4f" : "#856404",
                                                    border: `1px solid ${order.isOrderState ? "#b7dfca" : "#ffeaa7"}`,
                                                }}
                                            >
                                                {order.isOrderState ? "완료" : "접수"}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                                            <div style={{ fontSize: "0.88rem", color: "#7a7068", wordBreak: "break-word" }}>
                                                {order.detailAddress}
                                            </div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
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
                                                    <span style={{ color: "#7a7068", fontSize: "0.8rem" }}>품목 없음</span>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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

                    {/* 우측 패널 */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Filter 패널 (기존 Search 패널 교체) */}
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                border: "1px solid #ddd6cc",
                                padding: "24px",
                                boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
                            }}
                        >
                            <div style={{ fontFamily: "'Playfair Display', serif", color: "black", fontSize: "1.1rem", marginBottom: "16px" }}>
                                Filter
                            </div>

                            {/* 필터 종류 드롭다운 */}
                            <div style={{ marginBottom: "14px" }}>
                                <label style={labelStyle}>필터 종류</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                                    style={inputStyle}
                                >
                                    <option value="all">전체 조회</option>
                                    <option value="email">이메일 검색</option>
                                    <option value="product">품목별</option>
                                    <option value="state">주문 상태별</option>
                                    <option value="delivery">배송 묶음</option>
                                </select>
                            </div>

                            {/* 이메일 입력 */}
                            {filterType === "email" && (
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={labelStyle}>이메일</label>
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        value={searchEmail}
                                        onChange={(e) => setSearchEmail(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            )}

                            {/* 품목 선택 */}
                            {filterType === "product" && (
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={labelStyle}>품목 선택</label>
                                    <select
                                        value={filterProdId}
                                        onChange={(e) => setFilterProdId(e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="">품목을 선택하세요</option>
                                        {products.map((p) => (
                                            <option key={p.prodId} value={p.prodId}>{p.prodName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* 주문 상태 선택 */}
                            {filterType === "state" && (
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={labelStyle}>주문 상태</label>
                                    <select
                                        value={filterState}
                                        onChange={(e) => setFilterState(e.target.value as "false" | "true")}
                                        style={inputStyle}
                                    >
                                        <option value="false">접수</option>
                                        <option value="true">완료</option>
                                    </select>
                                </div>
                            )}

                            {/* 배송 묶음 안내 */}
                            {filterType === "delivery" && (
                                <div style={{ marginBottom: "14px", fontSize: "0.85rem", color: "#7a7068", lineHeight: 1.6 }}>
                                    오후 2시 기준 미완료 주문을 조회합니다.
                                </div>
                            )}

                            <button
                                onClick={applyFilter}
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
                                조회하기
                            </button>
                        </div>

                        {/* Edit 패널 (기존 유지) */}
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                border: "1px solid #ddd6cc",
                                padding: "24px",
                                boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
                            }}
                        >
                            <div style={{ fontFamily: "'Playfair Display', serif", color: "black", fontSize: "1.1rem", marginBottom: "16px" }}>
                                {editingOrderId ? "Order Edit" : "Edit Preview"}
                            </div>

                            <div style={{ marginBottom: "14px" }}>
                                <label style={labelStyle}>이메일</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" style={inputStyle} />
                            </div>

                            <div style={{ marginBottom: "14px" }}>
                                <label style={labelStyle}>주소</label>
                                <input type="text" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} placeholder="배송 주소" style={inputStyle} />
                            </div>

                            <div style={{ marginBottom: "12px" }}>
                                <div style={{ ...labelStyle, marginBottom: "8px" }}>품목별 수량</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {products.map((product) => (
                                        <div key={product.prodId}>
                                            <label style={{ display: "block", fontSize: "0.82rem", color: "#7a7068", marginBottom: "6px" }}>
                                                {product.prodName}
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={quantities[product.prodId] ?? 0}
                                                onChange={(e) => handleQuantityChange(product.prodId, Number(e.target.value))}
                                                style={inputStyle}
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