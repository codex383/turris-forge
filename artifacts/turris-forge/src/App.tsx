import { useState, useCallback, useEffect, useRef } from "react";
import { ParticleCanvas } from "./components/ParticleCanvas";
import { LoadingScreen } from "./components/LoadingScreen";
import { AuthScreen } from "./components/AuthScreen";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { WorkerDashboard } from "./components/worker/WorkerDashboard";
import { C, SEED_JOBS, SEED_WORKERS } from "./data/seed";
import { loadSession, saveSession, clearSession, storedToWorker, getUsers, registerUser, type StoredUser } from "./lib/auth";
import type { Job, Worker, Notification } from "./types";

type AdminUser = { id: string; name: string; email: string; role: "admin"; balance: number };
type AnyUser = Worker | AdminUser;

const STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  select option { background: #1A1A1F; }
  textarea { font-family: 'Inter', sans-serif; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #E8912A33; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #E8912A66; }

  @keyframes pageSlideIn {
    from { opacity: 0; transform: translateX(var(--from-x, 30px)); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes balancePop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.18); color: #A8FF3E; text-shadow: 0 0 24px #A8FF3E88; }
    100% { transform: scale(1); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function seedDefaultUsers() {
  const users = getUsers();
  if (!users.find(u => u.email === "admin@turrisforge.com")) {
    registerUser("Wahnsinn", "admin@turrisforge.com", "admin123", "admin");
  }
  if (!users.find(u => u.email === "seun@forge.ng")) {
    registerUser("Seun Adesola", "seun@forge.ng", "forge123", "worker", {
      skills: ["2D Animation","Character Design","Inking"],
      balance: 480, bio: "Senior animator with 7 years in Japanese-style production.",
      portfolio: "https://artstation.com",
    });
  }
  if (!users.find(u => u.email === "tunde@forge.ng")) {
    registerUser("Tunde Eze", "tunde@forge.ng", "forge123", "worker", {
      skills: ["Background Design","Concept Art","Layout & Composition"],
      balance: 210, bio: "Environment specialist. Background in architectural illustration.",
    });
  }
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AnyUser | null>(null);
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [workers, setWorkers] = useState<Worker[]>(() => { seedDefaultUsers(); return SEED_WORKERS; });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const prevJobIds = useRef<Set<string>>(new Set(SEED_JOBS.map(j => j.id)));

  // Restore session
  useEffect(() => {
    const session = loadSession();
    if (session) {
      if (session.role === "admin") {
        setUser({ id: session.id, name: session.name, email: session.email, role: "admin", balance: 0 });
      } else {
        const worker = storedToWorker(session);
        setUser(worker);
        setWorkers(prev => {
          const exists = prev.find(w => w.id === worker.id);
          return exists ? prev.map(w => w.id === worker.id ? worker : w) : [...prev, worker];
        });
      }
    }
  }, []);

  // Watch jobs for changes to generate notifications
  useEffect(() => {
    if (!user) return;

    // Detect new jobs posted (for workers)
    if (user.role === "worker") {
      const currentWorker = workers.find(w => w.id === user.id);
      if (!currentWorker) return;
      const newJobNotifs: Notification[] = [];

      jobs.forEach(j => {
        if (!prevJobIds.current.has(j.id) && j.status === "Open") {
          const isMatch = currentWorker.skills.includes(j.category);
          newJobNotifs.push({
            id: "n" + Date.now() + Math.random(),
            type: isMatch ? "job_match" : "job_match",
            text: isMatch
              ? `🎯 New job matches your skills: "${j.title}" — ₦${j.pay.toLocaleString()}`
              : `New job posted: "${j.title}" — ₦${j.pay.toLocaleString()}`,
            at: Date.now(),
            read: false,
            jobId: j.id,
          });
        }
        prevJobIds.current.add(j.id);
      });

      // Detect approved submissions
      jobs.forEach(j => {
        if (j.status === "Approved") {
          const mySub = j.submissions.find(s => s.workerId === user.id);
          if (mySub) {
            const already = notifications.find(n => n.type === "approved" && n.jobId === j.id);
            if (!already) {
              newJobNotifs.push({
                id: "nappr" + j.id,
                type: "approved",
                text: `✅ Your submission for "${j.title}" was approved — ₦${mySub.pay.toLocaleString()} credited!`,
                at: Date.now(),
                read: false,
                jobId: j.id,
              });
            }
          }
        }
        // Detect new admin messages
        (j.messages || []).forEach(m => {
          if (m.fromRole === "admin" && !m.read) {
            const already = notifications.find(n => n.id === "msg_" + m.id);
            if (!already) {
              newJobNotifs.push({
                id: "msg_" + m.id,
                type: "message",
                text: `💬 Admin messaged you on "${j.title}"`,
                at: m.at,
                read: false,
                jobId: j.id,
              });
            }
          }
        });
      });

      if (newJobNotifs.length > 0) {
        setNotifications(prev => [...newJobNotifs, ...prev]);
      }
    }

    // Admin: detect new submissions
    if (user.role === "admin") {
      const newNotifs: Notification[] = [];
      jobs.forEach(j => {
        if (j.status === "Submitted") {
          const already = notifications.find(n => n.type === "submitted" && n.jobId === j.id);
          if (!already) {
            const sub = j.submissions[j.submissions.length - 1];
            newNotifs.push({
              id: "nsub_" + j.id,
              type: "submitted",
              text: `📥 New submission for "${j.title}" — ₦${sub?.pay?.toLocaleString() || j.pay} pending review`,
              at: Date.now(),
              read: false,
              jobId: j.id,
            });
          }
        }
        // Detect worker messages
        (j.messages || []).forEach(m => {
          if (m.fromRole === "worker" && !m.read) {
            const already = notifications.find(n => n.id === "msg_" + m.id);
            if (!already) {
              newNotifs.push({
                id: "msg_" + m.id,
                type: "message",
                text: `💬 ${m.fromName} messaged on "${j.title}"`,
                at: m.at,
                read: false,
                jobId: j.id,
              });
            }
          }
        });
      });
      if (newNotifs.length > 0) {
        setNotifications(prev => [...newNotifs, ...prev]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, user?.id]);

  const handleAuth = useCallback((u: AnyUser, stored: StoredUser) => {
    saveSession(stored);
    setUser(u);
    if (u.role === "worker") {
      setWorkers(prev => {
        const exists = prev.find(w => w.id === u.id);
        return exists ? prev.map(w => w.id === u.id ? (u as Worker) : w) : [...prev, u as Worker];
      });
    }
  }, []);

  const handleLogout = useCallback(() => { clearSession(); setUser(null); setNotifications([]); }, []);
  const handleLoaded = useCallback(() => setLoading(false), []);

  const markNotifRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const clearNotifs = useCallback(() => setNotifications([]), []);

  const currentWorker = user?.role === "worker"
    ? workers.find(w => w.id === user.id) ?? (user as Worker)
    : null;

  return (
    <>
      <style>{STYLES}</style>
      <ParticleCanvas />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: `radial-gradient(ellipse 80% 60% at 50% -5%,${C.gold}08 0%,transparent 65%)` }} />

      {loading && <LoadingScreen onDone={handleLoaded} />}

      {!loading && !user && (
        <div style={{ position: "relative", zIndex: 1, animation: "fadeIn .4s ease" }}>
          <AuthScreen onAuth={handleAuth} />
        </div>
      )}

      {!loading && user?.role === "admin" && (
        <AdminDashboard
          user={user as AdminUser}
          jobs={jobs} setJobs={setJobs}
          workers={workers} setWorkers={setWorkers}
          onLogout={handleLogout}
          notifications={notifications}
          onMarkNotifRead={markNotifRead}
          onClearNotifs={clearNotifs}
        />
      )}

      {!loading && user?.role === "worker" && currentWorker && (
        <WorkerDashboard
          user={currentWorker}
          setUser={(fn) => setWorkers(prev => prev.map(w => w.id === currentWorker.id ? fn(w) : w))}
          jobs={jobs} setJobs={setJobs}
          onLogout={handleLogout}
          notifications={notifications}
          onMarkNotifRead={markNotifRead}
          onClearNotifs={clearNotifs}
          allWorkers={workers}
        />
      )}
    </>
  );
}
