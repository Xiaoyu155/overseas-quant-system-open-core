const dataRoot = document.documentElement.dataset.dataRoot || "./data_public";
const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const DATA_FETCH_TIMEOUT_MS = 5000;
let activeNavSeries = [];

async function fetchPublicJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DATA_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`Public data request failed: ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function drawNavChart(series) {
  const canvas = document.getElementById("nav-chart");
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  const width = rect.width;
  const height = rect.height;
  const pad = { top: 14, right: 10, bottom: 24, left: 12 };
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#e4ebe7";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = pad.top + (height - pad.top - pad.bottom) * i / 3;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
  }
  if (!series || series.length < 2) return;

  const values = series.map((point) => Number(point.unit_nav)).filter(Number.isFinite);
  if (values.length < 2) return;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, Math.abs(max) * 0.002, 0.0001);
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  ctx.strokeStyle = "#18745f";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = pad.left + plotWidth * index / (values.length - 1);
    const y = pad.top + (max - value) / span * plotHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

async function loadUnitNav() {
  const status = document.getElementById("nav-status");
  try {
    const data = await fetchPublicJson(`${dataRoot}/unit_nav_history.json`);
    const series = Array.isArray(data.series) ? data.series : [];
    if (data.status !== "verified" || series.length < 2) {
      activeNavSeries = [];
      drawNavChart([]);
      return;
    }
    const latest = Number(series[series.length - 1].unit_nav);
    if (!Number.isFinite(latest)) throw new Error("Invalid public series");
    document.getElementById("nav-latest").textContent = latest.toFixed(4);
    document.getElementById("nav-empty").hidden = true;
    document.getElementById("nav-chart").setAttribute("aria-label", "已发布的 Unit-NAV 历史曲线");
    status.textContent = "已发布核验序列";
    status.classList.add("status-live");
    activeNavSeries = series;
    drawNavChart(activeNavSeries);
  } catch {
    activeNavSeries = [];
    drawNavChart([]);
  }
}

async function loadBenchmarks() {
  try {
    const data = await fetchPublicJson(`${dataRoot}/backtest_5202.json`);
    document.getElementById("benchmark-bars").textContent = numberFormat.format(data.bars_total);
    document.getElementById("benchmark-variants").textContent = numberFormat.format(data.candidate_variants_evaluated);
    const test = data.windows.find((window) => window.name === "test");
    if (test) {
      document.getElementById("benchmark-test-cagr").textContent = `${(test.cagr * 100).toFixed(1)}%`;
      document.getElementById("benchmark-test-mdd").textContent = `${(test.max_drawdown * 100).toFixed(1)}%`;
    }
  } catch {
    return;
  }
}

async function loadDecisionSummaries() {
  try {
    const data = await fetchPublicJson(`${dataRoot}/decision_summaries.json`);
    const records = Array.isArray(data.records) ? data.records : [];
    document.getElementById("snapshot-count").textContent = `${records.length} 條記錄`;
    const rows = document.getElementById("decision-rows");
    rows.replaceChildren();
    for (const record of [...records].reverse()) {
      const row = document.createElement("tr");
      const time = new Date(record.decision_at_utc);
      const values = [
        Number.isNaN(time.valueOf()) ? "--" : time.toISOString().replace("T", " ").slice(0, 19),
        `${Number(record.timeframe_hours) || 0}h`,
        numberFormat.format(Number(record.planned_action_count) || 0),
        numberFormat.format(Number(record.completed_result_count) || 0),
      ];
      for (const value of values) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      }
      rows.appendChild(row);
    }
  } catch {
    return;
  }
}

function updateCalculator() {
  const capital = Number(document.getElementById("capital-slider").value);
  const annualReturn = Number(document.getElementById("return-slider").value);
  const months = Number(document.getElementById("months-slider").value);
  const result = capital * Math.pow(1 + annualReturn / 100, months / 12);
  document.getElementById("capital-output").textContent = `${numberFormat.format(capital)} USDT`;
  document.getElementById("return-output").textContent = `${annualReturn}%`;
  document.getElementById("months-output").textContent = `${months} 個月`;
  document.getElementById("projected-output").textContent = `${numberFormat.format(result)} USDT`;
}

for (const id of ["capital-slider", "return-slider", "months-slider"]) {
  document.getElementById(id).addEventListener("input", updateCalculator);
}
window.addEventListener("resize", () => drawNavChart(activeNavSeries));
updateCalculator();
loadUnitNav();
loadBenchmarks();
loadDecisionSummaries();

