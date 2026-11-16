const CACHE_KEY = "gs_metrics_cache_v1";
const CACHE_TTL_MS = 15 * 60 * 1000;

function normalizeTitle(title) {
  return (title || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function readCachedMetrics() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (Date.now() - Number(parsed.cachedAt || 0) > CACHE_TTL_MS) return null;
    return parsed.data || null;
  } catch {
    return null;
  }
}

function writeCachedMetrics(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ cachedAt: Date.now(), data }));
  } catch {
    // Ignore storage quota or privacy mode errors
  }
}

async function loadScholarMetrics(jsonUrl) {
  const cached = readCachedMetrics();
  if (cached) return cached;

  const response = await fetch(jsonUrl, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} loading ${jsonUrl}`);
  }
  const data = await response.json();
  if (data && data.metrics && data.publications) {
    writeCachedMetrics(data);
  }
  return data;
}

function renderSummaryBar(data, nf) {
  const bar = document.getElementById("scholar-metrics-bar");
  if (!bar || !data || !data.metrics) return;

  const m = data.metrics;
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) {
      el.textContent = value;
    }
  };

  setText("gs-citations-all", nf.format(m.citations_all || 0));
  if (m.citations_recent !== undefined) {
    const sinceText = (data.since_label || "recent").toLowerCase();
    setText("gs-citations-recent", `(${nf.format(m.citations_recent)} ${sinceText})`);
  }
  setText("gs-hindex-all", nf.format(m.h_index_all || 0));
  setText("gs-i10-all", nf.format(m.i10_index_all || 0));
  if (m.h_index_recent !== undefined) {
    setText("gs-hindex-recent", nf.format(m.h_index_recent));
  }
  if (m.i10_index_recent !== undefined) {
    setText("gs-i10-recent", nf.format(m.i10_index_recent));
  }
  if (data.since_label) {
    setText("gs-since-label", data.since_label);
  }
  if (data.updated_at) {
    setText("gs-updated-at", `Synced ${data.updated_at}`);
  }

  bar.classList.add("is-loaded");
}

function hydratePublicationCards(data, nf) {
  if (!data || !data.publications) return;

  const pubsById = data.publications;
  const pubsByTitle = new Map();
  for (const [id, info] of Object.entries(pubsById)) {
    const norm = normalizeTitle(info && info.title);
    if (norm && !pubsByTitle.has(norm)) {
      pubsByTitle.set(norm, { id, ...info });
    }
  }

  const userId = data.user_id || "";
  document.querySelectorAll(".bib-entry").forEach((entry) => {
    const explicitId = entry.getAttribute("data-scholar-id");
    const rawTitle = entry.getAttribute("data-pub-title");
    let matchedId = null;
    let matchedInfo = null;

    if (explicitId && pubsById[explicitId]) {
      matchedId = explicitId;
      matchedInfo = pubsById[explicitId];
    } else if (rawTitle) {
      const byTitle = pubsByTitle.get(normalizeTitle(rawTitle));
      if (byTitle) {
        matchedId = byTitle.id;
        matchedInfo = byTitle;
      }
    }

    const btn = entry.querySelector(".scholar-cite-btn");
    if (!btn || !matchedId || !matchedInfo) return;

    if (userId) {
      btn.href = `https://scholar.google.com/citations?view_op=view_citation&hl=en&user=${encodeURIComponent(userId)}&citation_for_view=${encodeURIComponent(userId)}:${encodeURIComponent(matchedId)}`;
    }
    btn.removeAttribute("hidden");

    const textEl = btn.querySelector(".scholar-cite-text");
    const citations = Number(matchedInfo.citations || 0);
    if (citations > 0) {
      const formatted = nf.format(citations);
      if (textEl) textEl.textContent = `Cited by ${formatted}`;
      btn.classList.add("has-citations");
      btn.setAttribute("title", `Cited by ${formatted} on Google Scholar`);
    } else {
      if (textEl) textEl.textContent = "Scholar";
      btn.classList.remove("has-citations");
      btn.setAttribute("title", "View publication record on Google Scholar");
    }
  });
}

async function initScholarMetrics() {
  const sourceEl = document.querySelector("[data-scholar-json]");
  const jsonUrl = sourceEl ? sourceEl.getAttribute("data-scholar-json") : "/assets/json/google_scholar.json";
  const nf = new Intl.NumberFormat("en-US");

  try {
    const data = await loadScholarMetrics(jsonUrl);
    renderSummaryBar(data, nf);
    hydratePublicationCards(data, nf);
  } catch {
    const updatedEl = document.getElementById("gs-updated-at");
    if (updatedEl) {
      updatedEl.textContent = "View live profile on Scholar";
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScholarMetrics);
} else {
  initScholarMetrics();
}
