"use client";
import { useState, useTransition } from "react";
import { approveRequest, rejectRequest, cancelRequest } from "@/lib/approval";

interface Props {
  requestId: string;
  /** "mine" = 요청자 본인, "partner" = 상대방 */
  role: "mine" | "partner";
  onDone?: () => void;
}

export default function ApprovalActions({ requestId, role, onDone }: Props) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    setError("");
    startTransition(async () => {
      try {
        await action();
        onDone?.();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      }
    });
  }

  if (role === "mine") {
    return (
      <div className="flex gap-2 items-center flex-wrap">
        <button
          disabled={isPending}
          onClick={() => run(() => cancelRequest(requestId))}
          className="action-btn cancel"
        >
          요청 취소
        </button>
        {error && <p className="text-[12px]" style={{ color: "#c0392b" }}>{error}</p>}
        <style jsx>{btnStyle}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {!rejectOpen ? (
        <div className="flex gap-2 flex-wrap">
          <button
            disabled={isPending}
            onClick={() => run(() => approveRequest(requestId))}
            className="action-btn approve"
          >
            승인
          </button>
          <button
            disabled={isPending}
            onClick={() => setRejectOpen(true)}
            className="action-btn reject"
          >
            반려
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="반려 의견을 입력하세요 (필수)"
            rows={3}
            className="reject-textarea"
          />
          <div className="flex gap-2">
            <button
              disabled={isPending || !reason.trim()}
              onClick={() => run(() => rejectRequest(requestId, reason))}
              className="action-btn reject"
            >
              반려 확정
            </button>
            <button
              onClick={() => { setRejectOpen(false); setReason(""); }}
              className="action-btn cancel"
            >
              취소
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-[12px]" style={{ color: "#c0392b" }}>{error}</p>}
      <style jsx>{btnStyle}</style>
    </div>
  );
}

const btnStyle = `
  .action-btn {
    padding: 0.4rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    border: none;
  }
  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .action-btn.approve {
    background: var(--lime-400);
    color: #fff;
  }
  .action-btn.approve:hover:not(:disabled) { background: var(--lime-500); }
  .action-btn.reject {
    background: #fee;
    color: #c0392b;
    border: 1px solid #fcc;
  }
  .action-btn.reject:hover:not(:disabled) { background: #fdd; }
  .action-btn.cancel {
    background: var(--surface-sub);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  .action-btn.cancel:hover:not(:disabled) { background: var(--border); }
  .reject-textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-default);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-primary);
    background: var(--surface-base);
    resize: vertical;
    outline: none;
  }
  .reject-textarea:focus { border-color: var(--sky-400); }
`;
