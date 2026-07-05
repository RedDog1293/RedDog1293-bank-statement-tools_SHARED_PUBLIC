import { useState, useMemo } from "react";

const SAMPLE_TRANSACTIONS = [
  { date: "2026-04-01", description: "COFFEE SHOP", amount: -5.25 },
  { date: "2026-04-02", description: "ELECTRIC UTILITY CO", amount: -164.10 },
  { date: "2026-04-03", description: "CLIENT DEPOSIT - ACME HOLDINGS", amount: 2750.00 },
  { date: "2026-04-04", description: "PHARMACY", amount: -37.62 },
  { date: "2026-04-05", description: "WIRELESS PROVIDER", amount: -74.00 },
  { date: "2026-04-06", description: "FOOD DELIVERY APP", amount: -28.90 },
  { date: "2026-04-07", description: "FUEL STATION", amount: -66.45 },
  { date: "2026-04-08", description: "COFFEE SHOP", amount: -6.10 },
  { date: "2026-04-09", description: "CLIENT DEPOSIT - NORTHWIND LLC", amount: 1325.00 },
  { date: "2026-04-10", description: "OFFICE SUPPLY STORE", amount: -48.75 },
  { date: "2026-04-11", description: "PHONE COMPANY", amount: -95.00 },
  { date: "2026-04-12", description: "WAREHOUSE CLUB", amount: -189.20 },
  { date: "2026-04-13", description: "ONLINE MARKETPLACE", amount: -72.40 },
  { date: "2026-04-14", description: "ENERGY REBATE PROGRAM", amount: 38.00 },
  { date: "2026-04-15", description: "FAST FOOD RESTAURANT", amount: -10.85 },
  { date: "2026-04-16", description: "CREDIT CARD PAYMENT", amount: -525.00 },
  { date: "2026-04-17", description: "LIQUOR STORE", amount: -32.15 },
  { date: "2026-04-18", description: "CLIENT DEPOSIT - BRIGHTON GROUP", amount: 690.00 },
  { date: "2026-04-19", description: "CLOUD SOFTWARE SUBSCRIPTION", amount: -12.99 },
  { date: "2026-04-20", description: "GAS STATION", amount: -58.30 },
  { date: "2026-04-21", description: "AUTO PARTS STORE", amount: -29.99 },
  { date: "2026-04-22", description: "OFFICE SOFTWARE SUBSCRIPTION", amount: -11.99 },
  { date: "2026-04-23", description: "GROCERY STORE", amount: -108.52 },
  { date: "2026-04-24", description: "MOVIE THEATER", amount: -24.00 },
  { date: "2026-04-25", description: "NSF FEE", amount: -40.00 },
];

const RULES = [
  { category: "Income",           color: "#3fb950", bg: "#1c3a24", keywords: ["DEPOSIT","REBATE","REFUND","CREDIT"] },
  { category: "Utilities",        color: "#58a6ff", bg: "#1c2d3f", keywords: ["ELECTRIC UTILITY","PHONE COMPANY","WIRELESS PROVIDER","CLOUD SOFTWARE"] },
  { category: "Food & Dining",    color: "#e3b341", bg: "#2d2208", keywords: ["COFFEE SHOP","FAST FOOD","FOOD DELIVERY","GROCERY STORE","WAREHOUSE CLUB","PHARMACY"] },
  { category: "Fuel & Auto",      color: "#bc8cff", bg: "#26193f", keywords: ["FUEL STATION","GAS STATION","AUTO PARTS"] },
  { category: "Software & Office",color: "#79c0ff", bg: "#1a2840", keywords: ["ONLINE MARKETPLACE","OFFICE SUPPLY","OFFICE SOFTWARE","CLOUD SOFTWARE"] },
  { category: "Entertainment",    color: "#f778ba", bg: "#3a1328", keywords: ["LIQUOR STORE","MOVIE THEATER"] },
  { category: "Bank Fees",        color: "#f85149", bg: "#3a1212", keywords: ["FEE","CHARGE","INTEREST"] },
  { category: "Payments",         color: "#8b949e", bg: "#1e2228", keywords: ["CREDIT CARD PAYMENT","PAYMENT"] },
];

function categorize(description) {
  const upper = description.toUpperCase();
  for (const rule of RULES) {
    if (rule.keywords.some(k => upper.includes(k))) return rule;
  }
  return { category: "Other", color: "#8b949e", bg: "#1e2228" };
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif !important; }
  .pill { transition: all 0.15s ease; cursor: pointer; }
  .pill:hover { opacity: 0.8; }
  .trow:hover { background: #1c2128 !important; }
`;

export default function App() {
  const [active, setActive] = useState(null);

  const tagged = useMemo(() =>
    SAMPLE_TRANSACTIONS.map(t => ({ ...t, ...categorize(t.description) })), []);

  const summary = useMemo(() => {
    const map = {};
    for (const t of tagged) {
      if (!map[t.category]) map[t.category] = { total: 0, count: 0, color: t.color, bg: t.bg };
      map[t.category].total += t.amount;
      map[t.category].count++;
    }
    return Object.entries(map).sort((a, b) => a[1].total - b[1].total);
  }, [tagged]);

  const filtered = active ? tagged.filter(t => t.category === active) : tagged;
  const totalIn  = tagged.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = tagged.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const net = totalIn + totalOut;

  return (
    <div style={{ minHeight:"100vh", background:"#0d1117", color:"#e6edf3", fontFamily:"'Inter',sans-serif", padding:"32px 20px" }}>
      <style>{styles}</style>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:3, textTransform:"uppercase", color:"#58a6ff", marginBottom:8 }}>
          Automation Example
        </div>
        <h1 style={{ fontSize:26, fontWeight:700, color:"#ffffff", margin:0, marginBottom:6, letterSpacing:-0.5 }}>
          Bank Statement Categorizer
        </h1>
        <p style={{ fontSize:13, color:"#8b949e", margin:0 }}>
          Sample data (fictional) · Claude reads your CSV, assigns categories, and surfaces totals automatically.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
        {[
          { label:"Total In",  value:`+$${totalIn.toFixed(2)}`,                           color:"#3fb950" },
          { label:"Total Out", value:`-$${Math.abs(totalOut).toFixed(2)}`,                color:"#f85149" },
          { label:"Net",       value:`${net>=0?"+":""}$${net.toFixed(2)}`,                color: net>=0?"#3fb950":"#f85149" },
        ].map(s => (
          <div key={s.label} style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"#8b949e", marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Pills */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        {[{ category:"All", color:"#e6edf3", bg: active===null?"#21262d":"transparent" }, ...summary.map(([cat,d])=>({category:cat,color:d.color,bg:d.bg,active:active===cat}))].map((item) => (
          <div
            key={item.category}
            className="pill"
            onClick={() => setActive(item.category==="All" ? null : (active===item.category ? null : item.category))}
            style={{
              padding:"5px 13px", borderRadius:20, fontSize:12, fontWeight:500,
              background: item.category==="All" ? (active===null?"#21262d":"#161b22") : (active===item.category ? item.bg : "#161b22"),
              border: `1px solid ${item.category==="All" ? (active===null?"#58a6ff":"#21262d") : (active===item.category ? item.color : "#21262d")}`,
              color: item.category==="All" ? (active===null?"#ffffff":"#8b949e") : (active===item.category ? item.color : "#8b949e"),
            }}
          >
            {item.category}
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:12, overflow:"hidden", marginBottom:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"90px 1fr 130px 110px", padding:"10px 16px", borderBottom:"1px solid #21262d" }}>
          {["Date","Description","Category","Amount"].map(h => (
            <div key={h} style={{ fontSize:10, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"#8b949e", textAlign: h==="Amount"?"right":"left" }}>{h}</div>
          ))}
        </div>
        {filtered.map((t, i) => (
          <div key={i} className="trow" style={{
            display:"grid", gridTemplateColumns:"90px 1fr 130px 110px",
            padding:"11px 16px",
            borderBottom: i < filtered.length-1 ? "1px solid #21262d" : "none",
            alignItems:"center",
            background: i%2===0 ? "#161b22" : "#0d1117",
            transition:"background 0.1s",
          }}>
            <span style={{ fontSize:13, color:"#8b949e" }}>{t.date.slice(5)}</span>
            <span style={{ fontSize:13, color:"#c9d1d9", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:12 }}>{t.description}</span>
            <span style={{
              display:"inline-flex", alignItems:"center",
              padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:500,
              background:t.bg, color:t.color, width:"fit-content"
            }}>{t.category}</span>
            <span style={{ fontSize:13, fontWeight:600, textAlign:"right", color: t.amount>0?"#3fb950":"#f85149" }}>
              {t.amount>0?"+":""}${Math.abs(t.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:12, padding:"18px 20px" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"#8b949e", marginBottom:14 }}>
          Spending by Category
        </div>
        {summary.map(([cat, data]) => (
          <div key={cat} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:data.color, flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#c9d1d9" }}>{cat}</span>
              <span style={{ fontSize:11, color:"#484f58" }}>{data.count} transactions</span>
            </div>
            <span style={{ fontSize:13, fontWeight:600, color: data.total>0?"#3fb950":"#f85149" }}>
              {data.total>0?"+":""}${data.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop:16, padding:"12px 16px", background:"#161b22", border:"1px solid #1f6feb", borderRadius:8, fontSize:12, color:"#58a6ff", lineHeight:1.7 }}>
        In real use: Claude reads your exported bank CSV → applies your custom category rules → delivers this view plus a clean Excel summary. Save the script to GitHub and run it every month in seconds.
      </div>
    </div>
  );
}
