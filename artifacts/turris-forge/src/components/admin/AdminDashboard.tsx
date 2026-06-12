import { useState } from "react";
import { C, SEED_JOBS, SEED_WORKERS } from "../../data/seed";
import { Logo } from "../Logo";
import { Btn } from "../shared";
import { Toast } from "../Toast";
import { AdminOverview } from "./AdminOverview";
import { AdminPostJob } from "./AdminPostJob";
import { AdminManageJobs } from "./AdminManageJobs";
import { AdminSubmissions } from "./AdminSubmissions";
import { AdminWorkers } from "./AdminWorkers";
import { AdminAnalytics } from "./AdminAnalytics";
import type { Job, Worker } from "../../types";

interface AdminUser { id: string; name: string; email: string; role: "admin"; balance: number; }

export function AdminDashboard({ user, onLogout }: { user: AdminUser; onLogout: () => void }) {
  const [view, setView] = useState("overview");
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [workers, setWorkers] = useState<Worker[]>(SEED_WORKERS);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => setToast(msg);

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === "Open").length,
    submitted: jobs.filter(j => j.status === "Submitted").length,
    approved: jobs.filter(j => j.status === "Approved").length,
    paidOut: workers.reduce((s, w) => s + w.balance, 0),
  };

  const navItems = [
    ["overview", "📊 Overview"],
    ["post", "➕ Post Job"],
    ["jobs", "📋 Manage Jobs"],
    ["submissions", "📥 Review Submissions"],
    ["workers", "👥 Workers"],
    ["analytics", "📈 Analytics"],
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 240, background: "rgba(26,26,31,.98)", borderRight: `1px solid ${C.gold}22`, backdropFilter: "blur(20px)", zIndex: 50, display: "flex", flexDirection: "column", padding: "0 0 20px" }}>
        <div style={{ padding: "24px 20px", borderBottom: `1px solid #ffffff08`, display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={28} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.15em", color: C.ash }}>TURRIS FORGE</div>
            <div style={{ fontSize: 10, color: C.gold, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.2em", textTransform: "uppercase" }}>Admin Portal</div>
          </div>
        </div>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid #ffffff08` }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.gold2})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#000", marginBottom: 8 }}>{user.name[0]}</div>
          <div style={{ fontSize: 14, color: C.ash, fontWeight: 500 }}>{user.name}</div>
          <div style={{ fontSize: 11, color: C.gold, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>Studio Admin</div>
        </div>
        <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(([v, l]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: "10px 12px", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "left", background: view === v ? `${C.gold}18` : "transparent", color: view === v ? C.gold : C.gray2, border: "none", borderLeft: view === v ? `2px solid ${C.gold}` : "2px solid transparent", borderRadius: 4, cursor: "pointer", transition: "all .25s" }}>
              {l}
            </button>
          ))}
        </nav>
        <div style={{ padding: "0 12px" }}>
          <Btn variant="danger" onClick={onLogout} style={{ width: "100%", padding: "9px 12px", fontSize: 12 }}>← Logout</Btn>
        </div>
      </div>
      <div style={{ marginLeft: 240, padding: "28px 36px", minHeight: "100vh" }}>
        {view === "overview" && <AdminOverview stats={stats} jobs={jobs} workers={workers} setView={setView} />}
        {view === "post" && <AdminPostJob jobs={jobs} setJobs={setJobs} showToast={showToast} setView={setView} />}
        {view === "jobs" && <AdminManageJobs jobs={jobs} setJobs={setJobs} showToast={showToast} />}
        {view === "submissions" && <AdminSubmissions jobs={jobs} setJobs={setJobs} workers={workers} setWorkers={setWorkers} showToast={showToast} />}
        {view === "workers" && <AdminWorkers workers={workers} />}
        {view === "analytics" && <AdminAnalytics stats={stats} jobs={jobs} workers={workers} />}
      </div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
