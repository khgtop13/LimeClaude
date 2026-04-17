"use client";
import { useState } from "react";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

interface Reaction { id: string; type: "like" | "dislike"; user_id: string; }
interface Comment {
  id: string; content: string; created_by: string;
  created_at: string; is_deleted: boolean;
  author_name: string; reactions: Reaction[];
}
interface Post {
  id: string; title: string; content?: string | null;
  created_by: string; created_at: string;
  author_name: string; reactions: Reaction[]; comments: Comment[];
}

export default function BrainstormClientPage({ posts, myId }: { posts: Post[]; myId: string }) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>브레인스토밍</h2>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>자유롭게 아이디어를 나눠요</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "linear-gradient(90deg, var(--lime-400), var(--sky-400))", color: "#fff", border: "none" }}>
          + 아이디어
        </button>
      </div>

      {/* 통계 */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-2xl px-3 py-2.5 text-center"
          style={{ background: "var(--lime-50)", border: "1px solid var(--border-lime)" }}>
          <p className="text-xl font-black" style={{ color: "var(--lime-500)" }}>{posts.length}</p>
          <p className="text-[10px] font-medium" style={{ color: "var(--lime-600)" }}>아이디어</p>
        </div>
        <div className="flex-1 rounded-2xl px-3 py-2.5 text-center"
          style={{ background: "var(--sky-50)", border: "1px solid var(--border)" }}>
          <p className="text-xl font-black" style={{ color: "var(--sky-500)" }}>
            {posts.reduce((s, p) => s + p.comments.filter((c) => !c.is_deleted).length, 0)}
          </p>
          <p className="text-[10px] font-medium" style={{ color: "var(--sky-600)" }}>댓글</p>
        </div>
        <div className="flex-1 rounded-2xl px-3 py-2.5 text-center"
          style={{ background: "var(--surface-base)", border: "1px solid var(--border-subtle)" }}>
          <p className="text-xl font-black" style={{ color: "var(--text-muted)" }}>
            {posts.reduce((s, p) => s + p.reactions.filter((r) => r.type === "like").length, 0)}
          </p>
          <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>좋아요</p>
        </div>
      </div>

      {posts.length === 0 && (
        <p className="text-sm text-center py-10" style={{ color: "var(--text-muted)" }}>
          아직 아이디어가 없어요. 첫 번째 아이디어를 올려보세요!
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {posts.map((p) => <PostCard key={p.id} post={p} myId={myId} />)}
      </div>

      {addOpen && <PostForm onClose={() => setAddOpen(false)} />}
    </div>
  );
}
