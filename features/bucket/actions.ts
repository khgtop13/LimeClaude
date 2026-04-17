"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { submitApproval } from "@/lib/approval";
import { revalidatePath } from "next/cache";

export async function createBucketItem(formData: FormData) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const title      = (formData.get("title") as string)?.trim();
  const content    = (formData.get("content") as string)?.trim() || null;
  const importance = parseInt(formData.get("importance") as string) || 3;
  const target_date = (formData.get("target_date") as string) || null;

  if (!title) throw new Error("제목을 입력해주세요.");

  const { data: item, error } = await supabase
    .from("bucket_items")
    .insert({ title, content, importance, target_date, approval_status: "draft",
              completion_status: "incomplete", status: "active", is_deleted: false, created_by: user.id })
    .select("id").single();

  if (error) throw error;

  await submitApproval("bucket_item", item.id, "create", null, { title, content, importance, target_date });

  revalidatePath("/bucket");
}

export async function updateBucketItem(id: string, formData: FormData) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const title      = (formData.get("title") as string)?.trim();
  const content    = (formData.get("content") as string)?.trim() || null;
  const importance = parseInt(formData.get("importance") as string) || 3;
  const target_date = (formData.get("target_date") as string) || null;

  if (!title) throw new Error("제목을 입력해주세요.");

  const { data: before } = await supabase.from("bucket_items").select("*").eq("id", id).single();

  await supabase.from("bucket_items").update({ title, content, importance, target_date }).eq("id", id);

  await submitApproval("bucket_item", id, "update", before, { title, content, importance, target_date });

  revalidatePath("/bucket");
}

export async function completeBucketItem(id: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { data: before } = await supabase.from("bucket_items").select("*").eq("id", id).single();

  await submitApproval("bucket_item", id, "complete", before, null);

  revalidatePath("/bucket");
}

export async function deleteBucketItem(id: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { data: before } = await supabase.from("bucket_items").select("*").eq("id", id).single();

  await submitApproval("bucket_item", id, "delete", before, null);

  revalidatePath("/bucket");
}
