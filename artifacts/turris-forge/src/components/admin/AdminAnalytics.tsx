import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Card } from "../shared";
import type { Job, Worker } from "../../types";

interface Stats { total: number; open: number; submitted: number; approved: number; paidOut: number; }

export function AdminAnalytics({ stats, jobs, workers }: { stats: Stats; jobs: Job[]; workers: Worker[] }) {
  const catCounts: Record<string, number> = {};
  jobs.forEach(j => { catCounts[j.category] = (catCounts[j.category] || 0) + 1; });
  const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const totalPay = jobs.reduce((s, j) => s + j.pay, 0);

  return (
    <div>
      <Eyebrow color={C.violet2}>Admin</Eyebrow>
      <SectionTitle>Studio Analytics</SectionTitle>
      <GlowDivider colors={[C.violet2, C.pink]} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
        {[
          ["Total Job Value", `₦${totalPay.toLocaleString()}`, C.gold],
          ["Completion Rate", `${stats.total ? Math.round(stats.approved / stats.total * 100) : 0}%`, C.lime],
          ["Avg Pay Per Job", `₦${stats.total ? Math.round(totalPay / stats.total) : 0}`, C.cyan],
          ["Worker Count", workers.length, C.violet2],
        ].map(([l, v, c]) => (
          <Card key={String(l)} glow={String(c)} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, background: `linear-gradient(135deg,${c},${C.ash})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{String(v)}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray, marginTop: 4 }}>{String(l)}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.violet2, marginBottom: 20 }}>Jobs by Category</div>
        {topCats.map(([cat, count]) => {
          const pct = Math.round(count / jobs.length * 100);
          return (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: C.ash }}>{cat}</span>
                <span style={{ fontSize: 13, color: C.gold }}>{count} job{count > 1 ? "s" : ""}</span>
              </div>
              <div style={{ height: 4, background: C.sur2, borderRadius: 2 }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: `linear-gradient(90deg,${C.gold},${C.cyan})`, transition: "width 1s ease" }} />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
