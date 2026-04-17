"use client";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/features/brainstorm/actions";

interface Post { id: string; title: string; content?: string | null; }
interface Props { post?: Post; onClose: () => void; }

export default function PostForm({ post, onClose }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, start] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    start(async () => {
      if (post) await updatePost(post.id, fd);
      else       await createPost(fd);
      onClose();
      router.refresh();
    });
  }

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="handle" />
        <p className="title">{post ? "아이디어 수정" : "새 아이디어"}</p>
        <form ref={formRef} onSubmit={handleSubmit} className="form">
          <div className="field">
            <label className="label">제목 *</label>
            <input name="title" defaultValue={post?.title} required placeholder="아이디어 제목" className="input" />
          </div>
          <div className="field">
            <label className="label">내용 (선택)</label>
            <textarea name="content" defaultValue={post?.content ?? ""} rows={4} placeholder="자세한 내용을 적어보세요..." className="input textarea" />
          </div>
          <div className="row">
            <button type="button" onClick={onClose} className="btn-cancel">취소</button>
            <button type="submit" disabled={isPending} className="btn-submit">
              {isPending ? "저장 중..." : post ? "수정" : "등록"}
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
        .row { display:flex; gap:0.625rem; }
        .btn-cancel { flex:1; padding:0.7rem; border:1px solid var(--border); border-radius:0.625rem; background:var(--surface-sub); color:var(--text-secondary); font-size:0.9rem; font-weight:600; cursor:pointer; }
        .btn-submit { flex:2; padding:0.7rem; border:none; border-radius:0.625rem; background:linear-gradient(90deg, var(--lime-400), var(--sky-400)); color:#fff; font-size:0.9rem; font-weight:600; cursor:pointer; }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>
    </div>
  );
}
