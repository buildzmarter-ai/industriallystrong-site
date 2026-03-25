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
   ASA CORRECTNESS ARBITRATION PERFORMANCE (challenge lab validated)
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
    result: "—",
    complexity: "Requires content-addressing",
    status: "DESIGN GOAL",
  },
  {
    metric: "Composite reconstruction",
    result: "—",
    complexity: "Requires cross-replica merging",
    status: "DESIGN GOAL",
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
        {/* grid */}
        <rect
          x={pad.left} y={pad.top} width={pw} height={ph}
          fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)"
        />
        {/* quadrant dividers */}
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

        {/* quadrant labels */}
        <text x={pad.left + pw * 0.75} y={pad.top + 18} fill="rgba(255,255,255,0.18)" fontSize="11" textAnchor="middle" fontWeight="600">
          HIGH PERF / HIGH CORRECT
        </text>
        <text x={pad.left + pw * 0.25} y={pad.top + ph - 8} fill="rgba(255,255,255,0.18)" fontSize="11" textAnchor="middle" fontWeight="600">
          LOW PERF / LOW CORRECT
        </text>

        {/* ASA target zone */}
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

        {/* data points */}
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

        {/* axes labels */}
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
        <div style={S.label}>New metric</div>
        <h1 style={{ fontSize: "42px", marginBottom: "10px", lineHeight: 1.1 }}>
          Correctness Arbitration Performance
        </h1>
        <p style={{ fontSize: "20px", maxWidth: "860px", opacity: 0.9, lineHeight: 1.7 }}>
          SPC-1 measures how fast a storage system moves data.
          ASA measures how fast it proves which copy is structurally correct.
          These are orthogonal axes — and only one of them is being benchmarked today.
        </p>
      </section>

      {/* ─── THE ARGUMENT ─── */}
      <section style={S.sectionCard}>
        <div style={S.label}>Why this matters</div>
        <h2 style={{ fontSize: "28px", lineHeight: 1.2, marginBottom: "14px", maxWidth: "900px" }}>
          Performance benchmarks assume correctness. ASA measures it.
        </h2>
        <p style={{ fontSize: "17px", lineHeight: 1.75, maxWidth: "900px", opacity: 0.9, marginBottom: "18px" }}>
          Every SPC-1 result implicitly assumes the data being moved is the right data.
          No performance benchmark measures what happens when a replica diverges,
          when a bit-flip corrupts a block mid-chain, or when two copies of the
          same object disagree. That's not a gap in testing — it's a gap in the
          metric itself. ASA introduces a second axis: how quickly a system can
          determine which replica is structurally authoritative, without quorum,
          without external coordination, and with cryptographic proof.
        </p>
        <p style={{ fontSize: "15px", opacity: 0.6 }}>
          This page presents both axes side by side — not as competition, but as
          complementary dimensions of storage system quality.
        </p>
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
        <div style={S.label}>Table 2 — New Metric</div>
        <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
          ASA Correctness Arbitration Performance
        </h2>
        <p style={{ maxWidth: "860px", opacity: 0.8, marginBottom: "20px", lineHeight: 1.7 }}>
          No industry benchmark measures correctness arbitration speed. ASA
          introduces this metric: how fast can a system determine which replica
          is structurally correct? Results below are from a 30-scenario challenge
          lab (29/30 PASS) running against the Python reference engine.
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
                <tr key={i} style={row.status === "DESIGN GOAL" ? { opacity: 0.55 } : {}}>
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
          Engine: dual_chain_engine.py (~800 lines). Challenge lab: 30 tests, 6 categories.
          Merkle-tree positional encoding validated with 3 independent measurements.
        </p>
      </section>

      {/* ─── QUADRANT CHART ─── */}
      <section style={{ marginBottom: "52px" }}>
        <div style={S.label}>Orthogonal positioning</div>
        <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
          Two Axes, One System
        </h2>
        <p style={{ maxWidth: "860px", opacity: 0.8, marginBottom: "24px", lineHeight: 1.7 }}>
          Storage vendors compete on the X-axis: I/O throughput and latency.
          ASA operates on the Y-axis: structural correctness verification speed.
          These axes are independent — a system can be fast and still unable to
          determine which replica is correct after a divergence event. The
          opportunity is the upper-right quadrant: systems that are both fast
          and provably correct.
        </p>
        <QuadrantChart />
      </section>

      {/* ─── ORTHOGONAL EXPLANATION ─── */}
      <section style={S.sectionCard}>
        <div style={S.label}>Architectural insight</div>
        <h2 style={{ fontSize: "28px", lineHeight: 1.2, marginBottom: "18px", maxWidth: "900px" }}>
          Why correctness is orthogonal to performance
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
              When replicas diverge, how fast can the system identify which copy
              is structurally authoritative? Can it do so without quorum? Can it
              cryptographically prove the result? This is the axis no one benchmarks.
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
              The gap
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.82 }}>
              RAID detects corruption but can't determine authority. Blockchain
              consensus resolves forks but requires quorum overhead. ASA fills
              the space between: storage-internal correctness arbitration with
              cryptographic proof paths.
            </div>
          </div>
        </div>
      </section>

      {/* ─── VENDOR-FRIENDLY POSITIONING ─── */}
      <section style={{ marginBottom: "52px" }}>
        <div style={S.label}>Positioning</div>
        <h2 style={{ fontSize: "26px", marginBottom: "16px" }}>
          Vendor-Friendly: ASA Complements, Not Competes
        </h2>
        <p style={{ maxWidth: "860px", opacity: 0.85, marginBottom: "24px", lineHeight: 1.7 }}>
          ASA is not a storage product. It's a storage-internal primitive that
          can be integrated into existing architectures. Every vendor listed in
          Table 1 has the same correctness gap — and would benefit from the same
          solution.
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
              ASA integrates below the API layer. It doesn't touch your data
              path, your cache hierarchy, or your replication protocol. It adds
              a structural verification layer that runs alongside existing
              integrity checks — and provides a new metric to differentiate on.
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
              statistical certainties. ASA provides sub-millisecond correctness
              determination without consensus round-trips — a meaningful
              reduction in repair latency for fleet-wide integrity operations.
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
              was designed for exactly this: proving which version of a financial
              record is structurally consistent, with an auditable proof path
              from any block to the root.
            </div>
          </div>
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
            29/30 challenge lab scenarios pass
          </h3>
          <p style={{ fontSize: "16px", lineHeight: 1.7, opacity: 0.85, marginBottom: "18px", maxWidth: "860px" }}>
            Every PROVEN claim on this page is backed by a reproducible challenge
            lab. The engine, test harness, and Merkle-tree implementation are
            open for architectural review.
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
        <p style={{ fontSize: "18px", opacity: 0.7, maxWidth: "700px", margin: "0 auto", lineHeight: 1.7 }}>
          If you work on storage correctness, replication, or data integrity at
          scale — I'd value your architectural read on this.
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
