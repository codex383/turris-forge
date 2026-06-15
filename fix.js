const fs = require('fs');
const f = '/data/data/com.termux/files/home/Turris-Forge/artifacts/turris-forge/src/components/worker/WorkerJobBoard.tsx';
let content = fs.readFileSync(f, 'utf8');

// Add lightbox state to WorkerJobBoard
content = content.replace(
  'export function WorkerJobBoard(',
  `function FileLightbox({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.92)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <img src={url} alt={name} style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: 10, boxShadow: "0 24px 60px #000000cc", objectFit: "contain" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 12 }}>
          <div style={{ fontSize: 12, color: "#A09890" }}>{name}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href={url} download={name} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 18px", background: "#E8912A22", border: "1px solid #E8912A55", borderRadius: 8, color: "#E8912A", fontSize: 12, textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>⬇ Download</a>
            <button onClick={onClose} style={{ padding: "8px 18px", background: "#22222A", border: "1px solid #ffffff10", borderRadius: 8, color: "#A09890", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700 }}>✕ Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkerJobBoard(`
);

// Add lightbox state inside WorkerJobBoard
content = content.replace(
  '  const [catFilter, setCatFilter] = useState("All");',
  '  const [catFilter, setCatFilter] = useState("All");\n  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);'
);

// Add ref files section to JobCard - after description
content = content.replace(
  `          {job.description.length > 120 && (
            <button onClick={() => setExpanded(p => !p)} style={{ background: "none", border: "none", color: C.cyan, fontSize: 11, cursor: "pointer", padding: "4px 0 0", fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em" }}>
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          )}`,
  `          {job.description.length > 120 && (
            <button onClick={() => setExpanded(p => !p)} style={{ background: "none", border: "none", color: C.cyan, fontSize: 11, cursor: "pointer", padding: "4px 0 0", fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em" }}>
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          )}
          {/* Reference files */}
          {(job as any).refFiles && (job as any).refFiles.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, color: C.gray, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>📎 Reference Files</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(job as any).refFiles.map((rf: any, ri: number) => (
                  rf.type?.startsWith("image") ? (
                    <div key={ri} style={{ position: "relative" }}>
                      <img src={rf.url} alt={rf.name} onClick={() => onLightbox(rf.url, rf.name)}
                        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6, border: \`1px solid \${C.gold}33\`, cursor: "pointer" }} />
                      <a href={rf.url} download={rf.name} target="_blank" rel="noopener noreferrer"
                        style={{ position: "absolute", bottom: 3, right: 3, background: "rgba(0,0,0,.7)", borderRadius: 3, padding: "1px 4px", fontSize: 9, color: "#fff", textDecoration: "none" }}>⬇</a>
                    </div>
                  ) : (
                    <a key={ri} href={rf.url} download={rf.name} target="_blank" rel="noopener noreferrer"
                      style={{ padding: "6px 10px", background: \`\${C.gold}0f\`, border: \`1px solid \${C.gold}22\`, borderRadius: 6, fontSize: 11, color: C.gold, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      📎 {rf.name} <span style={{ fontSize: 10 }}>⬇</span>
                    </a>
                  )
                ))}
              </div>
            </div>
          )}`
);

// Update JobCard props to include onLightbox
content = content.replace(
  'function JobCard({ job, user, activated, onAccept, featured, hasActiveJob }: { job: Job; user: Worker; activated: boolean; onAccept: () => void; featured?: boolean; hasActiveJob: boolean }) {',
  'function JobCard({ job, user, activated, onAccept, featured, hasActiveJob, onLightbox }: { job: Job; user: Worker; activated: boolean; onAccept: () => void; featured?: boolean; hasActiveJob: boolean; onLightbox: (url: string, name: string) => void }) {'
);

// Pass onLightbox to JobCard
content = content.replace(
  '          <JobCard key={job.id} job={job} user={user}\n            activated={activatedIds.includes(job.id)}\n            onAccept={() => onAccept(job)}\n            featured={tab === "recommended" && mySkills.includes(job.category)}\n            hasActiveJob={activeJobs.length > 0 && !activatedIds.includes(job.id)}\n          />',
  '          <JobCard key={job.id} job={job} user={user}\n            activated={activatedIds.includes(job.id)}\n            onAccept={() => onAccept(job)}\n            featured={tab === "recommended" && mySkills.includes(job.category)}\n            hasActiveJob={activeJobs.length > 0 && !activatedIds.includes(job.id)}\n            onLightbox={(url, name) => setLightbox({ url, name })}\n          />'
);

// Add lightbox render at end of WorkerJobBoard return
content = content.replace(
  '    </div>\n  );\n}',
  `      {lightbox && <FileLightbox url={lightbox.url} name={lightbox.name} onClose={() => setLightbox(null)} />}
    </div>
  );
}`
);

fs.writeFileSync(f, content);
console.log('Done');
