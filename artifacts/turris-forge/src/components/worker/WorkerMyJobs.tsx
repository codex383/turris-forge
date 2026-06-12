import { useState } from "react";
import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card, Btn, statusColor, diffColor, useCountdown, fmtTime } from "../shared";
import type { Job, ActiveJob, Worker } from "../../types";

function ActiveJobCard({ job, deadline, pay, onSubmit, onConfirmSubmit, submitting, notes, setNotes }: { job: Job; deadline: number; pay: number; onSubmit: () => void; onConfirmSubmit: () => void; submitting: boolean; notes: string; setNotes: (n: string) => void }) {
  const rem = useCountdown(deadline);
  const late = rem < 0;
  const overSecs = late ? Math.abs(rem) : 0;
  const penaltyPct = Math.min(0.8, Math.floor(overSecs / 600) * 0.02);
  const currentPay = late ? Math.max(pay * 0.2, pay * (1 - penaltyPct)) : pay;
  const urgentColor = late ? C.ember : rem < 3600 ? C.gold : rem < 3600 * 6 ? C.gold2 : C.cyan;

  return (
    <Card style={{ marginBottom: 16, border: `1px solid ${urgentColor}33`, boxShadow: late ? `0 0 30px ${C.ember}22` : rem < 3600 ? `0 0 30px ${C.gold}22` : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.ash, marginBottom: 8 }}>{job.title}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Badge color={C.violet2}>{job.category}</Badge>
            <Badge color={diffColor(job.difficulty)}>{job.difficulty}</Badge>
          </div>
        </div>
        <div style={{ textAlign: "center", background: `${urgentColor}11`, borderRadius: 10, padding: "12px 20px", border: `1px solid ${urgentColor}33` }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 32, fontWeight: 700, color: urgentColor, letterSpacing: "0.1em", animation: late ? "timerPulse 1s ease-in-out infinite" : "none" }}>
            {fmtTime(rem)}
          </div>
          <div style={{ fontSize: 10, color: C.gray, textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>
            {late ? "OVERDUE" : "Time Remaining"}
          </div>
          {late && (
            <div style={{ fontSize: 11, color: C.ember, marginTop: 4 }}>
              Pay dropping: ₦{Math.round(currentPay)} (-{Math.round(penaltyPct * 100)}%)
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: C.gray }}>Potential Pay</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: late ? C.ember : C.gold }}>
            ₦{Math.round(currentPay).toLocaleString()} / ₦{pay.toLocaleString()}
          </span>
        </div>
        <div style={{ height: 3, background: C.sur2, borderRadius: 2 }}>
          <div style={{ height: "100%", borderRadius: 2, transition: "width .5s", width: `${Math.round(currentPay / pay * 100)}%`, background: `linear-gradient(90deg,${late ? C.ember : C.gold},${C.cyan})` }} />
        </div>
      </div>

      {submitting ? (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray2 }}>Submission Notes</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe your work, any notes for the admin, file links..." style={{ padding: "13px 15px", background: C.bg, border: `1px solid #ffffff10`, borderBottom: `2px solid ${C.cyan}66`, borderRadius: 8, color: C.ash, fontFamily: "'Inter',sans-serif", fontSize: 14, outline: "none", resize: "vertical", minHeight: 100 }} />
          <div style={{ border: `2px dashed ${C.cyan}33`, borderRadius: 8, padding: "18px", textAlign: "center", color: C.gray, fontSize: 13 }}>
            📁 Upload your work files here · (Firebase Storage)
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="subtle" onClick={() => { setNotes(""); onSubmit(); }} style={{ flex: 1 }}>Cancel</Btn>
            <Btn onClick={onConfirmSubmit} style={{ flex: 2 }}>📨 Submit for Review</Btn>
          </div>
        </div>
      ) : (
        <Btn onClick={onSubmit} style={{ marginTop: 14, width: "100%" }}>📤 Submit Work</Btn>
      )}
    </Card>
  );
}

export function WorkerMyJobs({ jobs, activeJobs, user, onSubmit }: { jobs: Job[]; activeJobs: ActiveJob[]; user: Worker; onSubmit: (jobId: string, notes: string) => void }) {
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const mySubmitted = jobs.filter(j =>
    (j.status === "Submitted" || j.status === "Approved") &&
    j.submissions.some(s => s.workerId === user.id));

  return (
    <div>
      <Eyebrow color={C.gold}>Creative Portal</Eyebrow>
      <SectionTitle>My Jobs</SectionTitle>
      <GlowDivider />

      {activeJobs.length === 0 && mySubmitted.length === 0 && (
        <Card style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ color: C.gray, marginBottom: 16 }}>No active jobs yet</div>
          <div style={{ fontSize: 13, color: C.gray2 }}>Head to the Job Board to find work</div>
        </Card>
      )}

      {activeJobs.length > 0 && (
        <>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Active Jobs</div>
          {activeJobs.map(({ job, deadline, pay }) => (
            <ActiveJobCard key={job.id} job={job} deadline={deadline} pay={pay}
              onSubmit={() => setSubmitting(job.id)}
              onConfirmSubmit={() => { onSubmit(job.id, notes); setSubmitting(null); setNotes(""); }}
              submitting={submitting === job.id} notes={notes} setNotes={setNotes} />
          ))}
        </>
      )}

      {mySubmitted.length > 0 && (
        <>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: C.cyan, marginBottom: 12, marginTop: 28 }}>Submitted / Completed</div>
          {mySubmitted.map(j => {
            const sub = j.submissions.find(s => s.workerId === user.id);
            return (
              <Card key={j.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: C.ash }}>{j.title}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <Badge color={statusColor(j.status)}>{j.status}</Badge>
                      {sub?.late && <span style={{ marginLeft: 8, fontSize: 11, color: C.ember }}>Late submission</span>}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: C.gold }}>₦{sub?.pay || j.pay}</div>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}
