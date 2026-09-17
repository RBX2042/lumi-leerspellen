import { CatchBoard, DashBoard, FloatBoard } from "@/components/play-arcade";
import { PlayBoard as CoreBoard, answerLabel, isPlayBoard } from "@/components/play-boards";
import type { Question } from "@/lib/lumi/types";

export { answerLabel, isPlayBoard };

export function PlayBoard({
  q,
  locked,
  onSolve,
}: {
  q: Question;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  if (q.kind === "catch") return <CatchBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "float") return <FloatBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "dash") return <DashBoard q={q} locked={locked} onSolve={onSolve} />;
  return <CoreBoard q={q} locked={locked} onSolve={onSolve} />;
}
