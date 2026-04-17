"use client";
import { useState, useTransition, useRef } from "react";
import { createBucketItem, updateBucketItem } from "@/features/bucket/actions";
import { useRouter } from "next/navigation";

interface Item { id: string; title: string; content?: string | null; importance: number; target_date?: string | null; }
interface Props { item?: Item; onClose: () => void; }

export default function BucketForm({ item, onClose }: Props) {
  const router = useRouter();
  const [importance, setImportance] = useState(item?.importance ?? 3);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const fd = new FormData(formRef.current!);
    fd.set("importance", String(importance));
    startTransition(async () => {
      try {
        if (item) await updateBucketItem(item.id, fd);
        else      await createBucketItem(fd);
        onClose();
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <p className="sheet-title">{item ? "버킷 수정" : "새 버킷 추가"}</p>

        <form ref={formRef} onSubmit={handleSubmit} className="form">
          <div className="field">
            <label className="label">제목 *</label>
            <input name="title" defaultValue={item?.title} required placeholder="하고 싶은 것을 입력하세요" className="input" />
          </div>

          <div className="field">
            <label className="label">내용</label>
            <textarea name="content" defaultValue={item?.content ?? ""} rows={3} placeholder="자세한 내용 (선택)" className="input textarea" />
          </div>

          <div className="field">
            <label className="label">중요도</label>
            <div className="stars">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setImportance(n)} className={`star ${n <= importance ? "on" : ""}`}>
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label">목표 날짜</label>
            <input name="target_date" type="date" defaultValue={item?.target_date ?? ""} className="input" />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="row">
            <button type="button" onClick={onClose} className="btn-cancel">취소</button>
            <button type="submit" disabled={isPending} className="btn-submit">
              {isPending ? "저장 중..." : item ? "수정 요청" : "추가 요청"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .backdrop { position:fixed; inset:0; z-index:60; background:rgba(15,37,53,0.35); display:flex; align-items:flex-end; }
        .sheet { width:100%; background:var(--surface-base); border-radius:1.25rem 1.25rem 0 0; padding:0.75rem 1rem 2rem; display:flex; flex-direction:column; gap:1rem; max-height:92dvh; overflow-y:auto; }
        .sheet-handle { width:2.5rem; height:4px; background:var(--border); border-radius:99px; margin:0 auto 0.25rem; }
        .sheet-title { font-size:0.9375rem; font-weight:700; color:var(--text-primary); text-align:center; }
        .form { display:flex; flex-direction:column; gap:0.875rem; }
        .field { display:flex; flex-direction:column; gap:0.375rem; }
        .label { font-size:0.8125rem; font-weight:500; color:var(--text-secondary); }
        .input { padding:0.625rem 0.875rem; border:1px solid var(--border-default); border-radius:0.625rem; background:var(--surface-sub); color:var(--text-primary); font-size:0.9375rem; outline:none; transition:border-color 0.15s; font-family:inherit; }
        .input:focus { border-color:var(--sky-400); }
        .textarea { resize:vertical; min-height:5rem; }
        .stars { display:flex; gap:0.25rem; }
        .star { font-size:1.75rem; background:none; border:none; cursor:pointer; color:var(--border-default); transition:color 0.1s; padding:0; }
        .star.on { color:var(--lime-400); }
        .error { font-size:0.8125rem; color:#c0392b; }
        .row { display:flex; gap:0.625rem; margin-top:0.25rem; }
        .btn-cancel { flex:1; padding:0.75rem; border:1px solid var(--border); border-radius:0.625rem; background:var(--surface-sub); color:var(--text-secondary); font-size:0.9375rem; font-weight:600; cursor:pointer; }
        .btn-submit { flex:2; padding:0.75rem; border:none; border-radius:0.625rem; background:linear-gradient(90deg,var(--sky-400),var(--sky-500)); color:#fff; font-size:0.9375rem; font-weight:600; cursor:pointer; }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>
    </div>
  );
}
