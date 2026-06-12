import { useState } from "react";
import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card, Btn, statusColor, diffColor, useCountdown, fmtTime } from "../shared";
import type { Job } from "../../types";

function AdminJobRow({ job, onDelete }: { job: Job; onDelete: (id: string) => void }) {
  const [exp, setExp] = useState(false);
  const rem = useCountdown(job.deadline);
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }} onClick={() => setExp(p => !p)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.ash }}>{job.title}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge color={C.violet2}>{job.category}</Badge>
            <Badge color={diffColor(job.difficulty)}>{job.difficulty}</Badge>
            <Badge color={statusColor(job.status)}>{job.status}</Badge>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.gold }}>₦{job.pay.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: rem < 0 ? C.ember : rem < 3600 ? C.gold : C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em" }}>
            {rem < 0 ? "⚠️ EXPIRED" : `⏱ ${fmtTime(rem)}`}
          </div>
        </div>
        <span style={{ color: C.gray, fontSize: 18, transition: "transform .3s", transform: exp ? "rotate(90deg)" : "rotate(0)" }}>›</span>
      </div>
      {exp && (
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid #ffffff08` }}>
          <p style={{ fontSize: 13, color: C.gray2, lineHeight: 1.7, margin: "14px 0" }}>{job.description || "No description."}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="danger" onClick={() => onDelete(job.id)} style={{ fontSize: 12, padding: "8px 16px" }}>Delete Job</Btn>
          </div>
        </div>
      )}
    </Card>
  );
}

export function AdminManageJobs({ jobs, setJobs, showToast }: { jobs: Job[]; setJobs: (fn: (p: Job[]) => Job[]) => void; showToast: (m: string) => void }) {
  const [filter, setFilter] = useState("All");
  const statusFilters = ["All","Open","In Progress","Submitted","Approved","Expired"];
  const filtered = filter === "All" ? jobs : jobs.filter(j => j.status === filter);

  const deleteJob = (id: string) => {
    setJobs(p => p.filter(j => j.id !== id));
    showToast("Job removed.");
  };

  return (
    <div>
      <Eyebrow color={C.gold}>Admin</Eyebrow>
      <SectionTitle>Manage Jobs</SectionTitle>
      <GlowDivider />
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {statusFilters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 16px", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: filter === f ? `${C.gold}22` : C.sur, color: filter === f ? C.gold : C.gray2, border: `1px solid ${filter === f ? C.gold : "#ffffff10"}`, borderRadius: 4, cursor: "pointer", transition: "all .2s" }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(j => <AdminJobRow key={j.id} job={j} onDelete={deleteJob} />)}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.gray }}>No jobs in this category</div>
        )}
      </div>
    </div>
  );
}
