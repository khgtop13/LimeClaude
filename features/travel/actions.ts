"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { submitApproval } from "@/lib/approval";
import { revalidatePath } from "next/cache";
// user.id not needed — submitApproval reads auth internally

// ── 여행 계획 ─────────────────────────────────────────
export async function createTravelPlan(fd: FormData) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();


  const { data, error } = await supabase.from("travel_plans").insert({
    title:       (fd.get("title") as string).trim(),
    description: (fd.get("description") as string | null)?.trim() || null,
    start_date:  fd.get("start_date") as string,
    end_date:    fd.get("end_date") as string,
    created_by:  user.id,
  }).select("id").single();

  if (error) throw new Error(error.message);
  await submitApproval("travel_plan", data.id, "create", null, null);
  revalidatePath("/travel");
}

export async function updateTravelPlan(id: string, fd: FormData) {
  const supabase = await createClient() as any;

  await supabase.from("travel_plans").update({
    title:       (fd.get("title") as string).trim(),
    description: (fd.get("description") as string | null)?.trim() || null,
    start_date:  fd.get("start_date") as string,
    end_date:    fd.get("end_date") as string,
    updated_at:  new Date().toISOString(),
  }).eq("id", id);

  await submitApproval("travel_plan", id, "update", null, null);
  revalidatePath("/travel");
}

export async function deleteTravelPlan(id: string) {
  await submitApproval("travel_plan", id, "delete", null, null);
  revalidatePath("/travel");
}

export async function completeTravelPlan(id: string) {
  await submitApproval("travel_plan", id, "complete", null, null);
  revalidatePath("/travel");
}

// ── 체크리스트 (즉시반영) ───────────────────────────────
export async function addChecklistItem(travelPlanId: string, item: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  const { data: last } = await supabase
    .from("travel_checklists")
    .select("sort_order")
    .eq("travel_plan_id", travelPlanId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  await supabase.from("travel_checklists").insert({
    travel_plan_id: travelPlanId,
    item: item.trim(),
    sort_order: (last?.sort_order ?? -1) + 1,
    created_by: user.id,
  });
  revalidatePath("/travel");
}

export async function toggleChecklistItem(id: string, checked: boolean) {
  const supabase = await createClient() as any;
  await supabase.from("travel_checklists").update({ is_checked: checked, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/travel");
}

export async function deleteChecklistItem(id: string) {
  const supabase = await createClient() as any;
  await supabase.from("travel_checklists").delete().eq("id", id);
  revalidatePath("/travel");
}
