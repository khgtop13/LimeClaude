"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── 포스트 ──────────────────────────────────────
export async function createPost(fd: FormData) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  const title   = (fd.get("title") as string).trim();
  const content = (fd.get("content") as string | null)?.trim() || null;
  if (!title) throw new Error("제목을 입력하세요.");
  await supabase.from("posts").insert({ title, content, created_by: user.id });
  revalidatePath("/brainstorm");
}

export async function updatePost(id: string, fd: FormData) {
  const supabase = await createClient() as any;
  const title   = (fd.get("title") as string).trim();
  const content = (fd.get("content") as string | null)?.trim() || null;
  if (!title) throw new Error("제목을 입력하세요.");
  await supabase.from("posts").update({ title, content, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/brainstorm");
}

export async function deletePost(id: string) {
  const supabase = await createClient() as any;
  await supabase.from("posts").update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/brainstorm");
}

// ── 댓글 ──────────────────────────────────────
export async function createComment(postId: string, content: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  const text = content.trim();
  if (!text) throw new Error("댓글을 입력하세요.");
  await supabase.from("comments").insert({ post_id: postId, content: text, created_by: user.id });
  revalidatePath("/brainstorm");
}

export async function deleteComment(id: string) {
  const supabase = await createClient() as any;
  await supabase.from("comments").update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/brainstorm");
}

// ── 리액션 ────────────────────────────────────
export async function toggleReaction(entityType: "post" | "comment", entityId: string, type: "like" | "dislike") {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  const { data: existing } = await supabase
    .from("reactions")
    .select("id, type")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    if (existing.type === type) {
      // 같은 타입 → 취소
      await supabase.from("reactions").delete().eq("id", existing.id);
    } else {
      // 다른 타입 → 변경
      await supabase.from("reactions").update({ type }).eq("id", existing.id);
    }
  } else {
    await supabase.from("reactions").insert({ entity_type: entityType, entity_id: entityId, user_id: user.id, type });
  }
  revalidatePath("/brainstorm");
}
