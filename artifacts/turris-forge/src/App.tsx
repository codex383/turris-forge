import { useState, useCallback } from "react";
import { ParticleCanvas } from "./components/ParticleCanvas";
import { LoadingScreen } from "./components/LoadingScreen";
import { AuthScreen } from "./components/AuthScreen";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { WorkerDashboard } from "./components/worker/WorkerDashboard";
import { C } from "./data/seed";
import type { Worker } from "./types";

type AdminUser = { id: string; name: string; email: string; role: "admin"; balance: number };
type AnyUser = Worker | AdminUser;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AnyUser | null>(null);

  const handleAuth = useCallback((u: AnyUser) => setUser(u), []);
  const handleLogout = useCallback(() => setUser(null), []);
  const handleLoaded = useCallback(() => setLoading(false), []);

  return (
    <>
      <style>{`
        select option { background: #1A1A1F; }
        textarea { font-family: 'Inter', sans-serif; }
      `}</style>
      <ParticleCanvas />
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: `radial-gradient(ellipse 80% 80% at 50% -10%,${C.gold}0a 0%,transparent 60%)` }} />

      {loading && <LoadingScreen onDone={handleLoaded} />}

      {!loading && !user && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <AuthScreen onAuth={handleAuth} />
        </div>
      )}

      {!loading && user && user.role === "admin" && (
        <AdminDashboard user={user as AdminUser} onLogout={handleLogout} />
      )}

      {!loading && user && user.role === "worker" && (
        <WorkerDashboard
          user={user as Worker}
          setUser={(fn) => setUser(prev => prev ? fn(prev as Worker) : prev)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
