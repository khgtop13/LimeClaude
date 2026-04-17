"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { submitApproval } from "@/lib/approval";
import { revalidatePath } from "next/cache";

export async function createMapRecord(formData: FormData) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const title      = (formData.get("title") as string)?.trim();
  const address    = (formData.get("address") as string)?.trim() || null;
  const comment    = (formData.get("comment") as string)?.trim() || null;
  const visit_start = formData.get("visit_start") as string;
  const visit_end  = (formData.get("visit_end") as string) || null;
  const weather    = (formData.get("weather") as string) || null;
  const lat        = parseFloat(formData.get("lat") as string) || null;
  const lng        = parseFloat(formData.get("lng") as string) || null;

  if (!title)       throw new Error("장소 이름을 입력해주세요.");
  if (!visit_start) throw new Error("방문 날짜를 입력해주세요.");

  const { data: record, error } = await supabase
    .from("map_records")
    .insert({
      title, address, comment, visit_start, visit_end, weather, lat, lng,
      country_code: "KR",
      approval_status: "draft", status: "active", is_deleted: false,
      created_by: user.id,
    })
    .select("id").single();

  if (error) throw error;

  const snapshot = { title, address, comment, visit_start, visit_end, weather, lat, lng };
  await submitApproval("map_record", record.id, "create", null, snapshot);

  revalidatePath("/map");
}

export async function updateMapRecord(id: string, formData: FormData) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const title       = (formData.get("title") as string)?.trim();
  const address     = (formData.get("address") as string)?.trim() || null;
  const comment     = (formData.get("comment") as string)?.trim() || null;
  const visit_start = formData.get("visit_start") as string;
  const visit_end   = (formData.get("visit_end") as string) || null;
  const weather     = (formData.get("weather") as string) || null;
  const lat         = parseFloat(formData.get("lat") as string) || null;
  const lng         = parseFloat(formData.get("lng") as string) || null;

  if (!title) throw new Error("장소 이름을 입력해주세요.");

  const { data: before } = await supabase.from("map_records").select("*").eq("id", id).single();
  await supabase.from("map_records").update({ title, address, comment, visit_start, visit_end, weather, lat, lng }).eq("id", id);

  await submitApproval("map_record", id, "update", before, { title, address, comment, visit_start, visit_end, weather, lat, lng });

  revalidatePath("/map");
}

export async function deleteMapRecord(id: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const { data: before } = await supabase.from("map_records").select("*").eq("id", id).single();
  await submitApproval("map_record", id, "delete", before, null);

  revalidatePath("/map");
}
