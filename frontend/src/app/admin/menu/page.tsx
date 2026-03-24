"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/client";

interface Product {
  prodId: number;
  prodName: string;
  prodPrice: number;
  description: string;
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    fetchApi("/api/v1/products")
      .then(setProducts)
      .catch((err) => showToast(err.message));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleSubmit = async () => {
    if (!prodName || !prodPrice) {
      showToast("품목 이름과 가격을 입력해주세요.");
      return;
    }

    if (editId) {
      fetchApi(`/api/v1/products/${editId}`, {
        method: "PUT",
        body: JSON.stringify({ prodName, prodPrice: parseInt(prodPrice), description }),
      })
        .then(() => {
          showToast("품목이 수정되었습니다!");
          setEditId(null);
          setProdName("");
          setProdPrice("");
          setDescription("");
          fetchProducts();
        })
        .catch(() => showToast("수정에 실패했습니다."));
    } else {
      fetchApi("/api/v1/products", {
        method: "POST",
        body: JSON.stringify({ prodName, prodPrice: parseInt(prodPrice), description }),
      })
        .then(() => {
          showToast("품목이 추가되었습니다!");
          setProdName("");
          setProdPrice("");
          setDescription("");
          fetchProducts();
        })
        .catch(() => showToast("추가에 실패했습니다."));
    }
  };

  const handleEdit = (product: Product) => {
    setEditId(product.prodId);
    setProdName(product.prodName);
    setProdPrice(String(product.prodPrice));
    setDescription(product.description);
  };

  const handleDelete = async (id: number) => {
    fetchApi(`/api/v1/products/${id}`, { method: "DELETE" })
      .then(() => {
        showToast("품목이 삭제되었습니다!");
        fetchProducts();
      })
      .catch(() => showToast("삭제에 실패했습니다."));
  };

  return (
    <>
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
          <div style={{ fontSize: "0.85rem", color: "#7a7068" }}>관리자 페이지</div>
        </header>

        {/* 페이지 타이틀 */}
        <div style={{
          padding: "28px 40px 0",
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.6rem", color: "#1a1410"
        }}>
          품목 관리
        </div>

        {/* 메인 레이아웃 */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 380px",
          gap: "24px", padding: "24px 40px 40px",
          maxWidth: "1200px", margin: "0 auto"
        }}>

          {/* 왼쪽: 품목 목록 */}
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
              등록된 품목 목록
            </div>

            {products.length === 0
              ? <div style={{ color: "#7a7068", textAlign: "center", padding: "40px 0" }}>
                  등록된 품목이 없습니다
                </div>
              : <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {products.map(product => (
                    <div key={product.prodId} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px", borderRadius: "12px",
                      border: "1.5px solid #ddd6cc", background: "#f5f0eb"
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: "#1a1410", fontSize: "0.95rem", marginBottom: "4px" }}>
                          {product.prodName}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#c9773a", fontWeight: 500, marginBottom: "2px" }}>
                          {product.prodPrice.toLocaleString()}원
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#7a7068" }}>
                          {product.description}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(product)}
                          style={{
                            background: "#3a6b8a", color: "#fff",
                            border: "none", borderRadius: "8px",
                            padding: "8px 16px", fontSize: "0.82rem",
                            cursor: "pointer", fontWeight: 500
                          }}>
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(product.prodId)}
                          style={{
                            background: "#fff", color: "#c0392b",
                            border: "1.5px solid #c0392b", borderRadius: "8px",
                            padding: "8px 16px", fontSize: "0.82rem",
                            cursor: "pointer", fontWeight: 500
                          }}>
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* 오른쪽: 품목 추가/수정 폼 */}
          <div style={{
            background: "#fff", borderRadius: "16px",
            border: "1px solid #ddd6cc", padding: "24px",
            boxShadow: "0 4px 24px rgba(26,20,16,0.08)",
            height: "fit-content"
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              color: "black", fontSize: "1.1rem", marginBottom: "20px"
            }}>
              {editId ? "품목 수정" : "품목 추가"}
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{
                display: "block", fontSize: "0.8rem", fontWeight: 500,
                color: "#7a7068", marginBottom: "6px",
                letterSpacing: "0.04em", textTransform: "uppercase"
              }}>
                품목 이름
              </label>
              <input
                type="text"
                placeholder="품목 이름 입력"
                value={prodName}
                onChange={e => setProdName(e.target.value)}
                style={{
                  width: "100%", background: "#ede8e2",
                  border: "1.5px solid transparent", borderRadius: "8px",
                  padding: "10px 14px", fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem", color: "#1a1410", outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{
                display: "block", fontSize: "0.8rem", fontWeight: 500,
                color: "#7a7068", marginBottom: "6px",
                letterSpacing: "0.04em", textTransform: "uppercase"
              }}>
                가격
              </label>
              <input
                type="number"
                placeholder="가격 입력"
                value={prodPrice}
                onChange={e => setProdPrice(e.target.value)}
                style={{
                  width: "100%", background: "#ede8e2",
                  border: "1.5px solid transparent", borderRadius: "8px",
                  padding: "10px 14px", fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem", color: "#1a1410", outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block", fontSize: "0.8rem", fontWeight: 500,
                color: "#7a7068", marginBottom: "6px",
                letterSpacing: "0.04em", textTransform: "uppercase"
              }}>
                설명
              </label>
              <input
                type="text"
                placeholder="품목 설명 입력"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{
                  width: "100%", background: "#ede8e2",
                  border: "1.5px solid transparent", borderRadius: "8px",
                  padding: "10px 14px", fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.9rem", color: "#1a1410", outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              style={{
                width: "100%", background: "#1a1410", color: "#fff",
                border: "none", borderRadius: "10px", padding: "14px",
                fontFamily: "'Playfair Display', serif", fontSize: "1rem",
                letterSpacing: "0.05em", cursor: "pointer"
              }}>
              {editId ? "수정 완료" : "추가하기"}
            </button>

            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setProdName("");
                  setProdPrice("");
                  setDescription("");
                }}
                style={{
                  width: "100%", background: "#fff", color: "#7a7068",
                  border: "1.5px solid #ddd6cc", borderRadius: "10px", padding: "12px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
                  cursor: "pointer", marginTop: "8px"
                }}>
                취소
              </button>
            )}
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