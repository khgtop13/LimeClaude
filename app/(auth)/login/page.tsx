"use client";
import { useState, useTransition } from "react";
import { login } from "@/features/auth/actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg, #e8f8d0 0%, #dff1fb 50%, #c8e8f8 100%)",
      padding: "1.5rem",
    }}>
      {/* 배경 장식 */}
      <span style={{ position:"fixed", top:"8%", left:"5%", fontSize:"72px", opacity:0.15, filter:"blur(2px)", pointerEvents:"none", userSelect:"none" }}>💚</span>
      <span style={{ position:"fixed", bottom:"12%", right:"6%", fontSize:"88px", opacity:0.12, filter:"blur(2px)", pointerEvents:"none", userSelect:"none" }}>💙</span>
      <span style={{ position:"fixed", top:"40%", right:"3%", fontSize:"40px", opacity:0.1, filter:"blur(1px)", pointerEvents:"none", userSelect:"none" }}>💕</span>

      <div style={{
        width: "100%",
        maxWidth: "360px",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.9)",
        borderRadius: "2rem",
        padding: "2.75rem 2rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        boxShadow: "0 20px 60px rgba(13,34,51,0.12), 0 4px 16px rgba(13,34,51,0.06)",
      }}>
        {/* 로고 */}
        <div style={{ display:"flex", alignItems:"center", gap:"0", marginBottom:"0.5rem" }}>
          <div style={{
            width: "3rem", height: "3rem", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--lime-300), var(--lime-400))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.25rem", fontWeight: 900, color: "#fff",
            boxShadow: "0 4px 12px rgba(134,201,35,0.4)",
            zIndex: 1,
          }}>L</div>
          <div style={{
            width: "3rem", height: "3rem", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--sky-300), var(--sky-400))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.25rem", fontWeight: 900, color: "#fff",
            boxShadow: "0 4px 12px rgba(31,163,224,0.4)",
            marginLeft: "-0.5rem",
          }}>C</div>
        </div>

        <h1 style={{ fontSize:"1.75rem", fontWeight:800, color:"var(--text-primary)", margin:0, letterSpacing:"-0.04em" }}>
          LimeCloud
        </h1>
        <p style={{ fontSize:"0.875rem", color:"var(--text-muted)", margin:"0 0 1.75rem", textAlign:"center" }}>
          우리만의 특별한 공간에 오신 걸 환영해요 💕
        </p>

        <form onSubmit={handleSubmit} style={{ width:"100%", display:"flex", flexDirection:"column", gap:"0.875rem" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.375rem" }}>
            <label style={{ fontSize:"0.8125rem", fontWeight:600, color:"var(--text-secondary)" }}>사용자</label>
            <input
              name="username"
              type="text"
              placeholder="lime 또는 cloud"
              autoComplete="username"
              required
              style={{
                padding: "0.75rem 1rem",
                border: "1.5px solid var(--border-default)",
                borderRadius: "0.875rem",
                background: "var(--surface-sub)",
                color: "var(--text-primary)",
                fontSize: "0.9375rem",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
                width: "100%",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--sky-400)"; e.target.style.boxShadow = "0 0 0 3px rgba(31,163,224,0.12)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border-default)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"0.375rem" }}>
            <label style={{ fontSize:"0.8125rem", fontWeight:600, color:"var(--text-secondary)" }}>비밀번호</label>
            <input
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              autoComplete="current-password"
              required
              style={{
                padding: "0.75rem 1rem",
                border: "1.5px solid var(--border-default)",
                borderRadius: "0.875rem",
                background: "var(--surface-sub)",
                color: "var(--text-primary)",
                fontSize: "0.9375rem",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
                width: "100%",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--sky-400)"; e.target.style.boxShadow = "0 0 0 3px rgba(31,163,224,0.12)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border-default)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {error && (
            <div style={{
              padding: "0.625rem 0.875rem",
              borderRadius: "0.75rem",
              background: "#fff5f5",
              border: "1px solid #fcc",
              color: "#c0392b",
              fontSize: "0.8125rem",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{
              marginTop: "0.375rem",
              padding: "0.875rem",
              background: isPending
                ? "var(--border)"
                : "linear-gradient(135deg, var(--lime-400) 0%, var(--sky-400) 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "0.875rem",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: isPending ? "not-allowed" : "pointer",
              letterSpacing: "-0.01em",
              boxShadow: isPending ? "none" : "0 4px 16px rgba(31,163,224,0.3)",
              transition: "opacity 0.15s, transform 0.12s",
              width: "100%",
            }}
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
