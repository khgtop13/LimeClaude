"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost, createComment, deleteComment, toggleReaction } from "@/features/brainstorm/actions";
import PostForm from "./PostForm";

interface Reaction { id: string; type: "like" | "dislike"; user_id: string; }
interface Comment {
  id: string; content: string; created_by: string;
  created_at: string; is_deleted: boolean;
  author_name: string;
  reactions: Reaction[];
}
interface Post {
  id: string; title: string; content?: string | null;
  created_by: string; created_at: string;
  author_name: string;
  reactions: Reaction[];
  comments: Comment[];
}

export default function PostCard({ post, myId }: { post: Post; myId: string }) {
  const router = useRouter();
  const [open, setOpen]         = useState(false);
  const [editing, setEditing]   = useState(false);
  const [commentText, setComment] = useState("");
  const [isPending, start]      = useTransition();

  const likes    = post.reactions.filter((r) => r.type === "like").length;
  const dislikes = post.reactions.filter((r) => r.type === "dislike").length;
  const myReact  = post.reactions.find((r) => r.user_id === myId)?.type ?? null;
  const isMine   = post.created_by === myId;

  function fmt(iso: string) {
    return new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)" }}>
        {/* 헤더 */}
        <div className="px-4 pt-3 pb-2 flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{post.title}</p>
            {post.content && <p className="text-[12px] mt-0.5 whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{post.content}</p>}
          </div>
          {isMine && (
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => setEditing(true)} className="text-[11px] px-2 py-1 rounded-lg"
                style={{ background: "var(--surface-sky)", color: "var(--sky-600)", border: "1px solid var(--border)" }}>수정</button>
              <button onClick={() => { if (confirm("삭제할까요?")) start(async () => { await deletePost(post.id); router.refresh(); }); }}
                disabled={isPending} className="text-[11px] px-2 py-1 rounded-lg"
                style={{ background: "#fff5f5", color: "#c0392b", border: "1px solid #fcc" }}>삭제</button>
            </div>
          )}
        </div>

        {/* 작성자 + 시간 */}
        <p className="px-4 text-[10px]" style={{ color: "var(--text-muted)" }}>
          {post.author_name} · {fmt(post.created_at)}
        </p>

        {/* 리액션 + 댓글 토글 */}
        <div className="px-4 py-2 flex items-center gap-3">
          <button onClick={() => start(async () => { await toggleReaction("post", post.id, "like"); router.refresh(); })}
            disabled={isPending}
            className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full transition-all"
            style={{ background: myReact === "like" ? "var(--lime-100)" : "var(--surface-sub)", color: myReact === "like" ? "var(--lime-600)" : "var(--text-muted)", border: `1px solid ${myReact === "like" ? "var(--border-lime)" : "var(--border-subtle)"}` }}>
            ❤️ {likes}
          </button>
          <button onClick={() => start(async () => { await toggleReaction("post", post.id, "dislike"); router.refresh(); })}
            disabled={isPending}
            className="flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full transition-all"
            style={{ background: myReact === "dislike" ? "#fff5f5" : "var(--surface-sub)", color: myReact === "dislike" ? "#c0392b" : "var(--text-muted)", border: `1px solid ${myReact === "dislike" ? "#fcc" : "var(--border-subtle)"}` }}>
            💔 {dislikes}
          </button>
          <button onClick={() => setOpen(!open)} className="ml-auto text-[11px] flex items-center gap-1" style={{ color: "var(--sky-600)" }}>
            💬 댓글 {post.comments.filter((c) => !c.is_deleted).length}
            <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▾</span>
          </button>
        </div>

        {/* 댓글 영역 */}
        {open && (
          <div className="border-t px-4 pb-3 flex flex-col gap-2 pt-2" style={{ borderColor: "var(--border-subtle)" }}>
            {post.comments.filter((c) => !c.is_deleted).map((c) => {
              const cLikes    = c.reactions.filter((r) => r.type === "like").length;
              const cDislikes = c.reactions.filter((r) => r.type === "dislike").length;
              const cMine     = c.reactions.find((r) => r.user_id === myId)?.type ?? null;
              return (
                <div key={c.id} className="rounded-xl px-3 py-2" style={{ background: "var(--surface-sub)" }}>
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-[12px] whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{c.content}</p>
                    {c.created_by === myId && (
                      <button onClick={() => start(async () => { await deleteComment(c.id); router.refresh(); })}
                        disabled={isPending} className="text-[10px]" style={{ color: "var(--text-muted)" }}>삭제</button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{c.author_name} · {fmt(c.created_at)}</span>
                    <button onClick={() => start(async () => { await toggleReaction("comment", c.id, "like"); router.refresh(); })}
                      disabled={isPending} className="text-[10px]" style={{ color: cMine === "like" ? "var(--lime-600)" : "var(--text-muted)" }}>❤️ {cLikes}</button>
                    <button onClick={() => start(async () => { await toggleReaction("comment", c.id, "dislike"); router.refresh(); })}
                      disabled={isPending} className="text-[10px]" style={{ color: cMine === "dislike" ? "#c0392b" : "var(--text-muted)" }}>💔 {cDislikes}</button>
                  </div>
                </div>
              );
            })}

            {/* 댓글 입력 */}
            <div className="flex gap-2 mt-1">
              <input value={commentText} onChange={(e) => setComment(e.target.value)}
                placeholder="댓글 입력..." onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!commentText.trim()) return; start(async () => { await createComment(post.id, commentText); setComment(""); router.refresh(); }); } }}
                className="flex-1 text-[12px] px-3 py-1.5 rounded-xl outline-none"
                style={{ background: "var(--surface-sky)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              <button disabled={isPending || !commentText.trim()}
                onClick={() => start(async () => { await createComment(post.id, commentText); setComment(""); router.refresh(); })}
                className="text-[12px] px-3 py-1.5 rounded-xl font-semibold"
                style={{ background: "var(--sky-400)", color: "#fff" }}>전송</button>
            </div>
          </div>
        )}
      </div>

      {editing && <PostForm post={post} onClose={() => setEditing(false)} />}
    </>
  );
}
