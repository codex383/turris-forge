import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card, Btn, Input, statusColor } from "../shared";
import type { Worker } from "../../types";

export function WorkerBalance({ user }: { user: Worker }) {
  const history = user.history || [];
  return (
    <div>
      <Eyebrow color={C.gold}>Creative Portal</Eyebrow>
      <SectionTitle>My Balance</SectionTitle>
      <GlowDivider />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        {([
          ["Current Balance", `₦${user.balance.toLocaleString()}`, C.gold],
          ["Jobs Completed", history.filter(h => h.status === "Approved").length, C.lime],
          ["Total Earned", `₦${history.reduce((s, h) => s + h.amount, 0).toLocaleString()}`, C.cyan],
        ] as [string, string | number, string][]).map(([l, v, c]) => (
          <Card key={l} glow={c} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 700, background: `linear-gradient(135deg,${c},${C.ash})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray, marginTop: 4 }}>{l}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Payment History</div>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.gray }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
            Complete your first job to see payment history
          </div>
        ) : history.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid #ffffff06` }}>
            <div>
              <div style={{ fontSize: 13, color: C.ash }}>{h.title}</div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>
                {new Date(h.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Badge color={statusColor(h.status)}>{h.status}</Badge>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.gold }}>+₦{h.amount.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </Card>
      <Card style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cyan, marginBottom: 16 }}>Payout Details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="Bank Name" value="" onChange={() => {}} placeholder="e.g. GTBank" />
          <Input label="Account Number" value="" onChange={() => {}} placeholder="0123456789" />
        </div>
        <Btn style={{ marginTop: 16 }}>Save Payout Details</Btn>
      </Card>
    </div>
  );
}
