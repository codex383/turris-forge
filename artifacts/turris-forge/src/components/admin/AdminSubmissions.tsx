import { useState } from "react";
import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card, Btn, diffColor } from "../shared";
import type { Job, Worker } from "../../types";

function SubmissionCard({ job, workers, onApprove, onReject }: { job: Job; workers: Worker[]; onApprove: () => void; onReject: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const sub = job.submissions[job.submissions.length - 1];
  const worker = workers.find(w => w.id === sub?.workerId);

  return (
    <Card style={{ marginBottom: 16, border: `1px solid ${C.cyan}22`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.cyan},${C.teal},transparent)` }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <Badge color={C.violet2}>{job.category}</Badge>
            <Badge color={diffColor(job.difficulty)}>{job.difficulty}</Badge>
            {sub?.late && <Badge color={C.ember}>Late Submit</Badge>}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.ash, fontWeight: 700, lineHeight: 1.3 }}>{job.title}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: sub?.late ? C.ember : C.gold, fontWeight: 700 }}>₦{(sub?.pay || job.pay).toLocaleString()}</div>
          <div style={{ fontSize: 10, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>on approval</div>
        </div>
      </div>

      {/* Worker Info */}
      {worker && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, background: C.bg, borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#000", flexShrink: 0 }}>{worker.name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: C.ash, fontWeight: 600 }}>{worker.name}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
              {worker.skills.slice(0, 3).map(s => <Badge key={s} color={C.gray2}>{s}</Badge>)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.gray }}>Worker Balance</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.gold }}>₦{worker.balance.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Submission Notes */}
      {sub && (
        <div style={{ marginTop: 14 }}>
          <button onClick={() => setExpanded(p => !p)} style={{
            width: "100%", background: C.bg, border: `1px solid #ffffff08`, borderRadius: 8, padding: "10px 14px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            cursor: "pointer", color: C.ash, fontFamily: "'Barlow Condensed',sans-serif",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
          }}>
            <span>📋 Submission Notes & Details</span>
            <span style={{ color: C.cyan, transition: "transform .3s", display: "inline-block", transform: expanded ? "rotate(90deg)" : "none" }}>›</span>
          </button>
          {expanded && (
            <div style={{ background: C.bg, border: `1px solid #ffffff08`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "14px 14px" }}>
              <div style={{ fontSize: 13, color: C.gray2, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {sub.notes || <em style={{ color: C.gray }}>No notes provided by the worker.</em>}
              </div>
              {sub.late && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: `${C.ember}18`, border: `1px solid ${C.ember}44`, borderRadius: 6, fontSize: 12, color: C.ember, lineHeight: 1.5 }}>
                  ⚠️ <strong>Late submission.</strong> Pay reduced from ₦{job.pay.toLocaleString()} → ₦{sub.pay.toLocaleString()}
                </div>
              )}
              <div style={{ marginTop: 12, border: `2px dashed ${C.cyan}22`, borderRadius: 8, padding: "18px", textAlign: "center", color: C.gray, fontSize: 12 }}>
                📁 Submitted files & assets appear here (Firebase Storage integration)
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: C.gray, display: "flex", gap: 20 }}>
                <span>Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString("en-NG") : "—"}</span>
                <span>Job Pay: ₦{job.pay.toLocaleString()}</span>
                <span>Final Pay: ₦{sub.pay.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <Btn onClick={onApprove} style={{ flex: 2 }}>✅ Approve & Credit Payment</Btn>
        <Btn variant="danger" onClick={onReject} style={{ flex: 1 }}>✕ Reject</Btn>
      </div>
    </Card>
  );
}

export function AdminSubmissions({ jobs, setJobs, workers, setWorkers, showToast }: {
  jobs: Job[];
  setJobs: (fn: (p: Job[]) => Job[]) => void;
  workers: Worker[];
  setWorkers: (fn: (p: Worker[]) => Worker[]) => void;
  showToast: (m: string) => void;
}) {
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  const submitted = jobs.filter(j => j.status === "Submitted");
  const approved  = jobs.filter(j => j.status === "Approved" && j.submissions.length > 0);

  const approve = (job: Job) => {
    setJobs(p => p.map(j => j.id === job.id ? { ...j, status: "Approved" } : j));
    const sub = job.submissions[job.submissions.length - 1];
    if (sub) {
      setWorkers(p => p.map(w => w.id === sub.workerId
        ? { ...w, balance: w.balance + sub.pay, history: [...w.history, { jobId: job.id, title: job.title, amount: sub.pay, date: Date.now(), status: "Approved" }] }
        : w));
    }
    showToast(`✅ Approved! ₦${(sub?.pay || job.pay).toLocaleString()} credited to ${workers.find(w => w.id === sub?.workerId)?.name || "worker"}.`);
  };

  const reject = (job: Job) => {
    setJobs(p => p.map(j => j.id === job.id ? { ...j, status: "Open", submissions: [] } : j));
    showToast("❌ Submission rejected — job is reopened for bids.");
  };

  const tabs: { key: typeof filter; label: string; count: number }[] = [
    { key: "pending",  label: "Pending Review", count: submitted.length },
    { key: "approved", label: "Approved",        count: approved.length  },
  ];

  return (
    <div>
      <Eyebrow color={C.cyan}>Admin</Eyebrow>
      <SectionTitle>Submitted Projects</SectionTitle>
      <GlowDivider colors={[C.cyan, C.teal]} />

      {/* Summary strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          ["Awaiting Review", submitted.length, C.gold],
          ["Approved",        approved.length, C.lime],
          ["Total Submissions", jobs.filter(j => j.submissions.length > 0).length, C.cyan],
        ].map(([l, v, c]) => (
          <div key={String(l)} style={{ background: C.sur, border: `1px solid #ffffff08`, borderRadius: 8, padding: "12px 18px", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: String(c) }}>{v}</div>
            <div style={{ fontSize: 11, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, background: C.bg, borderRadius: 8, padding: 3, marginBottom: 22, width: "fit-content", border: `1px solid #ffffff08` }}>
        {tabs.map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: "7px 20px", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            background: filter === key ? `linear-gradient(135deg,${C.cyan}33,${C.teal}22)` : "transparent",
            color: filter === key ? C.ash : C.gray2,
            border: "none", borderRadius: 6, cursor: "pointer", transition: "all .2s",
            display: "flex", alignItems: "center", gap: 7,
          }}>
            {label}
            {count > 0 && <span style={{ background: filter === key ? C.cyan : C.gray, borderRadius: 10, padding: "1px 7px", fontSize: 10, color: "#000", fontFamily: "'Inter',sans-serif" }}>{count}</span>}
          </button>
        ))}
      </div>

      {/* Pending */}
      {filter === "pending" && (
        submitted.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>📥</div>
            <div style={{ color: C.gray, fontSize: 14 }}>No pending submissions</div>
            <div style={{ color: C.gray2, fontSize: 12, marginTop: 6 }}>Approved workers will appear here once they submit their work</div>
          </Card>
        ) : submitted.map(job => (
          <SubmissionCard key={job.id} job={job} workers={workers} onApprove={() => approve(job)} onReject={() => reject(job)} />
        ))
      )}

      {/* Approved */}
      {filter === "approved" && (
        approved.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🏆</div>
            <div style={{ color: C.gray, fontSize: 14 }}>No approved submissions yet</div>
          </Card>
        ) : approved.map(job => {
          const sub = job.submissions[job.submissions.length - 1];
          const worker = workers.find(w => w.id === sub?.workerId);
          return (
            <Card key={job.id} style={{ marginBottom: 14, border: `1px solid ${C.teal}33`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.lime},${C.teal},transparent)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.ash, marginBottom: 6 }}>{job.title}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Badge color={C.violet2}>{job.category}</Badge>
                    <Badge color={C.lime}>✓ Approved</Badge>
                  </div>
                  {worker && <div style={{ fontSize: 12, color: C.gray, marginTop: 6 }}>Worker: <span style={{ color: C.ash }}>{worker.name}</span></div>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: C.lime }}>₦{(sub?.pay || job.pay).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>credited to worker</div>
                  {sub?.submittedAt && <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{new Date(sub.submittedAt).toLocaleDateString()}</div>}
                </div>
              </div>
              {sub?.notes && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: C.bg, borderRadius: 6, fontSize: 12, color: C.gray2, lineHeight: 1.6, borderLeft: `3px solid ${C.lime}44` }}>
                  {sub.notes}
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
