import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card, Btn, statusColor } from "../shared";
import type { Job, Worker } from "../../types";

interface Stats {
  total: number;
  open: number;
  submitted: number;
  approved: number;
  paidOut: number;
}

export function AdminOverview({ stats, jobs, workers, setView }: { stats: Stats; jobs: Job[]; workers: Worker[]; setView: (v: string) => void }) {
  const statCards = [
    { label: "Total Jobs", val: stats.total, color: C.gold, icon: "📋" },
    { label: "Open", val: stats.open, color: C.lime, icon: "✅" },
    { label: "Awaiting Review", val: stats.submitted, color: C.cyan, icon: "📥" },
    { label: "Approved", val: stats.approved, color: C.teal, icon: "🏆" },
    { label: "Total Paid Out", val: `₦${stats.paidOut.toLocaleString()}`, color: C.violet2, icon: "💰" },
    { label: "Active Workers", val: workers.length, color: C.pink, icon: "👥" },
  ];
  return (
    <div>
      <Eyebrow color={C.gold}>Admin Control Center</Eyebrow>
      <SectionTitle>Studio Overview</SectionTitle>
      <GlowDivider />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 16, marginBottom: 36 }}>
        {statCards.map(({ label, val, color, icon }) => (
          <Card key={label} glow={color} style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, background: `linear-gradient(135deg,${color},${C.ash})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray, marginTop: 4 }}>{label}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Recent Jobs</div>
          {jobs.slice(0, 4).map(j => (
            <div key={j.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid #ffffff06` }}>
              <div>
                <div style={{ fontSize: 13, color: C.ash, fontWeight: 500 }}>{j.title.slice(0, 36)}…</div>
                <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{j.category}</div>
              </div>
              <Badge color={statusColor(j.status)}>{j.status}</Badge>
            </div>
          ))}
          <Btn variant="subtle" onClick={() => setView("jobs")} style={{ width: "100%", marginTop: 14, fontSize: 12 }}>View All Jobs →</Btn>
        </Card>
        <Card>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cyan, marginBottom: 16 }}>Top Workers</div>
          {workers.map((w, i) => (
            <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid #ffffff06` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${[C.gold, C.cyan, C.violet2, C.lime][i % 4]},${C.ash}55)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#000" }}>{w.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.ash }}>{w.name}</div>
                <div style={{ fontSize: 11, color: C.gray }}>{w.skills[0]}</div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.gold }}>₦{w.balance.toLocaleString()}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
