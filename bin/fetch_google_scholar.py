#!/usr/bin/env python3
"""Fetch public Google Scholar profile metrics and per-paper citation counts."""

from __future__ import annotations

import datetime
import html
import json
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.request

USER_ID = "2Un1c7QAAAAJ"
PROFILE_URL = f"https://scholar.google.com/citations?user={USER_ID}&hl=en"
PAGE_SIZE = 100
MAX_PAGES = 10
REQUEST_TIMEOUT_SEC = 12
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0.0.0 Safari/537.36"
)

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "assets" / "json" / "google_scholar.json"
DATA_OUTPUT_PATH = REPO_ROOT / "_data" / "google_scholar.json"


def _clean_text(raw_html: str) -> str:
    text = re.sub(r"<[^>]+>", "", raw_html)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _fetch_page(cstart: int) -> str:
    url = f"{PROFILE_URL}&cstart={cstart}&pagesize={PAGE_SIZE}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT_SEC) as resp:
        return resp.read().decode("utf-8", errors="replace")


def _parse_summary(page_html: str) -> tuple[str, dict[str, int]]:
    headers = [_clean_text(h) for h in re.findall(r'<th[^>]*class="[^"]*gsc_rsb_sth[^"]*"[^>]*>(.*?)</th>', page_html, re.S)]
    since_label = next((h for h in headers if h.lower().startswith("since")), "Since 2021")

    raw_stats = re.findall(r'<td[^>]*class="[^"]*gsc_rsb_std[^"]*"[^>]*>([\d,]+)</td>', page_html)
    if len(raw_stats) < 6:
        raise ValueError(f"Expected 6 summary metrics in Scholar HTML, found {len(raw_stats)}")

    values = [int(v.replace(",", "")) for v in raw_stats[:6]]
    metrics = {
        "citations_all": values[0],
        "citations_recent": values[1],
        "h_index_all": values[2],
        "h_index_recent": values[3],
        "i10_index_all": values[4],
        "i10_index_recent": values[5],
    }
    return since_label, metrics


def _parse_rows(page_html: str) -> list[tuple[str, dict[str, object]]]:
    rows = re.findall(r'<tr[^>]*class="[^"]*gsc_a_tr[^"]*"[^>]*>(.*?)</tr>', page_html, re.S)
    parsed: list[tuple[str, dict[str, object]]] = []
    cid_pattern = re.compile(rf"citation_for_view={re.escape(USER_ID)}:([^\"&]+)")

    for row in rows:
        cid_match = cid_pattern.search(row)
        title_match = re.search(r'<a[^>]*class="[^"]*gsc_a_at[^"]*"[^>]*>(.*?)</a>', row, re.S)
        cites_match = re.search(r'<a[^>]*class="[^"]*gsc_a_ac[^"]*"[^>]*>([\d,]*)</a>', row)
        year_match = re.search(r'<span[^>]*class="[^"]*gsc_a_h[^"]*"[^>]*>(\d{4})?</span>', row)

        if not cid_match or not title_match:
            continue

        pub_id = html.unescape(cid_match.group(1)).strip()
        title = _clean_text(title_match.group(1))
        cites_raw = cites_match.group(1).replace(",", "").strip() if cites_match else ""
        citations = int(cites_raw) if cites_raw.isdigit() else 0
        year = year_match.group(1).strip() if year_match and year_match.group(1) else ""

        parsed.append(
            (
                pub_id,
                {
                    "title": title,
                    "citations": citations,
                    "year": year,
                },
            )
        )

    return parsed


def fetch_scholar_data() -> dict[str, object]:
    first_html = _fetch_page(0)
    if "gs_captcha" in first_html or "g-recaptcha" in first_html:
        raise RuntimeError("Google Scholar returned a challenge page")

    since_label, metrics = _parse_summary(first_html)
    publications: dict[str, dict[str, object]] = {}

    page_html = first_html
    for page_idx in range(MAX_PAGES):
        rows = _parse_rows(page_html)
        for pub_id, info in rows:
            publications[pub_id] = info

        if len(rows) < PAGE_SIZE:
            break

        time.sleep(0.5)
        page_html = _fetch_page((page_idx + 1) * PAGE_SIZE)

    if metrics["citations_all"] <= 0 or not publications:
        raise ValueError("Parsed Google Scholar payload is empty or invalid")

    return {
        "user_id": USER_ID,
        "profile_url": PROFILE_URL,
        "updated_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d"),
        "since_label": since_label,
        "metrics": metrics,
        "publications": publications,
    }


def main() -> int:
    try:
        payload = fetch_scholar_data()
    except (urllib.error.URLError, TimeoutError, ValueError, RuntimeError, OSError) as exc:
        print(f"Warning: could not fetch Google Scholar metrics ({exc})", file=sys.stderr)
        if OUTPUT_PATH.exists():
            print(f"Keeping existing cached data at {OUTPUT_PATH}", file=sys.stderr)
            DATA_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
            DATA_OUTPUT_PATH.write_text(OUTPUT_PATH.read_text(encoding="utf-8"), encoding="utf-8")
            return 0
        return 1

    rendered = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(rendered, encoding="utf-8")
    DATA_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    DATA_OUTPUT_PATH.write_text(rendered, encoding="utf-8")
    metrics = payload["metrics"]
    print(
        f"Updated {OUTPUT_PATH} — Citations: {metrics['citations_all']}, "
        f"h-index: {metrics['h_index_all']}, i10-index: {metrics['i10_index_all']}, "
        f"Papers: {len(payload['publications'])}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
