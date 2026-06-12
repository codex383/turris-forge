import { useState } from "react";
import { C, SEED_JOBS } from "../../data/seed";
import { Logo } from "../Logo";
import { Btn } from "../shared";
import { Toast } from "../Toast";
import { WorkerJobBoard } from "./WorkerJobBoard";
import { WorkerMyJobs } from "./WorkerMyJobs";
import { WorkerBalance } from "./WorkerBalance";
import { WorkerSettings } from "./WorkerSettings";
import type { Job, ActiveJob, Worker } from "../../types";

export function WorkerDashboard({ user, setUser, onLogout }: { user: Worker; setUser: (fn: (p: Worker) => Worker) => void; onLogout: () => void }) {
  const [view, setView] = useState("board");
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [toast, setToast] = useState<string | null>(null);
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

  const navItems = [
    ["board", "📋 Job Board"],
    ["my-jobs", "⚡ My Jobs"],
    ["balance", "💰 Balance"],
    ["settings", "⚙️ Settings"],
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 240, background: "rgba(26,26,31,.98)", borderRight: `1px solid ${C.cyan}22`, backdropFilter: "blur(20px)", zIndex: 50, display: "flex", flexDirection: "column", padding: "0 0 20px" }}>
        <div style={{ padding: "24px 20px", borderBottom: `1px solid #ffffff08`, display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={28} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.15em", color: C.ash }}>TURRIS FORGE</div>
            <div style={{ fontSize: 10, color: C.cyan, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.2em", textTransform: "uppercase" }}>Creative Portal</div>
          </div>
        </div>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid #ffffff08` }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#000", marginBottom: 8 }}>{user.name[0]}</div>
          <div style={{ fontSize: 14, color: C.ash, fontWeight: 500 }}>{user.name}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.gold, marginTop: 4 }}>₦{user.balance.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>Balance</div>
        </div>
        <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(([v, l]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: "10px 12px", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "left", background: view === v ? `${C.cyan}18` : "transparent", color: view === v ? C.cyan : C.gray2, border: "none", borderLeft: view === v ? `2px solid ${C.cyan}` : "2px solid transparent", borderRadius: 4, cursor: "pointer", transition: "all .25s" }}>
              {l}
              {v === "my-jobs" && activeJobs.length > 0 && (
                <span style={{ marginLeft: 6, background: C.ember, borderRadius: 10, padding: "1px 6px", fontSize: 10, color: "#fff" }}>{activeJobs.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding: "0 12px" }}>
          <Btn variant="danger" onClick={onLogout} style={{ width: "100%", padding: "9px 12px", fontSize: 12 }}>← Logout</Btn>
        </div>
      </div>
      <div style={{ marginLeft: 240, padding: "28px 36px", minHeight: "100vh" }}>
        {view === "board" && <WorkerJobBoard jobs={jobs} user={user} activeJobs={activeJobs} onAccept={acceptJob} />}
        {view === "my-jobs" && <WorkerMyJobs jobs={jobs} activeJobs={activeJobs} user={user} onSubmit={submitJob} />}
        {view === "balance" && <WorkerBalance user={user} />}
        {view === "settings" && <WorkerSettings user={user} setUser={setUser} showToast={showToast} />}
      </div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
