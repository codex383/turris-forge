import { useState } from "react";
import { C } from "../../data/seed";
import { Logo } from "../Logo";
import { Btn } from "../shared";
import { Toast } from "../Toast";
import { WorkerJobBoard } from "./WorkerJobBoard";
import { WorkerMyJobs } from "./WorkerMyJobs";
import { WorkerBalance } from "./WorkerBalance";
import { WorkerSettings } from "./WorkerSettings";
import type { Job, ActiveJob, Worker } from "../../types";

const NAV = [
  { id: "board",    icon: "◈", label: "Job Board" },
  { id: "my-jobs",  icon: "⚡", label: "My Jobs"   },
  { id: "balance",  icon: "₦", label: "Balance"   },
  { id: "settings", icon: "⚙", label: "Settings"  },
];

export function WorkerDashboard({ user, setUser, jobs, setJobs, onLogout }: {
  user: Worker;
  setUser: (fn: (p: Worker) => Worker) => void;
  jobs: Job[];
  setJobs: (fn: (p: Job[]) => Job[]) => void;
  onLogout: () => void;
}) {
  const [view, setView] = useState("board");
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [lastApprovedAmount, setLastApprovedAmount] = useState<number | null>(null);
  const showToast = (msg: string) => setToast(msg);

  const acceptJob = (job: Job) => {
    if (activeJobs.find(a => a.job.id === job.id)) { showToast("Already accepted!"); return; }
    setJobs(p => p.map(j => j.id === job.id ? { ...j, status: "In Progress" } : j));
    setActiveJobs(p => [...p, { job, deadline: job.deadline, startedAt: Date.now(), pay: job.pay }]);
    showToast("⚡ Job accepted! Countdown started.");
    setView("my-jobs");
  };

  const submitJob = (jobId: string, notes: string) => {
    const active = activeJobs.find(a => a.job.id === jobId);
    if (!active) return;
    const now = Date.now();
    const late = now > active.deadline;
    const overSecs = late ? (now - active.deadline) / 1000 : 0;
    const penaltyPct = Math.min(0.8, Math.floor(overSecs / 600) * 0.02);
    const finalPay = late ? Math.max(active.pay * 0.2, active.pay * (1 - penaltyPct)) : active.pay;
    const sub = { workerId: user.id, notes, submittedAt: now, pay: Math.round(finalPay), late };
    setJobs(p => p.map(j => j.id === jobId ? { ...j, status: "Submitted", submissions: [...j.submissions, sub] } : j));
    setActiveJobs(p => p.filter(a => a.job.id !== jobId));
    showToast(late
      ? `📨 Submitted late — Pending review (₦${Math.round(finalPay)} due to lateness)`
      : "📨 Submitted on time! Pending admin review.");
    setView("my-jobs");
  };

  const mySubmitted = jobs.filter(j =>
    j.status === "Submitted" && j.submissions.some(s => s.workerId === user.id));
  const myApproved = jobs.filter(j =>
    j.status === "Approved" && j.submissions.some(s => s.workerId === user.id));

  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", zIndex: 1 }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
        background: "rgba(13,13,15,.97)",
        borderRight: `1px solid ${C.cyan}18`,
        backdropFilter: "blur(20px)",
        zIndex: 50, display: "flex", flexDirection: "column",
      }}>
        {/* Brand */}
        <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid #ffffff07`, display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={26} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", color: C.ash, lineHeight: 1.2 }}>TURRIS FORGE</div>
            <div style={{ fontSize: 9, color: C.cyan, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.8 }}>Creative Portal</div>
          </div>
        </div>

        {/* Profile + Balance */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid #ffffff07` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#000", flexShrink: 0 }}>{user.name[0]}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: C.ash, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: C.cyan, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>Creative</div>
            </div>
          </div>
          <div style={{ background: `${C.gold}0f`, border: `1px solid ${C.gold}22`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>Current Balance</div>
            <div
              key={user.balance}
              style={{
                fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: C.gold,
                animation: lastApprovedAmount ? "balancePop .6s ease" : "none",
              }}
              onAnimationEnd={() => setLastApprovedAmount(null)}
            >
              ₦{user.balance.toLocaleString()}
            </div>
            {lastApprovedAmount && (
              <div style={{ fontSize: 11, color: C.lime, fontFamily: "'Barlow Condensed',sans-serif", animation: "fadeSlideIn .4s ease" }}>
                +₦{lastApprovedAmount.toLocaleString()} credited ✓
              </div>
            )}
          </div>
          {mySubmitted.length > 0 && (
            <div style={{ marginTop: 8, padding: "6px 10px", background: `${C.cyan}11`, border: `1px solid ${C.cyan}33`, borderRadius: 6, fontSize: 11, color: C.cyan, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em" }}>
              ⏳ {mySubmitted.length} awaiting review
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 1 }}>
          {NAV.map(({ id, icon, label }) => {
            const active = view === id;
            const badge = id === "my-jobs" ? activeJobs.length + mySubmitted.length : 0;
            return (
              <button key={id} onClick={() => setView(id)} style={{
                padding: "9px 12px", display: "flex", alignItems: "center", gap: 9,
                fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                background: active ? `linear-gradient(90deg,${C.cyan}20,transparent)` : "transparent",
                color: active ? C.cyan : C.gray2,
                border: "none", borderLeft: active ? `2px solid ${C.cyan}` : "2px solid transparent",
                borderRadius: "0 6px 6px 0", cursor: "pointer", transition: "all .2s", textAlign: "left",
              }}>
                <span style={{ fontSize: 14, opacity: active ? 1 : 0.5 }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {badge > 0 && <span style={{ background: C.ember, borderRadius: 10, padding: "1px 7px", fontSize: 10, color: "#fff", fontFamily: "'Inter',sans-serif" }}>{badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Quick stats */}
        <div style={{ padding: "10px 18px", borderTop: `1px solid #ffffff07`, display: "flex", justifyContent: "space-between" }}>
          {([["Active", activeJobs.length, C.gold], ["Submitted", mySubmitted.length, C.cyan], ["Done", myApproved.length, C.lime]] as [string, number, string][]).map(([l, v, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: c }}>{v}</div>
              <div style={{ fontSize: 9, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid #ffffff07` }}>
          <Btn variant="danger" onClick={onLogout} style={{ width: "100%", padding: "9px 12px", fontSize: 11, letterSpacing: "0.1em" }}>← Log Out</Btn>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ height: 52, borderBottom: `1px solid #ffffff07`, display: "flex", alignItems: "center", padding: "0 32px", gap: 16, background: "rgba(13,13,15,.7)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 40 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.ash, fontWeight: 700 }}>
            {NAV.find(n => n.id === view)?.label}
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {user.skills.slice(0, 2).map(s => (
              <span key={s} style={{ fontSize: 10, background: `${C.cyan}18`, border: `1px solid ${C.cyan}33`, borderRadius: 4, padding: "2px 8px", color: C.cyan, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, padding: "28px 36px", maxWidth: 1100, width: "100%" }}>
          {view === "board"    && <WorkerJobBoard jobs={jobs} user={user} activeJobs={activeJobs} onAccept={acceptJob} />}
          {view === "my-jobs"  && <WorkerMyJobs jobs={jobs} activeJobs={activeJobs} user={user} onSubmit={submitJob} />}
          {view === "balance"  && <WorkerBalance user={user} />}
          {view === "settings" && <WorkerSettings user={user} setUser={setUser} showToast={showToast} />}
        </div>
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
