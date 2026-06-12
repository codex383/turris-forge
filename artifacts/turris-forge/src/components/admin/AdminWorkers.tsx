import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card } from "../shared";
import type { Worker } from "../../types";

const PALETTE = [C.gold, C.cyan, C.violet2, C.lime, C.pink, C.teal];

function StarDisplay({ rating, count }: { rating: number; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ fontSize: 13, color: i <= Math.round(rating || 0) ? C.gold : C.sur2 }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: 11, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif" }}>
        {rating > 0 ? rating.toFixed(1) : "No ratings"} {count > 0 ? `(${count})` : ""}
      </span>
    </div>
  );
}

export function AdminWorkers({ workers }: { workers: Worker[] }) {
  const sorted = [...workers].sort((a, b) => b.balance - a.balance);

  return (
    <div>
      <Eyebrow color={C.teal}>Admin</Eyebrow>
      <SectionTitle>Worker Management</SectionTitle>
      <GlowDivider colors={[C.teal, C.cyan]} />

      {workers.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>👥</div>
          <div style={{ color: C.gray }}>No workers registered yet</div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {sorted.map((w, i) => {
            const col = PALETTE[i % PALETTE.length];
            return (
              <Card key={w.id} style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${col},transparent)` }} />

                {/* Header */}
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${col},${C.ash}44)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#000", flexShrink: 0, boxShadow: `0 0 16px ${col}44` }}>{w.name[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.ash }}>{w.name}</div>
                    <div style={{ fontSize: 10, color: col, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>{w.skills[0] || "No specialty"}</div>
                  </div>
                  {i === 0 && (
                    <div style={{ fontSize: 22 }} title="Top earner">🥇</div>
                  )}
                </div>

                {/* Rating */}
                <div style={{ marginBottom: 12 }}>
                  <StarDisplay rating={w.rating || 0} count={w.ratingCount || 0} />
                </div>

                {/* Skills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                  {w.skills.map(s => <Badge key={s} color={C.gray2}>{s}</Badge>)}
                  {w.skills.length === 0 && <span style={{ fontSize: 12, color: C.gray }}>No skills listed</span>}
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: C.bg, borderRadius: 7, padding: "8px 12px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.gold }}>₦{w.balance.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>Balance</div>
                  </div>
                  <div style={{ flex: 1, background: C.bg, borderRadius: 7, padding: "8px 12px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.cyan }}>
                      {w.history.filter(h => h.status === "Approved").length}
                    </div>
                    <div style={{ fontSize: 9, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>Jobs Done</div>
                  </div>
                </div>

                {/* Bio */}
                {w.bio && (
                  <div style={{ fontSize: 12, color: C.gray2, lineHeight: 1.6, borderTop: `1px solid #ffffff07`, paddingTop: 10 }}>{w.bio}</div>
                )}

                {/* Member since */}
                <div style={{ fontSize: 10, color: C.gray, marginTop: 10, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em" }}>
                  Joined {new Date(w.joined).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
