import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card } from "../shared";
import type { Worker } from "../../types";

export function AdminWorkers({ workers }: { workers: Worker[] }) {
  return (
    <div>
      <Eyebrow color={C.teal}>Admin</Eyebrow>
      <SectionTitle>Worker Management</SectionTitle>
      <GlowDivider colors={[C.teal, C.cyan]} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {workers.map((w, i) => (
          <Card key={w.id} style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${[C.gold, C.cyan, C.violet2, C.lime][i % 4]},transparent)` }} />
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${[C.gold, C.cyan, C.violet2, C.lime][i % 4]},${C.ash}44)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#000" }}>{w.name[0]}</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.ash }}>{w.name}</div>
                <div style={{ fontSize: 11, color: [C.gold, C.cyan, C.violet2, C.lime][i % 4], fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{w.skills[0]}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {w.skills.map(s => <Badge key={s} color={C.gray2}>{s}</Badge>)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, color: C.gray }}>Balance</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.gold }}>₦{w.balance.toLocaleString()}</div>
            </div>
            {w.bio && <div style={{ fontSize: 12, color: C.gray, marginTop: 10, lineHeight: 1.6 }}>{w.bio}</div>}
          </Card>
        ))}
        {workers.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: C.gray }}>No workers registered yet</div>
        )}
      </div>
    </div>
  );
}
