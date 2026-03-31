import PageShell from "../components/PageShell";

/* ═══════════════════════════════════════════════════════════════════════
   SPC-1 BENCHMARK DATA (public industry results)
   ═══════════════════════════════════════════════════════════════════════ */
const spc1Data = [
  { vendor: "Huawei OceanStor", iops: 6_003_293, latency: 0.469, year: 2023 },
  { vendor: "Pure Storage FlashArray//XL", iops: 5_100_000, latency: 0.5, year: 2023 },
  { vendor: "Dell PowerStore 9200T", iops: 3_007_681, latency: 0.542, year: 2022 },
  { vendor: "NetApp AFF A900", iops: 2_400_000, latency: 0.48, year: 2022 },
  { vendor: "HPE Primera A670", iops: 1_800_000, latency: 0.52, year: 2021 },
  { vendor: "IBM FlashSystem 9200", iops: 1_500_000, latency: 0.55, year: 2021 },
];

/* ═══════════════════════════════════════════════════════════════════════
   ASA / LAYERED CORRECTNESS EVIDENCE (challenge lab validated)
   ═══════════════════════════════════════════════════════════════════════ */
const asaData = [
  {
    metric: "Corruption detection",
    result: "< 1ms per chain",
    complexity: "O(1) hash comparison",
    status: "PROVEN",
  },
  {
    metric: "Five-outcome arbitration",
    result: "0.178s / 10K blocks",
    complexity: "O(n) → O(log n) fast path",
    status: "PROVEN",
  },
  {
    metric: "Positional retrieval",
    result: "3.40x for 100x data",
    complexity: "O(log n) Merkle descent",
    status: "PROVEN",
  },
  {
    metric: "Root hash comparison",
    result: "Single SHA-256 compare",
    complexity: "O(1)",
    status: "PROVEN",
  },
  {
    metric: "Divergence detection",
    result: "2.52x for 10x data",
    complexity: "O(log n) tree narrowing",
    status: "PROVEN",
  },
  {
    metric: "Proof path generation",
    result: "10 hops / 1024 blocks",
    complexity: "O(log n) = log₂(n)",
    status: "PROVEN",
  },
  {
    metric: "Selective rebuild cost",
    result: "Exact block count from corruption point",
    complexity: "O(1) after detection",
    status: "PROVEN",
  },
  {
    metric: "Structural deduplication",
    result: "97.2% payload reduction · 36.5:1 ratio",
    complexity: "Content-addressed reuse",
    status: "PROVEN",
  },
  {
    metric: "Composite reconstruction",
    result: "24/24 unit + 10/10 Cat 6",
    complexity: "Verified fragment merge + structural refusal",
    status: "PROVEN",
  },
  {
    metric: "Multi-controller correctness",
    result: "10/10 Cat 7",
    complexity: "Committed-data truth from substrate structure",
    status: "PROVEN",
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   QUADRANT CHART DATA — Performance vs Correctness positioning
   ═══════════════════════════════════════════════════════════════════════ */
const quadrantPoints = [
  { label: "Huawei", x: 95, y: 15, color: "rgba(59,130,246,0.9)" },
  { label: "Pure", x: 88, y: 18, color: "rgba(59,130,246,0.9)" },
  { label: "Dell", x: 72, y: 20, color: "rgba(59,130,246,0.9)" },
  { label: "NetApp", x: 65, y: 25, color: "rgba(59,130,246,0.9)" },
  { label: "HPE", x: 55, y: 22, color: "rgba(59,130,246,0.9)" },
  { label: "IBM", x: 50, y: 28, color: "rgba(59,130,246,0.9)" },
  { label: "RAID-6", x: 30, y: 35, color: "rgba(148,163,184,0.7)" },
  { label: "ZFS", x: 35, y: 55, color: "rgba(148,163,184,0.7)" },
  { label: "Blockchain", x: 10, y: 85, color: "rgba(148,163,184,0.7)" },
  { label: "ASA", x: 60, y: 90, color: "rgba(16,185,129,1)" },
];

/* ═══════════════════════════════════════════════════════════════════════
   SHARED STYLE TOKENS — matched to Architecture.jsx dark theme
   ═══════════════════════════════════════════════════════════════════════ */
const S = {
  label: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    opacity: 0.72,
    marginBottom: "12px",
  },
  sectionCard: {
    border: "1px solid rgba(255,255,255,0.12)",
    borderLeft: "4px solid rgba(255,255,255,0.55)",
    borderRadius: "18px",
    padding: "28px 24px",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(4px)",
    marginBottom: "52px",
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.02)",
  },
  th: {
    padding: "14px 18px",
    textAlign: "left",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
    color: "rgba(255,255,255,0.55)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "14px 18px",
    fontSize: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    lineHeight: 1.5,
  },
  proven: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    background: "rgba(16,185,129,0.15)",
    color: "#6ee7b7",
    border: "1px solid rgba(16,185,129,0.3)",
  },
  designGoal: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    background: "rgba(234,179,8,0.12)",
    color: "#fcd34d",
    border: "1px solid rgba(234,179,8,0.25)",
  },
};

function StatusBadge({ status }) {
  const style = status === "PROVEN" ? S.proven : S.designGoal;
  return <span style={style}>{status}</span>;
}

function formatIOPS(n) {
  return n >= 1_000_000
    ? (n / 1_000_000).toFixed(1) + "M"
    : (n / 1_000).toFixed(0) + "K";
}

/* ═══════════════════════════════════════════════════════════════════════
   QUADRANT CHART — SVG, no dependencies
   ═══════════════════════════════════════════════════════════════════════ */
function QuadrantChart() {
  const w = 600, h = 440;
  const pad = { top: 30, right: 30, bottom: 50, left: 60 };
  const pw = w - pad.left - pad.right;
  const ph = h - pad.top - pad.bottom;

  return (
    <div style={{ ...S.tableWrap, padding: "24px", marginBottom: "52px" }}>
      <div style={S.label}>Performance vs Correctness — Orthogonal Axes</div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", height: "auto", maxWidth: 600 }}
      >
        <rect
          x={pad.left} y={pad.top} width={pw} height={ph}
          fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)"
        />
        <line
          x1={pad.left + pw / 2} y1={pad.top}
          x2={pad.left + pw / 2} y2={pad.top + ph}
          stroke="rgba(255,255,255,0.06)" strokeDasharray="6,4"
        />
        <line
          x1={pad.left} y1={pad.top + ph / 2}
          x2={pad.left + pw} y2={pad.top + ph / 2}
          stroke="rgba(255,255,255,0.06)" strokeDasharray="6,4"
        />

        <text
          x={pad.left + pw * 0.75}
          y={pad.top + 18}
          fill="rgba(255,255,255,0.18)"
          fontSize="11"
          textAnchor="middle"
          fontWeight="600"
        >
          HIGH PERF / HIGH CORRECT
        </text>
        <text
          x={pad.left + pw * 0.25}
          y={pad.top + ph - 8}
          fill="rgba(255,255,255,0.18)"
          fontSize="11"
          textAnchor="middle"
          fontWeight="600"
        >
          LOW PERF / LOW CORRECT
        </text>

        <rect
          x={pad.left + pw * 0.4} y={pad.top + ph * 0.02}
          width={pw * 0.35} height={ph * 0.22}
          rx="8"
          fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.2)"
          strokeDasharray="4,3"
        />
        <text
          x={pad.left + pw * 0.575} y={pad.top + ph * 0.17}
          fill="rgba(16,185,129,0.4)" fontSize="9" textAnchor="middle"
          fontWeight="600" letterSpacing="0.1em"
        >
          ASA OPPORTUNITY
        </text>

        {quadrantPoints.map((p, i) => {
          const cx = pad.left + (p.x / 100) * pw;
          const cy = pad.top + ph - (p.y / 100) * ph;
          const isASA = p.label === "ASA";
          return (
            <g key={i}>
              <circle
                cx={cx} cy={cy}
                r={isASA ? 8 : 5}
                fill={p.color}
                stroke={isASA ? "rgba(16,185,129,0.5)" : "none"}
                strokeWidth={isASA ? 2 : 0}
              />
              {isASA && (
                <circle
                  cx={cx} cy={cy} r={14}
                  fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1"
                />
              )}
              <text
                x={cx + (isASA ? 18 : 8)} y={cy + 4}
                fill={isASA ? "#6ee7b7" : "rgba(255,255,255,0.6)"}
                fontSize={isASA ? "13" : "11"}
                fontWeight={isASA ? "700" : "400"}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        <text
          x={pad.left + pw / 2} y={h - 8}
          fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle"
          fontWeight="600" letterSpacing="0.08em"
        >
          I/O PERFORMANCE →
        </text>
        <text
          x={16} y={pad.top + ph / 2}
          fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle"
          fontWeight="600" letterSpacing="0.08em"
          transform={`rotate(-90,16,${pad.top + ph / 2})`}
        >
          STRUCTURAL CORRECTNESS →
        </text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function CorrectnessArbitration() {
  return (
    <PageShell>
      {/* ─── HERO ─── */}
      <section style={{ marginBottom: "60px" }}>
        <div style={S.label}>Layered correctness architecture</div>
        <h1 style={{ fontSize: "42px", marginBottom: "10px", lineHeight: 1.1 }}>
          Correctness Without Controller Primacy
        </h1>
        <p style={{ fontSize: "20px", maxWidth: "940px", opacity: 0.9, lineHeight: 1.7 }}>
          This work treats correctness as a structural property of storage systems,
          not a behavioral property of controllers. The architecture now has
          four proven layers: content-addressing, structural arbitration,
          composite reconstruction, and multi-controller correctness. The result
          is a stronger claim than faster detection alone: for committed data,
          correctness authority can be derived from substrate-level structural
          properties plus the commit boundary definition, without inter-controller
          coordination.
        </p>
      </section>

      {/* ─── THE ARGUMENT ─── */}
      <section style={S.sectionCard}>
        <div style={S.label}>Why this matters</div>
        <h2 style={{ fontSize: "28px", lineHeight: 1.2, marginBottom: "14px", maxWidth: "940px" }}>
          Performance assumes correctness. This architecture proves more of it.
        </h2>
        <p style={{ fontSize: "17px", lineHeight: 1.75, maxWidth: "940px", opacity: 0.9, marginBottom: "18px" }}>
          Every storage benchmark assumes the data being moved is already the right
          data. That leaves a deeper question mostly unmeasured: what happens when
          replicas diverge, when committed state conflicts, or when a controller
          fails and a surviving process must determine what is structurally true.
          This work began by introducing correctness arbitration as a missing axis.
          It now extends further: composite reconstruction and multi-controller
          correctness are proven, which means correctness is no longer just a
          detection problem. It becomes a layered architectural property.
        </p>
        <p style={{ fontSize: "15px", opacity: 0.6, maxWidth: "920px" }}>
          The comparison to SPC-1 still matters, but the larger point is now
          architectural: correctness authority can move downward into the
          substrate rather than remaining primarily controller-resident.
        </p>
      </section>

      {/* ─── LAYERED ARCHITECTURE ─── */}
      <section style={{ marginBottom: "52px" }}>
        <div style={S.label}>Architecture</div>
        <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
          Layered Correctness Architecture
        </h2>
        <p style={{ maxWidth: "920px", opacity: 0.82, marginBottom: "24px", lineHeight: 1.7 }}>
          The work is no longer just an arbitration primitive. It is a layered
          correctness stack that starts at payload identity and extends upward to
          controller-level truth determination for committed data.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(16,185,129,0.18)",
              borderRadius: "14px",
              padding: "20px 18px",
              background: "rgba(16,185,129,0.03)",
            }}
          >
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              A2 — Proven
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px" }}>
              Content Addressing
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              Payload identity becomes structural, shared, and deduplicated.
              Content-addressed reuse now measures 97.2% payload reduction.
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(16,185,129,0.18)",
              borderRadius: "14px",
              padding: "20px 18px",
              background: "rgba(16,185,129,0.03)",
            }}
          >
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Core — Proven
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px" }}>
              Structural Arbitration
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              Divergence is located and classified without quorum using
              cryptographic lineage, five-outcome arbitration, and Merkle
              positional narrowing.
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(16,185,129,0.18)",
              borderRadius: "14px",
              padding: "20px 18px",
              background: "rgba(16,185,129,0.03)",
            }}
          >
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              A5 — Proven
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px" }}>
              Composite Reconstruction
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              Verified fragments reconstruct deterministically, ambiguity is
              refused rather than guessed, and every reconstructed block carries
              source provenance.
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(16,185,129,0.18)",
              borderRadius: "14px",
              padding: "20px 18px",
              background: "rgba(16,185,129,0.03)",
            }}
          >
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              A6 — Proven
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "10px" }}>
              Multi-Controller Correctness
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              For committed data, independent controllers can derive correctness
              from substrate structure plus commit boundary without
              inter-controller coordination.
            </div>
          </div>
        </div>
      </section>

      {/* ─── EVIDENCE BASELINE ─── */}
      <section style={S.sectionCard}>
        <div style={S.label}>Evidence baseline</div>
        <h2 style={{ fontSize: "28px", lineHeight: 1.2, marginBottom: "16px", maxWidth: "940px" }}>
          112 / 112 PASS · 16 claims PROVEN
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {[
            ["Challenge Lab", "36 / 36 PASS"],
            ["A2 Content-Addressing", "35 / 35 PASS"],
            ["Merkle Tree", "7 / 7 PASS"],
            ["A5 Composite Reconstruction", "24 / 24 PASS"],
            ["A6 Multi-Controller", "10 / 10 PASS"],
            ["Claims PROVEN", "16"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "18px 18px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ fontSize: "12px", opacity: 0.58, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {label}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#6ee7b7" }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TABLE 1: SPC-1 ─── */}
      <section style={{ marginBottom: "52px" }}>
        <div style={S.label}>Table 1</div>
        <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
          SPC-1 Performance Benchmark
        </h2>
        <p style={{ maxWidth: "860px", opacity: 0.8, marginBottom: "20px", lineHeight: 1.7 }}>
          The Storage Performance Council SPC-1 benchmark measures sustained
          random I/O throughput and response time under load. These are the
          numbers the industry optimizes for.
        </p>
        <div style={S.tableWrap}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={S.th}>Vendor / System</th>
                <th style={{ ...S.th, textAlign: "right" }}>IOPS</th>
                <th style={{ ...S.th, textAlign: "right" }}>Avg Latency (ms)</th>
                <th style={{ ...S.th, textAlign: "right" }}>Year</th>
              </tr>
            </thead>
            <tbody>
              {spc1Data.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...S.td, fontWeight: 600 }}>{row.vendor}</td>
                  <td style={{ ...S.td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {formatIOPS(row.iops)}
                  </td>
                  <td style={{ ...S.td, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {row.latency.toFixed(3)}
                  </td>
                  <td style={{ ...S.td, textAlign: "right", opacity: 0.6 }}>{row.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: "12px", fontSize: "13px", opacity: 0.45 }}>
          Source: Storage Performance Council (storageperformance.org). Representative top-tier results.
        </p>
      </section>

      {/* ─── TABLE 2: ASA ─── */}
      <section style={{ marginBottom: "52px" }}>
        <div style={S.label}>Table 2 — Evidence Layer</div>
        <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
          Layered Correctness Evidence
        </h2>
        <p style={{ maxWidth: "920px", opacity: 0.8, marginBottom: "20px", lineHeight: 1.7 }}>
          No industry benchmark measures correctness arbitration speed or the
          broader layered correctness properties built on top of it. Results
          below now reflect a larger evidence base: challenge lab,
          content-addressing, Merkle positional encoding, composite
          reconstruction, and multi-controller correctness. What began as a
          missing metric has grown into a reproducible correctness architecture.
        </p>
        <div style={S.tableWrap}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={S.th}>Metric</th>
                <th style={S.th}>Measured Result</th>
                <th style={S.th}>Complexity</th>
                <th style={{ ...S.th, textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {asaData.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...S.td, fontWeight: 600 }}>{row.metric}</td>
                  <td style={{ ...S.td, fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "14px" }}>
                    {row.result}
                  </td>
                  <td style={{ ...S.td, fontSize: "14px", opacity: 0.8 }}>{row.complexity}</td>
                  <td style={{ ...S.td, textAlign: "center" }}>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: "12px", fontSize: "13px", opacity: 0.45 }}>
          Engine: dual_chain_engine.py. Evidence baseline now includes challenge lab,
          A2 content-addressing, Merkle positional encoding, A5 composite
          reconstruction, and A6 multi-controller correctness.
        </p>
      </section>

      {/* ─── A6 SECTION ─── */}
      <section style={S.sectionCard}>
        <div style={S.label}>A6 — Proven</div>
        <h2 style={{ fontSize: "28px", lineHeight: 1.2, marginBottom: "16px", maxWidth: "940px" }}>
          Multi-Controller Correctness is now proven
        </h2>
        <p style={{ fontSize: "17px", lineHeight: 1.75, maxWidth: "940px", opacity: 0.9, marginBottom: "18px" }}>
          Category 7 challenge lab confirms that correctness for committed data
          can be derived from substrate structure plus commit boundary without
          inter-controller coordination. Independent controllers reach identical
          conclusions, controller crashes do not become committed-data correctness
          events, divergent concurrent writes are detected rather than silently
          merged, cold-start controllers recover state from structure alone, and
          reconstruction provenance remains complete.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {[
            "Independent controllers reach identical conclusions",
            "Controller crash is not a committed-data correctness event",
            "Partial writes are classified structurally",
            "Divergent concurrent writes are detected, not silently merged",
            "Cold-start controllers recover state from structure alone",
            "Reconstruction provenance remains complete",
          ].map((item) => (
            <div
              key={item}
              style={{
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "14px",
                padding: "18px 18px",
                background: "rgba(16,185,129,0.04)",
                lineHeight: 1.65,
                fontSize: "15px",
                opacity: 0.88,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ─── QUADRANT CHART ─── */}
      <section style={{ marginBottom: "52px" }}>
        <div style={S.label}>Orthogonal positioning</div>
        <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
          Two Axes, One System
        </h2>
        <p style={{ maxWidth: "920px", opacity: 0.8, marginBottom: "24px", lineHeight: 1.7 }}>
          Storage vendors still compete on the X-axis: I/O throughput and latency.
          This architecture still operates on the Y-axis: structural correctness.
          But the Y-axis is now richer than arbitration speed alone. It includes
          authoritative divergence classification, deterministic reconstruction,
          explicit refusal under ambiguity, provenance tracking, and
          multi-controller correctness for committed data. The opportunity is not
          just fast and correct storage. It is storage whose correctness authority
          is structurally grounded.
        </p>
        <QuadrantChart />
      </section>

      {/* ─── ARCHITECTURAL CONSEQUENCE ─── */}
      <section style={S.sectionCard}>
        <div style={S.label}>Architectural consequence</div>
        <h2 style={{ fontSize: "28px", lineHeight: 1.2, marginBottom: "18px", maxWidth: "940px" }}>
          Why correctness is more than a benchmark axis
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: "14px",
              padding: "20px 18px",
              background: "rgba(59,130,246,0.04)",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "#93c5fd" }}>
              Performance axis (SPC-1)
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              How many I/O operations per second can a system sustain? How low
              is tail latency under load? These metrics assume the data path is
              correct. They measure throughput, not truth.
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "14px",
              padding: "20px 18px",
              background: "rgba(16,185,129,0.04)",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "#6ee7b7" }}>
              Correctness axis (ASA)
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              When replicas diverge, how quickly can the system classify
              authority, reconstruct committed truth, preserve provenance, and
              recover controller-independent state from structure alone?
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              padding: "20px 18px",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
              The shift
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              Traditional dual-active storage reduces controller availability risk,
              but correctness authority still tends to live in controller
              coordination logic. This architecture shifts that boundary
              downward into the substrate for committed data.
            </div>
          </div>
        </div>
      </section>

      {/* ─── VENDOR-FRIENDLY POSITIONING ─── */}
      <section style={{ marginBottom: "52px" }}>
        <div style={S.label}>Positioning</div>
        <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
          Vendor-Friendly: ASA Complements, Then Reshapes
        </h2>
        <p style={{ maxWidth: "920px", opacity: 0.85, marginBottom: "24px", lineHeight: 1.7 }}>
          ASA is not a storage product. It begins as a storage-internal primitive
          that can be integrated into existing architectures. But once
          reconstruction and multi-controller correctness are proven, the
          implication is larger: correctness authority can move downward into the
          substrate while existing controller and replication designs remain in place.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              padding: "22px 20px",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>
              For storage vendors
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              ASA can begin below the API layer, alongside existing integrity
              checks. But the longer-term implication is stronger: controllers
              increasingly become execution engines over structurally verifiable
              state rather than primary arbiters of committed-data truth.
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              padding: "22px 20px",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>
              For cloud providers
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              At exabyte scale, silent data corruption and replica divergence are
              statistical certainties. This work now supports not just faster
              correctness determination, but controller-independent recovery of
              committed state from substrate structure plus commit boundary.
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              padding: "22px 20px",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>
              For financial infrastructure
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              Ledger correctness is non-negotiable. ASA's dual-chain architecture
              now supports authoritative divergence classification, deterministic
              reconstruction, and provenance-preserving recovery with controller
              independence for committed records.
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLAIM BOUNDARY ─── */}
      <section style={S.sectionCard}>
        <div style={S.label}>Claim boundary</div>
        <h2 style={{ fontSize: "28px", lineHeight: 1.2, marginBottom: "14px", maxWidth: "920px" }}>
          What this does not claim
        </h2>
        <p style={{ fontSize: "17px", lineHeight: 1.75, maxWidth: "920px", opacity: 0.9, marginBottom: "18px" }}>
          The controller-level result is intentionally narrow. It applies to
          committed data only, and it does not claim that all coordination
          problems disappear.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          {[
            "Not a replacement for distributed consensus",
            "Not a claim about cache coherence",
            "Not a claim about in-flight write safety beyond commit boundary",
            "Not a claim about write ordering",
            "Not a performance benchmark against vendor systems",
            "Not a claim about geo-distributed correctness (yet)",
          ].map((item) => (
            <div
              key={item}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "18px 18px",
                background: "rgba(255,255,255,0.02)",
                lineHeight: 1.65,
                fontSize: "15px",
                opacity: 0.82,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ─── EVIDENCE LINK ─── */}
      <section style={{ marginBottom: "52px" }}>
        <div
          style={{
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "18px",
            padding: "28px 24px",
            background: "rgba(16,185,129,0.04)",
          }}
        >
          <div style={S.label}>Evidence</div>
          <h3 style={{ fontSize: "22px", marginBottom: "12px" }}>
            112 / 112 total checks pass
          </h3>
          <p style={{ fontSize: "16px", lineHeight: 1.7, opacity: 0.85, marginBottom: "18px", maxWidth: "920px" }}>
            Every PROVEN claim on this page is backed by reproducible evidence:
            challenge lab, content-addressing tests, Merkle validation,
            composite reconstruction, and multi-controller correctness. The engine,
            test harness, and evidence surfaces are open for architectural review.
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a
              href="/lab"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: "999px",
                border: "1px solid rgba(16,185,129,0.3)",
                background: "rgba(16,185,129,0.1)",
                color: "#6ee7b7",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Interactive WASM Lab →
            </a>
            <a
              href="/architecture"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.14)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              System Architecture →
            </a>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ marginTop: "60px", marginBottom: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "18px", opacity: 0.7, maxWidth: "760px", margin: "0 auto", lineHeight: 1.7 }}>
          If you work on storage correctness, controller architecture,
          replication, or data integrity at scale — I'd value your architectural
          read on this.
        </p>
        <div style={{ marginTop: "18px" }}>
          <a
            href="/contact"
            style={{
              display: "inline-block",
              padding: "14px 22px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.14)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Get in Touch →
          </a>
        </div>
      </section>
    </PageShell>
  );
}
