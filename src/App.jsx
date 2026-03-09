import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

// ── DATA ──────────────────────────────────────────────────────────────────────
const monthlyData = [
  { m: "Jul", sales: 4.2, parts: 2.1, smelt: 1.8 },
  { m: "Aug", sales: 5.1, parts: 2.8, smelt: 2.2 },
  { m: "Sep", sales: 3.9, parts: 1.9, smelt: 1.5 },
  { m: "Oct", sales: 6.3, parts: 3.4, smelt: 2.9 },
  { m: "Nov", sales: 5.7, parts: 2.6, smelt: 2.1 },
  { m: "Dec", sales: 7.2, parts: 4.1, smelt: 3.3 },
  { m: "Jan", sales: 6.8, parts: 3.7, smelt: 2.8 },
];

const trendData = [
  { m: "Jul", value: 18.4 }, { m: "Aug", value: 22.1 },
  { m: "Sep", value: 19.7 }, { m: "Oct", value: 28.3 },
  { m: "Nov", value: 25.6 }, { m: "Dec", value: 31.2 },
  { m: "Jan", value: 29.8 },
];

const distributionData = [
  { name: "Sales",  value: 44, color: "#3B6FD4" },
  { name: "Parts",  value: 28, color: "#5B8AF0" },
  { name: "Smelt",  value: 18, color: "#A0B8F8" },
  { name: "Other",  value: 10, color: "#D0DCF9" },
];

const agingBuckets = [
  { label: "0–30 days",  value: 142, pct: 58, color: "#3B6FD4" },
  { label: "31–60 days", value: 63,  pct: 26, color: "#5B8AF0" },
  { label: "61–90 days", value: 28,  pct: 11, color: "#F59E0B" },
  { label: "90+ days",   value: 12,  pct: 5,  color: "#EF4444" },
];

const activityItems = [
  { id: "ORD-8821", label: "Steel coil — inbound",      value: "+$84,200", delta: "up",   time: "2h ago"    },
  { id: "ORD-8804", label: "Parts shipment — outbound", value: "−$31,500", delta: "down", time: "5h ago"    },
  { id: "ORD-8799", label: "Smelt batch #44",           value: "+$22,900", delta: "up",   time: "Yesterday" },
  { id: "ORD-8790", label: "Raw materials order",       value: "−$18,700", delta: "down", time: "Yesterday" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0F1C3F", border: "1px solid #1E3A6E",
      borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#CBD5E1"
    }}>
      <div style={{ fontWeight: 700, color: "#fff", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.fill, display: "inline-block" }} />
          <span style={{ color: "#94A3B8" }}>{p.name}</span>
          <span style={{ color: "#fff", marginLeft: "auto", fontWeight: 600 }}>${p.value}M</span>
        </div>
      ))}
    </div>
  );
};

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, delta, deltaLabel, accent, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80 * index);
    return () => clearTimeout(t);
  }, [index]);

  const isUp = delta > 0;
  return (
    <div style={{
      background: "linear-gradient(145deg, #0D1E45 0%, #0A1730 100%)",
      border: "1px solid #1E3560",
      borderRadius: 20,
      padding: "20px 18px",
      flex: "1 1 calc(50% - 8px)",
      minWidth: 140,
      boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, marginBottom: 14,
        background: `${accent}22`, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: accent }} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#F1F5FF", letterSpacing: "-0.5px", marginBottom: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: isUp ? "#16432820" : "#43161620",
        border: `1px solid ${isUp ? "#164328" : "#431616"}`,
        borderRadius: 20, padding: "3px 9px", fontSize: 11, fontWeight: 600,
        color: isUp ? "#4ADE80" : "#F87171"
      }}>
        <span>{isUp ? "↑" : "↓"}</span>
        <span>{Math.abs(delta)}% {deltaLabel}</span>
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.2px" }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{sub}</div>}
      </div>
      {action && (
        <button style={{
          background: "none", border: "1px solid #1E3560", borderRadius: 8,
          color: "#5B8AF0", fontSize: 11, fontWeight: 600, padding: "5px 11px", cursor: "pointer"
        }}>{action}</button>
      )}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "linear-gradient(160deg, #0D1E45 0%, #091529 100%)",
      border: "1px solid #1E3560",
      borderRadius: 20,
      padding: "20px 18px",
      boxShadow: "0 4px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
      ...style
    }}>
      {children}
    </div>
  );
}

function AgingRow({ item, index }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100 * index + 400);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{item.label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>
          {item.value} <span style={{ color: "#475569", fontWeight: 400 }}>orders</span>
        </span>
      </div>
      <div style={{ height: 6, background: "#0A1527", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", background: item.color, borderRadius: 99,
          width: animated ? `${item.pct}%` : "0%",
          transition: "width 0.7s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: `0 0 10px ${item.color}66`
        }} />
      </div>
    </div>
  );
}

function CustomLegend({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
      {data.map((d) => (
        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#94A3B8" }}>{d.name}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#E2E8F0", marginLeft: "auto" }}>{d.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "analytics", "activity"];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
      background: "#060F24",
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      padding: "0 0 100px",
      color: "#F1F5FF",
      position: "relative",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: -120, left: "50%", transform: "translateX(-50%)",
        width: 500, height: 300, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(59,111,212,0.18) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />

      {/* ── STATUS BAR ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", padding: "14px 22px 0",
        fontSize: 12, color: "#475569", position: "relative", zIndex: 1
      }}>
        <span style={{ fontWeight: 700 }}>9:41</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span>●●●</span><span>WiFi</span><span>⬛</span>
        </div>
      </div>

      {/* ── HEADER ── */}
      <div style={{
        padding: "18px 22px 20px", position: "relative", zIndex: 1,
        borderBottom: "1px solid #0D1F44"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 11, color: "#3B6FD4", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Executive Dashboard
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#F1F5FF" }}>
              Operations
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              border: "1px solid #1E3560", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "#0D1E45", color: "#5B8AF0", fontSize: 16
            }}>🔔</div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #3B6FD4, #5B8AF0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff",
              boxShadow: "0 2px 12px rgba(59,111,212,0.5)"
            }}>JD</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
          Jan 2025 · Fiscal Q2 · Last sync 4 min ago
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{
        display: "flex", gap: 4, padding: "14px 22px",
        position: "sticky", top: 0, background: "#060F24",
        zIndex: 10, borderBottom: "1px solid #0D1F44"
      }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "8px 0", borderRadius: 10,
            background: tab === t ? "linear-gradient(135deg, #1A3A7A, #1E4494)" : "transparent",
            color: tab === t ? "#A0C0FF" : "#475569",
            fontSize: 12, fontWeight: tab === t ? 700 : 500,
            cursor: "pointer", textTransform: "capitalize", letterSpacing: "0.01em",
            boxShadow: tab === t ? "0 2px 12px rgba(59,111,212,0.3)" : "none",
            transition: "all 0.2s ease",
            border: tab === t ? "1px solid #2A5CB8" : "1px solid transparent"
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "20px 16px", position: "relative", zIndex: 1 }}>

        {/* ── KPI CARDS ── */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#3B6FD4", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, paddingLeft: 2 }}>
            Key Metrics
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <KpiCard label="Total Sales"    value="$7.2M" delta={12.4}  deltaLabel="MoM" accent="#3B6FD4" index={0} />
            <KpiCard label="Parts Revenue"  value="$4.1M" delta={8.7}   deltaLabel="MoM" accent="#5B8AF0" index={1} />
            <KpiCard label="Smelt Output"   value="$3.3M" delta={-2.1}  deltaLabel="MoM" accent="#A0B8F8" index={2} />
            <KpiCard label="Total Volume"   value="$14.6M" delta={9.3}  deltaLabel="MoM" accent="#F59E0B" index={3} />
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #1E3560, transparent)", margin: "24px 0" }} />

        {/* ── BAR CHART ── */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader title="Monthly Revenue Breakdown" sub="Last 7 months · $M" action="Export" />
          <Card>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={monthlyData} barSize={14} barGap={4}>
                <XAxis dataKey="m" axisLine={false} tickLine={false}
                  tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }} />
                <YAxis hide />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="sales" name="Sales" fill="#3B6FD4" radius={[4,4,0,0]} />
                <Bar dataKey="parts" name="Parts" fill="#5B8AF0" radius={[4,4,0,0]} />
                <Bar dataKey="smelt" name="Smelt" fill="#A0B8F8" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 10, justifyContent: "center" }}>
              {[["#3B6FD4","Sales"],["#5B8AF0","Parts"],["#A0B8F8","Smelt"]].map(([c,l]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: 11, color: "#64748B" }}>{l}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── LINE CHART ── */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader title="Revenue Trend" sub="Cumulative monthly total · $M" />
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#F1F5FF", letterSpacing: "-0.5px" }}>$29.8M</div>
                <div style={{ fontSize: 11, color: "#4ADE80", fontWeight: 600, marginTop: 2 }}>↑ 9.3% from last month</div>
              </div>
              <div style={{
                background: "#16432820", border: "1px solid #164328", borderRadius: 10,
                padding: "6px 12px", fontSize: 11, color: "#4ADE80", fontWeight: 600,
                alignSelf: "flex-start"
              }}>On Track</div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={trendData}>
                <XAxis dataKey="m" axisLine={false} tickLine={false}
                  tick={{ fill: "#475569", fontSize: 10 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#0F1C3F", border: "1px solid #1E3A6E",
                    borderRadius: 10, fontSize: 12, color: "#fff"
                  }}
                  formatter={(v) => [`$${v}M`, "Revenue"]}
                />
                <Line
                  type="monotone" dataKey="value" stroke="#3B6FD4" strokeWidth={2.5}
                  dot={{ fill: "#3B6FD4", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#5B8AF0", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── DONUT ── */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader title="Revenue Distribution" sub="Current period share" />
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <PieChart width={140} height={140}>
                  <Pie
                    data={distributionData} cx={65} cy={65}
                    innerRadius={44} outerRadius={62}
                    dataKey="value" startAngle={90} endAngle={-270}
                    strokeWidth={0}
                  >
                    {distributionData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)", textAlign: "center"
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#F1F5FF", lineHeight: 1 }}>44%</div>
                  <div style={{ fontSize: 9, color: "#64748B", marginTop: 2 }}>Sales</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <CustomLegend data={distributionData} />
              </div>
            </div>
          </Card>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #1E3560, transparent)", margin: "4px 0 24px" }} />

        {/* ── AGING DATA ── */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader title="Aging Orders" sub="By days outstanding · 245 total" />
          <Card>
            {agingBuckets.map((item, i) => <AgingRow key={item.label} item={item} index={i} />)}
            <div style={{
              marginTop: 16, paddingTop: 14, borderTop: "1px solid #0D1F44",
              display: "flex", justifyContent: "space-between"
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#4ADE80" }}>84%</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Current</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#F1F5FF" }}>245</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Total Orders</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#EF4444" }}>12</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Critical</div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── INBOUND / OUTBOUND ── */}
        <div style={{ marginBottom: 20 }}>
          <SectionHeader title="Volume Overview" sub="Inbound vs Outbound this month" />
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { dir: "Inbound",  icon: "↓", value: "$9.4M", count: "136 orders", color: "#3B6FD4", bg: "#3B6FD415" },
              { dir: "Outbound", icon: "↑", value: "$5.2M", count: "89 orders",  color: "#5B8AF0", bg: "#5B8AF015" }
            ].map((d) => (
              <div key={d.dir} style={{
                flex: 1,
                background: `linear-gradient(145deg, ${d.bg}, #091529)`,
                border: `1px solid ${d.color}33`, borderRadius: 18, padding: "18px 16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, background: `${d.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: d.color, fontSize: 18, marginBottom: 12
                }}>{d.icon}</div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>{d.dir}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#F1F5FF", letterSpacing: "-0.5px" }}>{d.value}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{d.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTIVITY FEED ── */}
        <div>
          <SectionHeader title="Recent Activity" sub="Latest transactions" action="See all" />
          <Card style={{ padding: "16px 18px" }}>
            {activityItems.map((item, i) => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                paddingBottom: i < activityItems.length - 1 ? 14 : 0,
                marginBottom: i < activityItems.length - 1 ? 14 : 0,
                borderBottom: i < activityItems.length - 1 ? "1px solid #0D1F44" : "none"
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: item.delta === "up" ? "#16432820" : "#43161620",
                  border: `1px solid ${item.delta === "up" ? "#164328" : "#431616"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: item.delta === "up" ? "#4ADE80" : "#F87171"
                }}>
                  {item.delta === "up" ? "↑" : "↓"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{item.id} · {item.time}</div>
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                  color: item.delta === "up" ? "#4ADE80" : "#F87171"
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(6,15,36,0.92)", backdropFilter: "blur(20px)",
        borderTop: "1px solid #0D1F44", display: "flex",
        padding: "12px 0 20px", zIndex: 20
      }}>
        {[["📊","Dashboard"],["📈","Analytics"],["📋","Reports"],["⚙️","Settings"]].map(([icon, label], i) => (
          <button key={label} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{
              fontSize: 10, fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? "#5B8AF0" : "#475569"
            }}>{label}</span>
            {i === 0 && <div style={{ width: 4, height: 4, borderRadius: 2, background: "#3B6FD4" }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
