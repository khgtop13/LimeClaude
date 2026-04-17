/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase/server";
import BrainstormClientPage from "@/components/brainstorm/BrainstormClientPage";

export default async function BrainstormPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: posts }, { data: profiles }] = await Promise.all([
    (supabase as any)
      .from("posts")
      .select(`
        id, title, content, created_by, created_at,
        reactions(id, type, user_id),
        comments(
          id, content, created_by, created_at, is_deleted,
          reactions(id, type, user_id)
        )
      `)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false }),
    (supabase as any).from("profiles").select("id, display_name"),
  ]);

  const nameMap = new Map<string, string>(
    (profiles ?? []).map((p: any) => [p.id, p.display_name])
  );

  const enriched = (posts ?? []).map((p: any) => ({
    ...p,
    author_name: nameMap.get(p.created_by) ?? "알 수 없음",
    comments: (p.comments ?? []).map((c: any) => ({
      ...c,
      author_name: nameMap.get(c.created_by) ?? "알 수 없음",
      reactions: c.reactions ?? [],
    })),
    reactions: p.reactions ?? [],
  }));

  return (
    <div className="max-w-lg mx-auto w-full">
      <BrainstormClientPage posts={enriched} myId={user!.id} />
    </div>
  );
}
