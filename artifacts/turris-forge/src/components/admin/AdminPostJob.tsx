import { useState } from "react";
import { C, SKILL_CATEGORIES } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Input, Select, Btn, Card } from "../shared";
import type { Job } from "../../types";

export function AdminPostJob({ jobs, setJobs, showToast, setView }: { jobs: Job[]; setJobs: (fn: (p: Job[]) => Job[]) => void; showToast: (m: string) => void; setView: (v: string) => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState(SKILL_CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [pay, setPay] = useState("");
  const [hours, setHours] = useState("72");
  const [visibility, setVisibility] = useState("Public");
  const [refNote, setRefNote] = useState("");

  const handlePost = () => {
    if (!title || !pay) { showToast("⚠️ Title and pay are required"); return; }
    const job: Job = {
      id: "j" + Date.now(), title, description: desc, category, difficulty,
      pay: parseFloat(pay), deadline: Date.now() + parseFloat(hours) * 3600 * 1000,
      status: "Open", submissions: [], visibility, refNote, posted: Date.now(),
    };
    setJobs(p => [job, ...p]);
    showToast("✅ Job posted successfully!");
    setTitle(""); setDesc(""); setPay(""); setRefNote("");
    setView("jobs");
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <Eyebrow color={C.gold}>Admin</Eyebrow>
      <SectionTitle>Post a New Job</SectionTitle>
      <GlowDivider />
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Input label="Job Title" value={title} onChange={setTitle} placeholder="e.g. Key Animation — Redmask Scene 04" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray2 }}>Description & Instructions</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Detailed job description, references, requirements..." style={{ padding: "13px 15px", background: C.bg, border: `1px solid #ffffff10`, borderBottom: `2px solid ${C.cyan}44`, borderRadius: 8, color: C.ash, fontFamily: "'Inter',sans-serif", fontSize: 14, outline: "none", resize: "vertical", minHeight: 120 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Select label="Skill Category" value={category} onChange={setCategory} options={SKILL_CATEGORIES} accentColor={C.violet2} />
            <Select label="Difficulty" value={difficulty} onChange={setDifficulty} options={["Beginner","Intermediate","Expert"]} accentColor={C.gold} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Input label="Pay (₦)" type="number" value={pay} onChange={setPay} placeholder="250" />
            <Input label="Deadline (hours)" type="number" value={hours} onChange={setHours} placeholder="72" />
            <Select label="Visibility" value={visibility} onChange={setVisibility} options={["Public","Restricted"]} accentColor={C.teal} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray2 }}>Reference Notes</label>
            <textarea value={refNote} onChange={e => setRefNote(e.target.value)} placeholder="Style references, mood boards, example works..." style={{ padding: "13px 15px", background: C.bg, border: `1px solid #ffffff10`, borderBottom: `2px solid ${C.gold}44`, borderRadius: 8, color: C.ash, fontFamily: "'Inter',sans-serif", fontSize: 14, outline: "none", resize: "vertical", minHeight: 80 }} />
          </div>
          <div style={{ border: `2px dashed ${C.gold}33`, borderRadius: 8, padding: "24px", textAlign: "center", color: C.gray, fontSize: 13 }}>
            📎 Drag & drop reference files, images, PDFs · Max 50MB
            <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>(Firebase Storage integration point)</div>
          </div>
          <Btn onClick={handlePost} style={{ alignSelf: "flex-start", padding: "13px 40px" }}>🔥 Post Job</Btn>
        </div>
      </Card>
    </div>
  );
}
