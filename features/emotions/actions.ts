"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";

export async function logEmotion(emotionId: string) {
  const supabase = await createClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

  await Promise.all([
    supabase.from("emotion_logs").insert({
      user_id: user.id,
      emotion_id: emotionId,
      log_date: today,
    }),
    supabase.from("profiles").update({ current_emotion_id: emotionId }).eq("id", user.id),
  ]);
}
