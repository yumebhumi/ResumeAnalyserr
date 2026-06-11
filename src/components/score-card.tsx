export function ScoreCard({
  label,
  score,
  detail,
}: {
  label: string;
  score: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-slate-900/90 to-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">{label}</p>
      <p className="mt-4 text-5xl font-semibold text-slate-50">{score}</p>
      <p className="mt-3 text-sm leading-7 text-slate-400">{detail}</p>
    </div>
  );
}
