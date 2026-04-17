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

  const inputStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    border: "1.5px solid var(--border-default)",
    borderRadius: "0.875rem",
    background: "var(--surface-sub)",
    color: "var(--text-primary)",
    fontSize: "0.9375rem",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg, var(--lime-50) 0%, var(--surface-base) 40%, var(--sky-50) 100%)",
      padding: "1.5rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "360px",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(24px)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "2rem",
        padding: "3rem 2rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "var(--shadow-xl)",
      }}>
        {/* 로고 */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "1.5rem" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, var(--lime-300), var(--lime-500))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.125rem", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.04em",
            boxShadow: "0 4px 12px rgba(134,201,35,0.35)",
          }}>L</div>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, var(--sky-300), var(--sky-500))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.125rem", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.04em",
            boxShadow: "0 4px 12px rgba(31,163,224,0.35)",
          }}>C</div>
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.375rem", letterSpacing: "-0.04em" }}>
          LimeCloud
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0 0 2.25rem", textAlign: "center" }}>
          우리만의 공간
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>사용자</label>
            <input
              name="username"
              type="text"
              placeholder="lime 또는 cloud"
              autoComplete="username"
              required
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--sky-400)"; e.target.style.boxShadow = "0 0 0 3px rgba(31,163,224,0.12)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "var(--border-default)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>비밀번호</label>
            <input
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              autoComplete="current-password"
              required
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--sky-400)"; e.target.style.boxShadow = "0 0 0 3px rgba(31,163,224,0.12)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "var(--border-default)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {error && (
            <div style={{ padding: "0.625rem 0.875rem", borderRadius: "0.75rem", background: "#fff5f5", border: "1px solid #fcc", color: "#c0392b", fontSize: "0.8125rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{
              marginTop: "0.5rem",
              padding: "0.875rem",
              background: "linear-gradient(135deg, var(--lime-400), var(--sky-500))",
              color: "#fff",
              border: "none",
              borderRadius: "0.875rem",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.65 : 1,
              boxShadow: "0 4px 16px rgba(31,163,224,0.28)",
              width: "100%",
              transition: "opacity 0.15s",
            }}
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
