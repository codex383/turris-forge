import { useState, useCallback } from "react";
import { ParticleCanvas } from "./components/ParticleCanvas";
import { LoadingScreen } from "./components/LoadingScreen";
import { AuthScreen } from "./components/AuthScreen";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { WorkerDashboard } from "./components/worker/WorkerDashboard";
import { C, SEED_JOBS, SEED_WORKERS } from "./data/seed";
import type { Job, Worker } from "./types";

type AdminUser = { id: string; name: string; email: string; role: "admin"; balance: number };
type AnyUser = Worker | AdminUser;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AnyUser | null>(null);
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [workers, setWorkers] = useState<Worker[]>(SEED_WORKERS);

  const handleAuth = useCallback((u: AnyUser) => {
    setUser(u);
    if (u.role === "worker") {
      setWorkers(prev => {
        const exists = prev.find(w => w.id === u.id);
        if (!exists) return [...prev, u as Worker];
        return prev;
      });
    }
  }, []);

  const handleLogout = useCallback(() => setUser(null), []);
  const handleLoaded = useCallback(() => setLoading(false), []);

  const currentWorker = user?.role === "worker"
    ? workers.find(w => w.id === user.id) ?? (user as Worker)
    : null;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        select option { background: #1A1A1F; }
        textarea { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E8912A33; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #E8912A66; }
        @keyframes balancePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.18); color: #A8FF3E; text-shadow: 0 0 24px #A8FF3E88; }
          100% { transform: scale(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(168,255,62,0); }
          50% { box-shadow: 0 0 0 6px rgba(168,255,62,0.18); }
        }
      `}</style>
      <ParticleCanvas />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: `radial-gradient(ellipse 80% 60% at 50% -5%,${C.gold}08 0%,transparent 65%)` }} />

      {loading && <LoadingScreen onDone={handleLoaded} />}

      {!loading && !user && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <AuthScreen onAuth={handleAuth} />
        </div>
      )}

      {!loading && user?.role === "admin" && (
        <AdminDashboard
          user={user as AdminUser}
          jobs={jobs}
          setJobs={setJobs}
          workers={workers}
          setWorkers={setWorkers}
          onLogout={handleLogout}
        />
      )}

      {!loading && user?.role === "worker" && currentWorker && (
        <WorkerDashboard
          user={currentWorker}
          setUser={(fn) => setWorkers(prev => prev.map(w => w.id === currentWorker.id ? fn(w) : w))}
          jobs={jobs}
          setJobs={setJobs}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
