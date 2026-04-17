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
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-l">L</span>
          <span className="logo-c">C</span>
        </div>
        <h1 className="login-title">LimeCloud</h1>
        <p className="login-sub">우리만의 공간</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="username" className="field-label">사용자</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="lime 또는 cloud"
              autoComplete="username"
              required
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label htmlFor="password" className="field-label">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              autoComplete="current-password"
              required
              className="field-input"
            />
          </div>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={isPending} className="btn-primary btn-full">
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-wrap {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-base);
          padding: 1.5rem;
        }
        .login-card {
          width: 100%;
          max-width: 360px;
          background: var(--surface-raised);
          border: 1px solid var(--border-subtle);
          border-radius: 1.25rem;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        .login-logo {
          display: flex;
          gap: 0.125rem;
          margin-bottom: 0.5rem;
        }
        .logo-l {
          width: 2.5rem; height: 2.5rem;
          border-radius: 50%;
          background: var(--lime-100);
          color: var(--lime-600);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.125rem; font-weight: 700;
        }
        .logo-c {
          width: 2.5rem; height: 2.5rem;
          border-radius: 50%;
          background: var(--sky-100);
          color: var(--sky-600);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.125rem; font-weight: 700;
        }
        .login-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        .login-sub {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin: 0 0 1.5rem;
        }
        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .field-label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .field-input {
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--border-default);
          border-radius: 0.625rem;
          background: var(--surface-base);
          color: var(--text-primary);
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .field-input:focus {
          border-color: var(--lime-400);
        }
        .field-error {
          font-size: 0.8125rem;
          color: #e05252;
          margin: 0;
        }
        .btn-primary {
          padding: 0.75rem;
          background: var(--lime-400);
          color: #fff;
          border: none;
          border-radius: 0.625rem;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-primary:hover { background: var(--lime-500); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-full { width: 100%; }
      `}</style>
    </div>
  );
}
