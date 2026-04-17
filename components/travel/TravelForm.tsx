"use client";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTravelPlan, updateTravelPlan } from "@/features/travel/actions";

interface Plan { id: string; title: string; description?: string | null; start_date: string; end_date: string; }
interface Props { plan?: Plan; onClose: () => void; }

export default function TravelForm({ plan, onClose }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, start] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    start(async () => {
      if (plan) await updateTravelPlan(plan.id, fd);
      else       await createTravelPlan(fd);
      onClose();
      router.refresh();
    });
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="handle" />
        <p className="title">{plan ? "여행 수정" : "여행 계획"}</p>
        <form ref={formRef} onSubmit={handleSubmit} className="form">
          <div className="field">
            <label className="label">여행 제목 *</label>
            <input name="title" defaultValue={plan?.title} required placeholder="예: 제주도 봄 여행" className="input" />
          </div>
          <div className="field">
            <label className="label">설명 (선택)</label>
            <textarea name="description" defaultValue={plan?.description ?? ""} rows={3} placeholder="이번 여행에 대해..." className="input textarea" />
          </div>
          <div className="row2">
            <div className="field">
              <label className="label">출발일 *</label>
              <input name="start_date" type="date" defaultValue={plan?.start_date ?? today} required className="input" />
            </div>
            <div className="field">
              <label className="label">귀국일 *</label>
              <input name="end_date" type="date" defaultValue={plan?.end_date ?? today} required className="input" />
            </div>
          </div>
          <div className="row">
            <button type="button" onClick={onClose} className="btn-cancel">취소</button>
            <button type="submit" disabled={isPending} className="btn-submit">
              {isPending ? "요청 중..." : plan ? "수정 요청" : "추가 요청"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .backdrop { position:fixed; inset:0; z-index:60; background:rgba(15,37,53,0.4); display:flex; align-items:flex-end; }
        .sheet { width:100%; background:var(--surface-base); border-radius:1.25rem 1.25rem 0 0; padding:0.75rem 1rem 2.5rem; display:flex; flex-direction:column; gap:0.875rem; max-height:90dvh; overflow-y:auto; }
        .handle { width:2.5rem; height:4px; background:var(--border); border-radius:99px; margin:0 auto; }
        .title { font-size:0.9375rem; font-weight:700; color:var(--text-primary); text-align:center; }
        .form { display:flex; flex-direction:column; gap:0.75rem; }
        .field { display:flex; flex-direction:column; gap:0.3rem; }
        .label { font-size:0.8125rem; font-weight:500; color:var(--text-secondary); }
        .input { padding:0.5rem 0.75rem; border:1px solid var(--border-default); border-radius:0.625rem; background:var(--surface-sub); color:var(--text-primary); font-size:0.9rem; outline:none; font-family:inherit; }
        .input:focus { border-color:var(--sky-400); }
        .textarea { resize:vertical; }
        .row2 { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
        .row { display:flex; gap:0.625rem; }
        .btn-cancel { flex:1; padding:0.7rem; border:1px solid var(--border); border-radius:0.625rem; background:var(--surface-sub); color:var(--text-secondary); font-size:0.9rem; font-weight:600; cursor:pointer; }
        .btn-submit { flex:2; padding:0.7rem; border:none; border-radius:0.625rem; background:linear-gradient(90deg, var(--sky-400), var(--lime-400)); color:#fff; font-size:0.9rem; font-weight:600; cursor:pointer; }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>
    </div>
  );
}
