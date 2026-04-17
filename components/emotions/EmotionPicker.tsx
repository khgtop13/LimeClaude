"use client";
import { useState, useTransition } from "react";
import { logEmotion } from "@/features/emotions/actions";
import { useRouter } from "next/navigation";

interface Emotion {
  id: string;
  emoji: string;
  label: string;
  score: number;
}

interface Props {
  emotions: Emotion[];
  current?: { id: string; emoji: string; label: string } | null;
}

export default function EmotionPicker({ emotions, current }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function select(id: string) {
    startTransition(async () => {
      await logEmotion(id);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="emotion-trigger"
        disabled={isPending}
      >
        {current ? (
          <span className="text-xl">{current.emoji}</span>
        ) : (
          <span className="emotion-add">+</span>
        )}
      </button>

      {open && (
        <div className="picker-backdrop" onClick={() => setOpen(false)}>
          <div className="picker-sheet" onClick={(e) => e.stopPropagation()}>
            <p className="picker-title">오늘의 기분</p>
            <div className="picker-grid">
              {emotions.map((e) => (
                <button
                  key={e.id}
                  onClick={() => select(e.id)}
                  disabled={isPending}
                  className={`picker-item ${current?.id === e.id ? "active" : ""}`}
                >
                  <span className="text-2xl">{e.emoji}</span>
                  <span className="picker-label">{e.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .emotion-trigger {
          width: 2.5rem; height: 2.5rem;
          border-radius: 50%;
          border: 2px dashed var(--border-default);
          background: var(--surface-sky);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.15s;
        }
        .emotion-trigger:hover { border-color: var(--sky-400); }
        .emotion-add { font-size: 1.25rem; color: var(--text-muted); }
        .picker-backdrop {
          position: fixed; inset: 0; z-index: 60;
          background: rgba(15,37,53,0.35);
          display: flex; align-items: flex-end;
        }
        .picker-sheet {
          width: 100%; background: var(--surface-base);
          border-radius: 1.25rem 1.25rem 0 0;
          padding: 1.25rem 1rem 2rem;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .picker-title {
          font-size: 0.9375rem; font-weight: 700;
          color: var(--text-primary); text-align: center;
        }
        .picker-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;
        }
        .picker-item {
          display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
          padding: 0.625rem 0.25rem; border-radius: 0.75rem;
          border: 1.5px solid transparent;
          background: var(--surface-sub);
          cursor: pointer; transition: all 0.12s;
        }
        .picker-item:hover { background: var(--surface-sky); border-color: var(--border); }
        .picker-item.active { border-color: var(--sky-400); background: var(--surface-sky); }
        .picker-label { font-size: 0.6875rem; color: var(--text-secondary); }
      `}</style>
    </>
  );
}
