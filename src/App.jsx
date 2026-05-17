import { useState, useEffect, useCallback } from "react";

const DEFAULTS = {
  age: 30,
  retirementAge: 60,
  monthlyIncome: 5000,
  housing: 1200,
  car: 600,
  food: 800,
  utilities: 200,
  transport: 300,
  kids: 400,
  others: 300,
  savings: 20000,
  epf: 40000,
  asb: 10000,
  investments: 5000,
  othersAssets: 0,
  houseLoan: 150000,
  carLoan: 30000,
  otherLiabilities: 5000,
};

const formatRM = (val) =>
  "RM " + Math.round(val).toLocaleString("en-MY");

const SCREENS = ["landing", "quick-input", "quick-result", "detail", "dashboard", "compare"];

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [scenario, setScenario] = useState("single");
  const [inflation, setInflation] = useState(false);
  const [form, setForm] = useState(DEFAULTS);
  const [animKey, setAnimKey] = useState(0);

  const go = (s) => {
    setAnimKey((k) => k + 1);
    setScreen(s);
  };

  const years = Math.max(1, form.retirementAge - form.age);
  const monthlyExpense =
    form.housing + form.car + form.food + form.utilities +
    form.transport + form.kids + form.others;
  const annualExpense = monthlyExpense * 12;
  const inflationFactor = inflation
    ? ((Math.pow(1.03, years) - 1) / 0.03)
    : years;
  const requiredFund = annualExpense * inflationFactor;
  const totalAssets = form.savings + form.epf + form.asb + form.investments +form.othersAssets;
  const totalLiabilities = form.houseLoan + form.carLoan + form.otherLiabilities;
  const netPosition = totalAssets - totalLiabilities;
  const gap = requiredFund - netPosition;
  const monthlySavingNeeded = gap > 0 ? gap / years / 12 : 0;
  const emergencyMonths = monthlyExpense > 0 ? totalAssets / monthlyExpense : 0;
  const progress = Math.min(100, Math.max(0, (netPosition / requiredFund) * 100));

  const gapColor =
    gap <= 0 ? "#16A34A" : gap < requiredFund * 0.3 ? "#F59E0B" : "#DC2626";
  const gapLabel = gap <= 0 ? "Covered ✓" : gap < requiredFund * 0.3 ? "Moderate" : "Needs Attention";

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const styles = {
    app: {
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#F0F4FF",
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      overflowX: "hidden",
    },
    screen: {
      animation: "fadeUp 0.35s ease forwards",
      padding: "0 0 80px 0",
    },
    header: {
      background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)",
      padding: "48px 24px 32px",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    },
    headerAccent: {
      position: "absolute", top: -40, right: -40,
      width: 140, height: 140,
      background: "rgba(255,255,255,0.07)",
      borderRadius: "50%",
    },
    headerAccent2: {
      position: "absolute", bottom: -20, left: -20,
      width: 80, height: 80,
      background: "rgba(255,255,255,0.05)",
      borderRadius: "50%",
    },
    tag: {
      display: "inline-block",
      background: "rgba(255,255,255,0.15)",
      color: "#fff",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      padding: "4px 10px",
      borderRadius: 20,
      marginBottom: 12,
    },
    h1: { fontSize: 28, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.2 },
    subtitle: { fontSize: 14, opacity: 0.85, margin: 0, lineHeight: 1.5 },
    body: { padding: "20px 16px" },
    card: {
      background: "#fff",
      borderRadius: 16,
      padding: "18px 16px",
      marginBottom: 14,
      boxShadow: "0 2px 12px rgba(37,99,235,0.07)",
    },
    cardTitle: {
      fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
      textTransform: "uppercase", color: "#6B7280", marginBottom: 14,
    },
    btn: {
      display: "block", width: "100%",
      background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
      color: "#fff", border: "none",
      borderRadius: 14, padding: "16px",
      fontSize: 16, fontWeight: 700,
      cursor: "pointer", textAlign: "center",
      boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
      transition: "transform 0.15s, box-shadow 0.15s",
    },
    btnSec: {
      display: "block", width: "100%",
      background: "#fff",
      color: "#2563EB", border: "2px solid #2563EB",
      borderRadius: 14, padding: "14px",
      fontSize: 15, fontWeight: 700,
      cursor: "pointer", textAlign: "center",
    },
    kpiRow: { display: "flex", gap: 10, marginBottom: 14 },
    kpi: {
      flex: 1, background: "#fff",
      borderRadius: 14, padding: "14px 10px",
      textAlign: "center",
      boxShadow: "0 2px 10px rgba(37,99,235,0.07)",
    },
    kpiLabel: { fontSize: 10, color: "#6B7280", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 },
    kpiVal: { fontSize: 17, fontWeight: 800, color: "#111827" },
    sliderWrap: { marginBottom: 20 },
    sliderLabel: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
    sliderLabelText: { fontSize: 13, fontWeight: 600, color: "#374151" },
    sliderLabelVal: { fontSize: 14, fontWeight: 800, color: "#2563EB" },
    slider: { width: "100%", accentColor: "#2563EB" },
    inputRow: {
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #F3F4F6",
      padding: "10px 0",
    },
    inputLabel: { fontSize: 13, color: "#374151", fontWeight: 500 },
    inputField: {
      border: "1px solid #E5E7EB", borderRadius: 8,
      padding: "6px 10px", width: 110,
      fontSize: 14, fontWeight: 600, color: "#111827",
      textAlign: "right", outline: "none",
    },
    progressWrap: { background: "#E5E7EB", borderRadius: 99, height: 12, overflow: "hidden", marginBottom: 6 },
    progressBar: {
      height: "100%", borderRadius: 99,
      background: "linear-gradient(90deg, #2563EB, #16A34A)",
      transition: "width 0.8s ease",
    },
    toggle: {
      display: "flex", background: "#F3F4F6",
      borderRadius: 10, padding: 3, gap: 2,
    },
    toggleOpt: (active) => ({
      flex: 1, padding: "7px 0", borderRadius: 8,
      fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
      background: active ? "#2563EB" : "transparent",
      color: active ? "#fff" : "#6B7280",
      transition: "all 0.2s",
    }),
    stickyBottom: {
      position: "fixed", bottom: 0, left: "50%",
      transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: "#fff",
      borderTop: "1px solid #E5E7EB",
      padding: "12px 16px",
      zIndex: 100,
      boxShadow: "0 -4px 20px rgba(37,99,235,0.08)",
    },
    stickyInner: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    stickyLabel: { fontSize: 11, color: "#6B7280", fontWeight: 600 },
    stickyVal: { fontSize: 16, fontWeight: 800 },
    section: { marginBottom: 6 },
    sectionHead: {
      fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
      textTransform: "uppercase", color: "#9CA3AF",
      padding: "12px 0 4px",
    },
  };

  const InputRow = ({ label, fieldKey }) => (
    <div style={styles.inputRow}>
      <span style={styles.inputLabel}>{label}</span>
      <input
        type="number"
        style={styles.inputField}
        value={form[fieldKey]}
        onChange={(e) => update(fieldKey, Number(e.target.value) || 0)}
      />
    </div>
  );

  const SliderInput = ({ label, fieldKey, min, max, unit = "" }) => (
    <div style={styles.sliderWrap}>
      <div style={styles.sliderLabel}>
        <span style={styles.sliderLabelText}>{label}</span>
        <span style={styles.sliderLabelVal}>{form[fieldKey]}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max}
        value={form[fieldKey]}
        onChange={(e) => update(fieldKey, Number(e.target.value))}
        style={styles.slider}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );

  // ── SCREEN: LANDING ──────────────────────────────────────────
  if (screen === "landing") return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        input[type=range] { height: 4px; }
        button:active { transform: scale(0.97); }
      `}</style>
      <div style={{ ...styles.header, minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={styles.headerAccent} />
        <div style={styles.headerAccent2} />
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧮</div>
        <div style={styles.tag}>Takaful Planner</div>
        <h1 style={{ ...styles.h1, fontSize: 32, marginBottom: 10 }}>Are you financially<br />ready?</h1>
        <p style={styles.subtitle}>Check how prepared you are for retirement in under 30 seconds. No sales pitch.</p>
      </div>
      <div style={{ ...styles.body, paddingTop: 28 }}>
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)", border: "1px solid #BFDBFE" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24 }}>🇲🇾</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1D4ED8", marginBottom: 4 }}>Built for Malaysians</div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>Pre-filled with average Malaysian expenses. EPF, ASB & Tabung Haji included.</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[["⚡", "Instant"], ["🔒", "Private"], ["📊", "Accurate"]].map(([icon, label]) => (
            <div key={label} style={{ flex: 1, ...styles.kpi }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280" }}>{label}</div>
            </div>
          ))}
        </div>
        <button style={styles.btn} onClick={() => go("quick-input")}>
          Start — it's free →
        </button>
      </div>
    </div>
  );

  // ── SCREEN: QUICK INPUT ──────────────────────────────────────
  if (screen === "quick-input") return (
    <div style={styles.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); @keyframes fadeUp { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} *{box-sizing:border-box} input[type=range]{height:4px} button:active{transform:scale(0.97)}`}</style>
      <div style={{ ...styles.screen }} key={animKey}>
        <div style={{ ...styles.header, padding: "32px 24px 24px" }}>
          <button onClick={() => go("landing")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>← Back</button>
          <div style={styles.tag}>Step 1 of 2</div>
          <h1 style={{ ...styles.h1, fontSize: 22 }}>Quick check</h1>
          <p style={styles.subtitle}>Just your age and we'll estimate the rest</p>
        </div>
        <div style={styles.body}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>About You</div>
            <SliderInput label="Current Age" fieldKey="age" min={18} max={70} unit=" yrs" />
            <SliderInput label="Retirement Age" fieldKey="retirementAge" min={40} max={80} unit=" yrs" />
            {form.retirementAge <= form.age && (
              <div style={{ background: "#FEF2F2", color: "#DC2626", borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 600, marginTop: -10, marginBottom: 10 }}>
                ⚠ Retirement age must be greater than current age
              </div>
            )}
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px", marginTop: 4 }}>
              <div style={{ fontSize: 12, color: "#1D4ED8", fontWeight: 600, marginBottom: 2 }}>Planning horizon</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1D4ED8" }}>{years} years</div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Scenario</div>
            <div style={styles.toggle}>
              {["single", "married", "kids"].map((s) => (
                <button key={s} style={styles.toggleOpt(scenario === s)} onClick={() => setScenario(s)}>
                  {s === "single" ? "Single" : s === "married" ? "Married" : "With Kids"}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={styles.cardTitle}>Inflation</div>
              <div style={styles.toggle}>
                <button style={styles.toggleOpt(!inflation)} onClick={() => setInflation(false)}>Off</button>
                <button style={styles.toggleOpt(inflation)} onClick={() => setInflation(true)}>3%</button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>
              {inflation ? "Accounts for cost of living increase over time" : "Using today's ringgit value"}
            </div>
          </div>

          <button style={styles.btn} onClick={() => go("quick-result")} disabled={form.retirementAge <= form.age}>
            See my result →
          </button>
        </div>
      </div>
    </div>
  );

  // ── SCREEN: QUICK RESULT ────────────────────────────────────
  if (screen === "quick-result") return (
    <div style={styles.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} *{box-sizing:border-box} button:active{transform:scale(0.97)}`}</style>
      <div style={styles.screen} key={animKey}>
        <div style={{ ...styles.header, padding: "32px 24px 24px" }}>
          <button onClick={() => go("quick-input")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>← Back</button>
          <div style={styles.tag}>Quick Result</div>
          <h1 style={{ ...styles.h1, fontSize: 22 }}>Here's your snapshot</h1>
          <p style={styles.subtitle}>Based on average Malaysian expenses • {years} year horizon</p>
        </div>
        <div style={styles.body}>
          <div style={styles.kpiRow}>
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>Fund Needed</div>
              <div style={{ ...styles.kpiVal, fontSize: 14 }}>{formatRM(requiredFund)}</div>
            </div>
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>Current Est.</div>
              <div style={{ ...styles.kpiVal, fontSize: 14 }}>{formatRM(netPosition)}</div>
            </div>
          </div>

          <div style={{ ...styles.card, border: `2px solid ${gapColor}`, background: gap <= 0 ? "#F0FDF4" : gap < requiredFund * 0.3 ? "#FFFBEB" : "#FEF2F2" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: gapColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              {gapLabel}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: gapColor, marginBottom: 4 }}>
              {gap <= 0 ? "You're on track!" : formatRM(gap)}
            </div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              {gap <= 0
                ? "Your current savings may cover retirement needs."
                : `You may need to prepare approximately ${formatRM(gap)} more for retirement.`}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Readiness</div>
            <div style={styles.progressWrap}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B7280", marginTop: 4 }}>
              <span>{Math.round(progress)}% ready</span>
              <span>Target: 100%</span>
            </div>
          </div>

          <div style={{ ...styles.card, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <div style={{ fontSize: 13, color: "#1D4ED8", lineHeight: 1.6 }}>
              💡 <b>This is a rough estimate.</b> Add your actual expenses and assets for a personalised plan.
            </div>
          </div>

          <button style={styles.btn} onClick={() => go("detail")}>
            Make it more accurate →
          </button>
          <div style={{ height: 10 }} />
          <button style={styles.btnSec} onClick={() => go("dashboard")}>
            Skip to full dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // ── SCREEN: DETAIL INPUT ─────────────────────────────────────
  if (screen === "detail") return (
    <div style={styles.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} *{box-sizing:border-box} input{font-family:inherit} button:active{transform:scale(0.97)}`}</style>
      <div style={styles.screen} key={animKey}>
        <div style={{ ...styles.header, padding: "32px 24px 24px" }}>
          <button onClick={() => go("quick-result")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>← Back</button>
          <div style={styles.tag}>Step 2 of 2</div>
          <h1 style={{ ...styles.h1, fontSize: 22 }}>Your actual numbers</h1>
          <p style={styles.subtitle}>Edit to match your real situation</p>
        </div>

        <div style={styles.body}>
          {/* Expenses */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Monthly Expenses (RM)</div>
            {[["Housing / Rent", "housing"], ["Car", "car"], ["Food", "food"], ["Utilities", "utilities"], ["Transport", "transport"], ["Kids", "kids"], ["Others", "others"]].map(([l, k]) => (
              <InputRow key={k} label={l} fieldKey={k} />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTop: "2px solid #E5E7EB" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Total / month</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#2563EB" }}>{formatRM(monthlyExpense)}</span>
            </div>
          </div>

          {/* Assets */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Assets (RM)</div>
            {[["Savings / Cash", "savings"], ["EPF", "epf"], ["ASB / Tabung Haji", "asb"], ["Investments", "investments"], ["Others", "othersAssets"]].map(([l, k]) => (
              <InputRow key={k} label={l} fieldKey={k} />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTop: "2px solid #E5E7EB" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Total Assets</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#16A34A" }}>{formatRM(totalAssets)}</span>
            </div>
          </div>

          {/* Liabilities */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Liabilities (RM)</div>
            {[["House Loan", "houseLoan"], ["Car Loan", "carLoan"], ["Others", "otherLiabilities"]].map(([l, k]) => (
              <InputRow key={k} label={l} fieldKey={k} />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4, borderTop: "2px solid #E5E7EB" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Total Liabilities</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#DC2626" }}>{formatRM(totalLiabilities)}</span>
            </div>
          </div>

          <button style={styles.btn} onClick={() => go("dashboard")}>
            View full dashboard →
          </button>
        </div>

        {/* Sticky */}
        <div style={styles.stickyBottom}>
          <div style={styles.stickyInner}>
            <div>
              <div style={styles.stickyLabel}>Gap</div>
              <div style={{ ...styles.stickyVal, color: gapColor }}>{gap <= 0 ? "Covered ✓" : formatRM(gap)}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={styles.stickyLabel}>Monthly Needed</div>
              <div style={styles.stickyVal}>{formatRM(monthlySavingNeeded)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={styles.stickyLabel}>Readiness</div>
              <div style={{ ...styles.stickyVal, color: "#2563EB" }}>{Math.round(progress)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── SCREEN: DASHBOARD ────────────────────────────────────────
  if (screen === "dashboard") return (
    <div style={styles.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} *{box-sizing:border-box} button:active{transform:scale(0.97)}`}</style>
      <div style={styles.screen} key={animKey}>
        <div style={{ ...styles.header, padding: "32px 24px 24px" }}>
          <button onClick={() => go("detail")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>← Back</button>
          <div style={styles.tag}>Your Dashboard</div>
          <h1 style={{ ...styles.h1, fontSize: 22 }}>Retirement Readiness</h1>
          <p style={styles.subtitle}>Plan horizon: {years} years · Retirement at {form.retirementAge}</p>
        </div>

        <div style={styles.body}>
          {/* Progress */}
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={styles.cardTitle}>Overall Readiness</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: gapColor }}>{Math.round(progress)}%</div>
            </div>
            <div style={styles.progressWrap}>
              <div style={{ ...styles.progressBar, width: `${progress}%`, background: `linear-gradient(90deg, #2563EB, ${gapColor})` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {/* KPIs */}
          <div style={styles.kpiRow}>
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>Monthly Exp</div>
              <div style={{ ...styles.kpiVal, fontSize: 14 }}>{formatRM(monthlyExpense)}</div>
            </div>
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>Fund Needed</div>
              <div style={{ ...styles.kpiVal, fontSize: 14 }}>{formatRM(requiredFund)}</div>
            </div>
          </div>
          <div style={styles.kpiRow}>
            <div style={styles.kpi}>
              <div style={styles.kpiLabel}>Net Position</div>
              <div style={{ ...styles.kpiVal, fontSize: 14, color: netPosition >= 0 ? "#16A34A" : "#DC2626" }}>{formatRM(netPosition)}</div>
            </div>
            <div style={{ ...styles.kpi, background: gap <= 0 ? "#F0FDF4" : "#FEF2F2" }}>
              <div style={styles.kpiLabel}>Gap</div>
              <div style={{ ...styles.kpiVal, fontSize: 14, color: gapColor }}>{gap <= 0 ? "✓ Covered" : formatRM(gap)}</div>
            </div>
          </div>

          {/* Emergency fund */}
          <div style={{ ...styles.card, background: emergencyMonths >= 6 ? "#F0FDF4" : emergencyMonths >= 3 ? "#FFFBEB" : "#FEF2F2", border: `1px solid ${emergencyMonths >= 6 ? "#BBF7D0" : emergencyMonths >= 3 ? "#FDE68A" : "#FECACA"}` }}>
            <div style={styles.cardTitle}>Emergency Fund</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: emergencyMonths >= 6 ? "#16A34A" : emergencyMonths >= 3 ? "#D97706" : "#DC2626", marginBottom: 4 }}>
              {emergencyMonths.toFixed(1)} months
            </div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              {emergencyMonths >= 6
                ? "Great! You have solid emergency coverage."
                : emergencyMonths >= 3
                ? "Consider building up to 6 months of expenses."
                : "You may need to build your emergency fund first."}
            </div>
          </div>

          {/* Monthly saving needed */}
          {gap > 0 && (
            <div style={{ ...styles.card, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <div style={styles.cardTitle}>To close the gap</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1D4ED8", marginBottom: 4 }}>
                {formatRM(monthlySavingNeeded)} / month
              </div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                This is how much you may need to set aside monthly over {years} years to close the gap.
              </div>
            </div>
          )}

          {/* Assets breakdown */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Assets Breakdown</div>
            {[["Savings", form.savings], ["EPF", form.epf], ["ASB/TH", form.asb], ["Investments", form.investments], ["Others", form.othersAssets]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{formatRM(val)}</span>
                </div>
                <div style={{ background: "#E5E7EB", borderRadius: 99, height: 5, overflow: "hidden" }}>
                  <div style={{ width: `${totalAssets > 0 ? (val / totalAssets) * 100 : 0}%`, height: "100%", background: "#2563EB", borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>

          <button style={styles.btn} onClick={() => go("compare")}>
            See your options →
          </button>
          <div style={{ height: 10 }} />
          <button style={styles.btnSec} onClick={() => go("quick-input")}>
            ✏ Edit inputs
          </button>
        </div>
      </div>
    </div>
  );

  // ── SCREEN: COMPARE ──────────────────────────────────────────
  if (screen === "compare") return (
    <div style={styles.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} *{box-sizing:border-box} button:active{transform:scale(0.97)}`}</style>
      <div style={styles.screen} key={animKey}>
        <div style={{ ...styles.header, padding: "32px 24px 24px" }}>
          <button onClick={() => go("dashboard")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>← Back</button>
          <div style={styles.tag}>Your Options</div>
          <h1 style={{ ...styles.h1, fontSize: 22 }}>How to close the gap</h1>
          <p style={styles.subtitle}>You may need to prepare {gap > 0 ? formatRM(gap) : "0"} more</p>
        </div>

        <div style={styles.body}>
          {gap <= 0 ? (
            <div style={{ ...styles.card, background: "#F0FDF4", border: "2px solid #16A34A", textAlign: "center", padding: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#16A34A", marginBottom: 6 }}>You're on track!</div>
              <div style={{ fontSize: 14, color: "#374151" }}>Your current assets may cover your retirement needs. Keep maintaining your savings discipline.</div>
            </div>
          ) : (
            <>
              {/* Option A */}
              <div style={{ ...styles.card, border: "2px solid #E5E7EB" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Option A</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Self Savings</div>
                  </div>
                  <span style={{ fontSize: 28 }}>🏦</span>
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 2 }}>Monthly required</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>{formatRM(monthlySavingNeeded)}</div>
                </div>
                {[
                  ["Full control over money", true],
                  ["Requires strong discipline", false],
                  ["No protection if income stops", false],
                  ["Returns depend on market", false],
                ].map(([text, good]) => (
                  <div key={text} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ color: good ? "#16A34A" : "#DC2626", fontSize: 14, marginTop: 1 }}>{good ? "✓" : "✗"}</span>
                    <span style={{ fontSize: 13, color: "#374151" }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Option B */}
              <div style={{ ...styles.card, border: "2px solid #2563EB", background: "linear-gradient(135deg, #EFF6FF, #fff)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Option B</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Takaful Plan</div>
                  </div>
                  <span style={{ fontSize: 28 }}>🌿</span>
                </div>
                <div style={{ background: "#DBEAFE", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 600, marginBottom: 2 }}>From as low as</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#1D4ED8" }}>RM 200 / month</div>
                </div>
                {[
                  ["Structured — easier to stay consistent", true],
                  ["Protection if income stops due to illness", true],
                  ["Shariah-compliant savings", true],
                  ["May not cover full gap alone", false],
                ].map(([text, good]) => (
                  <div key={text} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ color: good ? "#16A34A" : "#F59E0B", fontSize: 14, marginTop: 1 }}>{good ? "✓" : "!"}</span>
                    <span style={{ fontSize: 13, color: "#374151" }}>{text}</span>
                  </div>
                ))}
              </div>

              <div style={{ ...styles.card, background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                  💡 <b>Consider this:</b> Self-savings and takaful can complement each other. Many Malaysians use both — takaful for protection, self-savings for flexibility.
                </div>
              </div>
            </>
          )}

          <button style={styles.btn} onClick={() => {
            const msg = `Retirement planning summary:\n\nFund needed: ${formatRM(requiredFund)}\nNet position: ${formatRM(netPosition)}\nGap: ${gap > 0 ? formatRM(gap) : "Covered ✓"}\nReadiness: ${Math.round(progress)}%\n\nCalculated via Takaful Planner`;
            const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
            window.open(url, "_blank");
          }}>
            📱 Share via WhatsApp
          </button>
          <div style={{ height: 10 }} />
          <button style={styles.btnSec} onClick={() => go("quick-input")}>
            🔄 Recalculate
          </button>
          <div style={{ height: 10 }} />
          <div style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", lineHeight: 1.6, padding: "0 16px" }}>
            This calculator is for planning purposes only. Numbers are estimates and should not be taken as financial advice. Consider speaking to a qualified financial planner.
          </div>
        </div>
      </div>
    </div>
  );

  return null;
}