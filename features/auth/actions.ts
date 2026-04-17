"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const emailMap: Record<string, string> = {
    lime: "lime@limecloud.app",
    cloud: "cloud@limecloud.app",
  };

  const email = emailMap[username?.toLowerCase()];
  if (!email) return { error: "존재하지 않는 사용자입니다." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "비밀번호가 올바르지 않습니다." };

  redirect("/");
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient() as any;
  const newPassword = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!newPassword || newPassword.length < 6)
    return { error: "비밀번호는 6자 이상이어야 합니다." };
  if (newPassword !== confirm)
    return { error: "비밀번호가 일치하지 않습니다." };

  const { data: { user }, error: authError } = await (supabase as any).auth.updateUser({ password: newPassword });
  if (authError || !user) return { error: "비밀번호 변경에 실패했습니다." };

  await supabase.from("profiles").update({ must_change_password: false }).eq("id", user.id);

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
