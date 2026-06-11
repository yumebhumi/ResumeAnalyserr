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
    <div className="rounded-3xl border border-[#D6AD60]/15 bg-gradient-to-br from-[#C08457]/10 via-[#201c1b] to-white/5 p-5">
      <p className="text-sm uppercase tracking-[0.22em] text-[#D6AD60]">{label}</p>
      <p className="mt-4 text-5xl font-semibold text-slate-50">{score}</p>
      <p className="mt-3 text-sm leading-7 text-slate-400">{detail}</p>
    </div>
  );
}
