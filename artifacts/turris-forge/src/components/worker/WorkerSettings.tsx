import { useState } from "react";
import { C, SKILL_CATEGORIES } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Input, Btn, Card } from "../shared";
import type { Worker } from "../../types";

export function WorkerSettings({ user, setUser, showToast }: { user: Worker; setUser: (fn: (p: Worker) => Worker) => void; showToast: (m: string) => void }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [portfolio, setPortfolio] = useState(user.portfolio || "");
  const [selectedSkills, setSelectedSkills] = useState(user.skills || []);

  const toggleSkill = (s: string) => setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const save = () => { setUser(p => ({ ...p, name, bio, portfolio, skills: selectedSkills })); showToast("✅ Profile updated!"); };

  return (
    <div style={{ maxWidth: 640 }}>
      <Eyebrow color={C.gray2}>Creative Portal</Eyebrow>
      <SectionTitle>Settings</SectionTitle>
      <GlowDivider colors={[C.gray, C.cyan]} />
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.violet2, marginBottom: 16 }}>Profile</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Display Name" value={name} onChange={setName} placeholder="Your forge name" />
          <Input label="Bio" value={bio} onChange={setBio} placeholder="Your creative background..." />
          <Input label="Portfolio URL" value={portfolio} onChange={setPortfolio} placeholder="https://artstation.com/you" />
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>My Skill Categories</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SKILL_CATEGORIES.map(s => (
            <button key={s} onClick={() => toggleSkill(s)}
              style={{ padding: "6px 12px", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", background: selectedSkills.includes(s) ? `${C.gold}22` : C.sur2, color: selectedSkills.includes(s) ? C.gold : C.gray2, border: `1px solid ${selectedSkills.includes(s) ? C.gold : "#ffffff10"}`, borderRadius: 4, cursor: "pointer", transition: "all .2s" }}>
              {s}
            </button>
          ))}
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.cyan, marginBottom: 16 }}>Account</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="New Password" type="password" value="" onChange={() => {}} placeholder="Leave blank to keep current" />
          <Input label="Confirm Password" type="password" value="" onChange={() => {}} placeholder="Confirm new password" />
        </div>
      </Card>
      <Btn onClick={save} style={{ padding: "13px 40px" }}>💾 Save Changes</Btn>
    </div>
  );
}
