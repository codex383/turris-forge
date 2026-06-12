import { C } from "../../data/seed";
import { Eyebrow, SectionTitle, GlowDivider, Badge, Card, Btn } from "../shared";
import type { Job, Worker } from "../../types";

export function AdminSubmissions({ jobs, setJobs, workers, setWorkers, showToast }: { jobs: Job[]; setJobs: (fn: (p: Job[]) => Job[]) => void; workers: Worker[]; setWorkers: (fn: (p: Worker[]) => Worker[]) => void; showToast: (m: string) => void }) {
  const submitted = jobs.filter(j => j.status === "Submitted");

  const approve = (job: Job) => {
    setJobs(p => p.map(j => j.id === job.id ? { ...j, status: "Approved" } : j));
    const sub = job.submissions[job.submissions.length - 1];
    if (sub) {
      setWorkers(p => p.map(w => w.id === sub.workerId
        ? { ...w, balance: w.balance + sub.pay, history: [...w.history, { jobId: job.id, title: job.title, amount: sub.pay, date: Date.now(), status: "Approved" }] }
        : w));
    }
    showToast(`✅ Approved! ₦${sub?.pay || job.pay} credited to worker.`);
  };

  const reject = (job: Job) => {
    setJobs(p => p.map(j => j.id === job.id ? { ...j, status: "Open", submissions: [] } : j));
    showToast("❌ Submission rejected. Job reopened.");
  };

  return (
    <div>
      <Eyebrow color={C.cyan}>Admin</Eyebrow>
      <SectionTitle>Review Submissions</SectionTitle>
      <GlowDivider colors={[C.cyan, C.teal]} />
      {submitted.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📥</div>
          <div style={{ color: C.gray, fontSize: 14 }}>No pending submissions</div>
        </Card>
      ) : submitted.map(job => {
        const sub = job.submissions[job.submissions.length - 1];
        return (
          <Card key={job.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.ash, marginBottom: 8 }}>{job.title}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge color={C.violet2}>{job.category}</Badge>
                  <Badge color={C.gold}>Submitted</Badge>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: C.gold }}>₦{sub?.pay || job.pay}</div>
                <div style={{ fontSize: 11, color: C.gray }}>Payment on approval</div>
              </div>
            </div>
            {sub && (
              <div style={{ marginTop: 16, background: C.bg, borderRadius: 8, padding: 16 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray, marginBottom: 8 }}>Worker Notes</div>
                <p style={{ fontSize: 13, color: C.gray2, lineHeight: 1.6 }}>{sub.notes || "No notes provided."}</p>
                {sub.late && (
                  <div style={{ marginTop: 8, padding: "6px 12px", background: `${C.ember}22`, border: `1px solid ${C.ember}55`, borderRadius: 4, fontSize: 12, color: C.ember }}>
                    ⚠️ Late submission — Pay reduced to ₦{sub.pay}
                  </div>
                )}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Btn onClick={() => approve(job)} style={{ flex: 1 }}>✅ Approve & Pay</Btn>
              <Btn variant="danger" onClick={() => reject(job)} style={{ flex: 1 }}>❌ Reject</Btn>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
