import { useState } from "react";
import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card, Btn, Input, statusColor } from "../shared";
import type { Worker } from "../../types";

export function WorkerBalance({ user }: { user: Worker }) {
  const history = user.history || [];
  const [bank, setBank] = useState("");
  const [acct, setAcct] = useState("");
  const [bankSaved, setBankSaved] = useState(false);

  const totalEarned = history.reduce((s, h) => s + h.amount, 0);
  const completedCount = history.filter(h => h.status === "Approved").length;
  const avgPay = completedCount ? Math.round(totalEarned / completedCount) : 0;

  return (
    <div>
      <Eyebrow color={C.gold}>Creative Portal</Eyebrow>
      <SectionTitle>My Balance</SectionTitle>
      <GlowDivider />

      {/* Balance hero */}
      <Card style={{ marginBottom: 20, background: `linear-gradient(135deg,${C.sur},${C.sur2})`, border: `1px solid ${C.gold}22`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.gold},${C.cyan},transparent)` }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gray, marginBottom: 6 }}>Available Balance</div>
            <div
              key={user.balance}
              style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 700, color: C.gold, lineHeight: 1, animation: "balancePop .6s ease" }}
            >
              ₦{user.balance.toLocaleString()}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {([["Total Earned", `₦${totalEarned.toLocaleString()}`, C.cyan], ["Jobs Done", completedCount, C.lime], ["Avg Pay", `₦${avgPay.toLocaleString()}`, C.violet2]] as [string, string|number, string][]).map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center", background: `${c}0f`, border: `1px solid ${c}22`, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: c }}>{v}</div>
                <div style={{ fontSize: 9, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {history.length > 0 && (
          <div style={{ marginTop: 18, display: "flex", gap: 2 }}>
            {history.map((h, i) => (
              <div key={i} title={`₦${h.amount}`} style={{
                flex: h.amount,
                height: 4,
                background: [C.gold, C.cyan, C.teal, C.lime][i % 4],
                borderRadius: 2,
                opacity: 0.7,
              }} />
            ))}
          </div>
        )}
      </Card>

      {/* Payment History */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Payment History</div>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "36px 0", color: C.gray }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
            <div style={{ fontSize: 13 }}>Complete and get your first job approved to see earnings here</div>
          </div>
        ) : history.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: `1px solid #ffffff06` }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: `${C.lime}18`, border: `1px solid ${C.lime}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✓</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: C.ash, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.title}</div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>
                {new Date(h.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <Badge color={statusColor(h.status)}>{h.status}</Badge>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.lime, minWidth: 80, textAlign: "right" }}>+₦{h.amount.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Payout Details */}
      <Card>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.cyan, marginBottom: 16 }}>Payout Details</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <Input label="Bank Name" value={bank} onChange={setBank} placeholder="e.g. GTBank" />
          <Input label="Account Number" value={acct} onChange={setAcct} placeholder="0123456789" />
        </div>
        {bankSaved && (
          <div style={{ marginBottom: 12, padding: "8px 12px", background: `${C.lime}18`, border: `1px solid ${C.lime}33`, borderRadius: 6, fontSize: 12, color: C.lime }}>
            ✓ Payout details saved
          </div>
        )}
        <Btn onClick={() => setBankSaved(true)} style={{ fontSize: 12, padding: "10px 24px" }}>Save Payout Details</Btn>
      </Card>
    </div>
  );
}
