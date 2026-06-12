import { useState } from "react";
import { C, SKILL_CATEGORIES, ADMIN_SECRET } from "../data/seed";
import { Logo } from "./Logo";
import { Toast } from "./Toast";
import { Input, Select, Btn } from "./shared";
import type { Worker } from "../types";

type User = Worker | { id: string; name: string; email: string; role: "admin"; balance: number };

export function AuthScreen({ onAuth }: { onAuth: (u: User) => void }) {
  const [mode, setMode] = useState<"login" | "register-worker" | "register-admin">("login");
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");
  const [secret, setSecret] = useState("");
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [studioRole, setStudioRole] = useState("Studio Director");

  const toggleSkill = (s: string) =>
    setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleLogin = () => {
    if (email === "admin@turrisforge.com" && pass === "admin123") {
      onAuth({ id: "admin1", name: "Wahnsinn", email, role: "admin", balance: 0 });
    } else {
      const SEED_WORKERS = [
        { id: "w1", name: "Seun Adesola", email: "seun@forge.ng", role: "worker" as const, skills: ["2D Animation","Character Design","Inking"], balance: 480, joined: Date.now()-3600*24*1000*20, bio: "Senior animator with 7 years in Japanese-style production.", portfolio: "https://artstation.com", history: [] },
        { id: "w2", name: "Tunde Eze", email: "tunde@forge.ng", role: "worker" as const, skills: ["Background Design","Concept Art","Layout & Composition"], balance: 210, joined: Date.now()-3600*24*1000*12, bio: "Environment specialist. Background in architectural illustration.", portfolio: "", history: [] },
      ];
      const found = SEED_WORKERS.find(w => w.email === email);
      if (found) { onAuth(found); }
      else { setToast("⚠️ Invalid credentials. Try admin@turrisforge.com / admin123"); }
    }
  };

  const handleRegisterWorker = () => {
    if (step === 1) {
      if (!name || !rEmail || !rPass) { setToast("Fill all fields"); return; }
      setStep(2); return;
    }
    if (selectedSkills.length === 0) { setToast("Select at least one skill"); return; }
    const user: Worker = { id: "w" + Date.now(), name, email: rEmail, role: "worker", skills: selectedSkills, balance: 0, joined: Date.now(), bio, portfolio, history: [] };
    onAuth(user);
  };

  const handleRegisterAdmin = () => {
    if (!name || !rEmail || !rPass) { setToast("Fill all fields"); return; }
    if (secret !== ADMIN_SECRET) { setToast("❌ Invalid studio secret code"); return; }
    onAuth({ id: "adm" + Date.now(), name, email: rEmail, role: "admin", balance: 0 });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 16px 40px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: 500 }}>
        <div style={{ position: "absolute", inset: -60, background: `radial-gradient(ellipse,${C.violet}1a 0%,${C.cyan}0a 60%,transparent 80%)`, pointerEvents: "none" }} />
        <div style={{ background: "rgba(26,26,31,.97)", backdropFilter: "blur(20px)", borderRadius: 16, padding: "44px 36px", border: "1px solid #ffffff10", position: "relative", overflow: "hidden", boxShadow: "0 30px 80px #00000099" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.violet},${C.pink},${C.gold},${C.cyan})`, backgroundSize: "200%", animation: "authBar 3s linear infinite" }} />
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-block", filter: `drop-shadow(0 0 12px ${C.gold})` }}>
              <Logo size={42} />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gold, marginTop: 8 }}>
              TURRIS FORGE · STUDIO PLATFORM
            </div>
          </div>

          <div style={{ display: "flex", gap: 0, background: C.bg, borderRadius: 8, padding: 4, marginBottom: 28 }}>
            {(["login", "register-worker", "register-admin"] as const).map((m, i) => {
              const labels = ["Log In", "Join as Creative", "Admin Access"];
              return (
                <button key={m} onClick={() => { setMode(m); setStep(1); }}
                  style={{ flex: 1, padding: "9px 6px", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: mode === m ? `linear-gradient(135deg,${C.violet}66,${C.cyan}33)` : "none", color: mode === m ? C.ash : C.gray, border: "none", borderRadius: 6, cursor: "pointer", boxShadow: mode === m ? `0 0 20px ${C.violet}44` : "none", transition: "all .3s" }}>
                  {labels[i]}
                </button>
              );
            })}
          </div>

          {mode === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@forge.com" />
              <Input label="Password" type="password" value={pass} onChange={setPass} placeholder="Your password" />
              <Btn onClick={handleLogin} style={{ width: "100%", padding: 15, marginTop: 4 }}>⚡ Enter the Forge</Btn>
              <div style={{ textAlign: "center", fontSize: 12, color: C.gray }}>
                Demo: <span style={{ color: C.gold }}>admin@turrisforge.com</span> / admin123
              </div>
              <div style={{ textAlign: "center", fontSize: 12, color: C.gray }}>
                or worker: <span style={{ color: C.cyan }}>seun@forge.ng</span> / any password
              </div>
            </div>
          )}

          {mode === "register-worker" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {step === 1 && <>
                <Input label="Your Display Name" value={name} onChange={setName} placeholder="Your forge name" />
                <Input label="Email" type="email" value={rEmail} onChange={setREmail} placeholder="you@example.com" />
                <Input label="Password" type="password" value={rPass} onChange={setRPass} placeholder="Strong password" />
                <Input label="Bio (optional)" value={bio} onChange={setBio} placeholder="Your creative background..." />
                <Input label="Portfolio Link" value={portfolio} onChange={setPortfolio} placeholder="https://artstation.com/you" />
                <Btn onClick={handleRegisterWorker} style={{ width: "100%", padding: 15 }}>Next → Select Skills</Btn>
              </>}
              {step === 2 && <>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray2, marginBottom: 4 }}>Your Skill Categories</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 260, overflowY: "auto" }}>
                  {SKILL_CATEGORIES.map(s => (
                    <button key={s} onClick={() => toggleSkill(s)}
                      style={{ padding: "6px 12px", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", background: selectedSkills.includes(s) ? `${C.gold}22` : C.sur2, color: selectedSkills.includes(s) ? C.gold : C.gray2, border: `1px solid ${selectedSkills.includes(s) ? C.gold : "#ffffff10"}`, borderRadius: 4, cursor: "pointer", transition: "all .2s" }}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn variant="subtle" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Btn>
                  <Btn onClick={handleRegisterWorker} style={{ flex: 1, padding: 15 }}>🔥 Join the Forge</Btn>
                </div>
              </>}
            </div>
          )}

          {mode === "register-admin" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Input label="Your Name" value={name} onChange={setName} placeholder="Studio admin name" />
              <Input label="Email" type="email" value={rEmail} onChange={setREmail} placeholder="admin@turrisforge.com" />
              <Input label="Password" type="password" value={rPass} onChange={setRPass} placeholder="Strong password" />
              <Select label="Your Studio Role" value={studioRole} onChange={setStudioRole} options={["Studio Director","Executive Producer","Production Manager","Lead Animator","Art Director"]} />
              <Input label="Admin Secret Code" type="password" value={secret} onChange={setSecret} placeholder="Studio-issued access code" />
              <Btn onClick={handleRegisterAdmin} style={{ width: "100%", padding: 15 }}>🏰 Access Admin Portal</Btn>
              <div style={{ fontSize: 12, color: C.gray, textAlign: "center" }}>
                Demo secret: <span style={{ color: C.violet2 }}>FORGE2026</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 20, background: `linear-gradient(135deg,${C.violet}1a,${C.cyan}0d)`, border: `1px solid ${C.violet}33`, borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.violet2, marginBottom: 10 }}>
            🏆 Creative Platform Benefits
          </div>
          {([["gold","Real pay for real animation work"],["cyan","Assigned by Africa's first anime studio"],["violet2","Build your portfolio with original IPs"],["lime","Performance bonuses & priority tasks"],["pink","Your name in the credits of our first release"]] as [keyof typeof C, string][]).map(([col, txt]) => (
            <div key={txt} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C[col], flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: C.gray2 }}>{txt}</div>
            </div>
          ))}
        </div>
      </div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
