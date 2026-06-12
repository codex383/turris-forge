import { useState } from "react";
import { C, SKILL_CATEGORIES } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card, Btn, statusColor, diffColor, useCountdown, fmtTime } from "../shared";
import type { Job, ActiveJob, Worker } from "../../types";

function JobCard({ job, user, activated, onAccept }: { job: Job; user: Worker; activated: boolean; onAccept: () => void }) {
  const rem = useCountdown(job.deadline);
  const skillMatch = user.skills?.some(s => s === job.category);
  return (
    <Card style={{ marginBottom: 16, border: `1px solid ${skillMatch ? C.gold + "44" : "#ffffff08"}`, boxShadow: skillMatch ? `0 0 30px ${C.gold}11` : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.ash, marginBottom: 8 }}>{job.title}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <Badge color={C.violet2}>{job.category}</Badge>
            <Badge color={diffColor(job.difficulty)}>{job.difficulty}</Badge>
            {skillMatch && <Badge color={C.gold}>✦ Matches Your Skills</Badge>}
          </div>
          <p style={{ fontSize: 13, color: C.gray2, lineHeight: 1.6 }}>{job.description.slice(0, 140)}{job.description.length > 140 ? "…" : ""}</p>
        </div>
        <div style={{ textAlign: "right", minWidth: 140 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: C.gold, marginBottom: 4 }}>₦{job.pay.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: rem < 3600 ? C.ember : rem < 3600 * 6 ? C.gold : C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em", marginBottom: 12 }}>
            ⏱ {fmtTime(rem)}
          </div>
          {activated ? (
            <div style={{ padding: "8px 16px", background: `${C.cyan}22`, border: `1px solid ${C.cyan}55`, borderRadius: 6, fontSize: 12, color: C.cyan, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em" }}>IN PROGRESS</div>
          ) : (
            <Btn onClick={onAccept} style={{ fontSize: 12, padding: "8px 20px" }}>⚡ Accept Job</Btn>
          )}
        </div>
      </div>
    </Card>
  );
}

export function WorkerJobBoard({ jobs, user, activeJobs, onAccept }: { jobs: Job[]; user: Worker; activeJobs: ActiveJob[]; onAccept: (job: Job) => void }) {
  const [catFilter, setCatFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("pay-desc");

  const mySkills = user.skills || [];
  const activatedIds = activeJobs.map(a => a.job.id);

  let filtered = jobs.filter(j => j.status === "Open");
  if (catFilter === "_my") filtered = filtered.filter(j => mySkills.includes(j.category));
  else if (catFilter !== "All") filtered = filtered.filter(j => j.category === catFilter);
  if (diffFilter !== "All") filtered = filtered.filter(j => j.difficulty === diffFilter);
  if (search) filtered = filtered.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.category.toLowerCase().includes(search.toLowerCase()));
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "pay-desc") return b.pay - a.pay;
    if (sortBy === "pay-asc") return a.pay - b.pay;
    if (sortBy === "deadline") return a.deadline - b.deadline;
    return b.posted - a.posted;
  });

  return (
    <div>
      <Eyebrow color={C.cyan}>Creative Portal</Eyebrow>
      <SectionTitle>Job Board</SectionTitle>
      <GlowDivider colors={[C.cyan, C.teal]} />
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search jobs..."
          style={{ padding: "9px 14px", background: C.sur, border: `1px solid #ffffff10`, borderRadius: 6, color: C.ash, fontFamily: "'Inter',sans-serif", fontSize: 13, outline: "none", minWidth: 200 }} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ padding: "9px 14px", background: C.sur, border: `1px solid #ffffff10`, borderRadius: 6, color: C.ash, fontSize: 13, outline: "none" }}>
          <option value="All">All Categories</option>
          {mySkills.length > 0 && <option value="_my">My Skills Only</option>}
          {SKILL_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)}
          style={{ padding: "9px 14px", background: C.sur, border: `1px solid #ffffff10`, borderRadius: 6, color: C.ash, fontSize: 13, outline: "none" }}>
          <option value="All">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: "9px 14px", background: C.sur, border: `1px solid #ffffff10`, borderRadius: 6, color: C.ash, fontSize: 13, outline: "none" }}>
          <option value="pay-desc">Highest Pay</option>
          <option value="pay-asc">Lowest Pay</option>
          <option value="deadline">Soonest Deadline</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div style={{ marginBottom: 8, fontSize: 12, color: C.gray }}>{filtered.length} job{filtered.length !== 1 ? "s" : ""} available</div>
      {filtered.map(job => (
        <JobCard key={job.id} job={job} user={user} activated={activatedIds.includes(job.id)} onAccept={() => onAccept(job)} />
      ))}
      {filtered.length === 0 && (
        <Card style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ color: C.gray }}>No jobs match your filters</div>
        </Card>
      )}
    </div>
  );
}
