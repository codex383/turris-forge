import { useState } from "react";
import { C } from "../../data/seed";
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

const NAV = [
  { id: "overview",     icon: "◈", label: "Overview"          },
  { id: "post",         icon: "＋", label: "Post Job"          },
  { id: "jobs",         icon: "≡", label: "Manage Jobs"       },
  { id: "submissions",  icon: "▣", label: "Submissions"       },
  { id: "workers",      icon: "⬡", label: "Workers"           },
  { id: "analytics",   icon: "◉", label: "Analytics"         },
];

export function AdminDashboard({ user, jobs, setJobs, workers, setWorkers, onLogout }: {
  user: AdminUser;
  jobs: Job[];
  setJobs: (fn: (p: Job[]) => Job[]) => void;
  workers: Worker[];
  setWorkers: (fn: (p: Worker[]) => Worker[]) => void;
  onLogout: () => void;
}) {
  const [view, setView] = useState("overview");
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => setToast(msg);

  const submittedCount = jobs.filter(j => j.status === "Submitted").length;

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === "Open").length,
    submitted: submittedCount,
    approved: jobs.filter(j => j.status === "Approved").length,
    paidOut: workers.reduce((s, w) => s + w.balance, 0),
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", zIndex: 1 }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
        background: "rgba(13,13,15,.97)",
        borderRight: `1px solid ${C.gold}18`,
        backdropFilter: "blur(20px)",
        zIndex: 50, display: "flex", flexDirection: "column",
      }}>
        {/* Brand */}
        <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid #ffffff07`, display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={26} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", color: C.ash, lineHeight: 1.2 }}>TURRIS FORGE</div>
            <div style={{ fontSize: 9, color: C.gold, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.8 }}>Admin Portal</div>
          </div>
        </div>

        {/* Profile */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid #ffffff07` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.gold2})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#000", flexShrink: 0 }}>{user.name[0]}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: C.ash, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: C.gold, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>Studio Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
          {NAV.map(({ id, icon, label }) => {
            const active = view === id;
            const badge = id === "submissions" && submittedCount > 0 ? submittedCount : 0;
            return (
              <button key={id} onClick={() => setView(id)} style={{
                padding: "9px 12px", display: "flex", alignItems: "center", gap: 9,
                fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                background: active ? `linear-gradient(90deg,${C.gold}20,transparent)` : "transparent",
                color: active ? C.gold : C.gray2,
                border: "none", borderLeft: active ? `2px solid ${C.gold}` : "2px solid transparent",
                borderRadius: "0 6px 6px 0", cursor: "pointer", transition: "all .2s", textAlign: "left",
              }}>
                <span style={{ fontSize: 14, opacity: active ? 1 : 0.5 }}>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {badge > 0 && <span style={{ background: C.ember, borderRadius: 10, padding: "1px 7px", fontSize: 10, color: "#fff", fontFamily: "'Inter',sans-serif" }}>{badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid #ffffff07` }}>
          <Btn variant="danger" onClick={onLogout} style={{ width: "100%", padding: "9px 12px", fontSize: 11, letterSpacing: "0.1em" }}>← Log Out</Btn>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{ height: 52, borderBottom: `1px solid #ffffff07`, display: "flex", alignItems: "center", padding: "0 32px", gap: 16, background: "rgba(13,13,15,.7)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.ash, fontWeight: 700 }}>
              {NAV.find(n => n.id === view)?.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.lime, boxShadow: `0 0 6px ${C.lime}` }} />
            <span style={{ fontSize: 11, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>Studio Live</span>
          </div>
        </div>

        {/* Page */}
        <div style={{ flex: 1, padding: "28px 36px", maxWidth: 1100, width: "100%" }}>
          {view === "overview"    && <AdminOverview stats={stats} jobs={jobs} workers={workers} setView={setView} />}
          {view === "post"        && <AdminPostJob jobs={jobs} setJobs={setJobs} showToast={showToast} setView={setView} />}
          {view === "jobs"        && <AdminManageJobs jobs={jobs} setJobs={setJobs} showToast={showToast} />}
          {view === "submissions" && <AdminSubmissions jobs={jobs} setJobs={setJobs} workers={workers} setWorkers={setWorkers} showToast={showToast} />}
          {view === "workers"     && <AdminWorkers workers={workers} />}
          {view === "analytics"   && <AdminAnalytics stats={stats} jobs={jobs} workers={workers} />}
        </div>
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
