"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { RegionColor } from "@/components/map/KoreaMap";

export async function updateRegionColor(regionId: string, color: RegionColor) {
  const supabase = await createClient() as any;

  const { data: setting } = await supabase
    .from("settings").select("value").eq("key", "region_colors").single();

  const current: Record<string, RegionColor> = (setting?.value as any) ?? {};

  if (color === "none") delete current[regionId];
  else current[regionId] = color;

  await supabase.from("settings").upsert({
    key: "region_colors",
    value: current,
    updated_by: null,
  });

  revalidatePath("/map");
}
