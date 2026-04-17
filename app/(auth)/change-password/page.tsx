"use client";
import { useState, useTransition } from "react";
import { changePassword } from "@/features/auth/actions";

export default function ChangePasswordPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await changePassword(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="wrap">
      <div className="card">
        <h1 className="title">비밀번호 변경</h1>
        <p className="desc">첫 로그인입니다. 새 비밀번호를 설정해주세요.</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="field-group">
            <label htmlFor="password" className="field-label">새 비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="6자 이상"
              autoComplete="new-password"
              required
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label htmlFor="confirm" className="field-label">비밀번호 확인</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              placeholder="다시 입력"
              autoComplete="new-password"
              required
              className="field-input"
            />
          </div>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" disabled={isPending} className="btn-primary btn-full">
            {isPending ? "변경 중..." : "변경하기"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100dvh;
          display: flex; align-items: center; justify-content: center;
          background: var(--surface-base);
          padding: 1.5rem;
        }
        .card {
          width: 100%; max-width: 360px;
          background: var(--surface-raised);
          border: 1px solid var(--border-subtle);
          border-radius: 1.25rem;
          padding: 2.5rem 2rem;
        }
        .title {
          font-size: 1.25rem; font-weight: 700;
          color: var(--text-primary); margin: 0 0 0.5rem;
        }
        .desc {
          font-size: 0.875rem; color: var(--text-muted); margin: 0 0 1.5rem;
        }
        .form { display: flex; flex-direction: column; gap: 1rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .field-label { font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); }
        .field-input {
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--border-default);
          border-radius: 0.625rem;
          background: var(--surface-base);
          color: var(--text-primary);
          font-size: 0.9375rem; outline: none;
          transition: border-color 0.15s;
        }
        .field-input:focus { border-color: var(--lime-400); }
        .field-error { font-size: 0.8125rem; color: #e05252; margin: 0; }
        .btn-primary {
          padding: 0.75rem;
          background: var(--lime-400); color: #fff;
          border: none; border-radius: 0.625rem;
          font-size: 0.9375rem; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .btn-primary:hover { background: var(--lime-500); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-full { width: 100%; }
      `}</style>
    </div>
  );
}
