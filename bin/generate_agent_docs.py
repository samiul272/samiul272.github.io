#!/usr/bin/env python3
"""Generate AI-agent and search-ready context endpoints from canonical site sources.

Outputs:
  - assets/json/publications.json
  - llms.txt
  - llms-full.txt
"""

from __future__ import annotations

import json
from pathlib import Path
import re

REPO_ROOT = Path(__file__).resolve().parent.parent
BIB_PATH = REPO_ROOT / "_bibliography" / "papers.bib"
RESUME_PATH = REPO_ROOT / "assets" / "json" / "resume.json"
SCHOLAR_PATH = REPO_ROOT / "assets" / "json" / "google_scholar.json"

PUB_JSON_PATH = REPO_ROOT / "assets" / "json" / "publications.json"
LLMS_TXT_PATH = REPO_ROOT / "llms.txt"
LLMS_FULL_TXT_PATH = REPO_ROOT / "llms-full.txt"

SITE_URL = "https://samiul272.github.io"
SCHOLAR_USER_ID = "2Un1c7QAAAAJ"


def _clean_latex(text: str) -> str:
    text = text.replace(r"{\~a}", "ã").replace(r"\~a", "ã")
    text = text.replace(r"\&", "&").replace(r"\%", "%")
    text = text.replace("---", "—").replace("--", "–")
    text = text.replace("{", "").replace("}", "")
    return re.sub(r"\s+", " ", text).strip()


def _format_authors(raw_authors: str) -> list[str]:
    parts = [p.strip() for p in re.split(r"\s+and\s+", raw_authors.strip()) if p.strip()]
    formatted: list[str] = []
    for part in parts:
        cleaned = _clean_latex(part)
        if cleaned.lower() == "others":
            formatted.append("et al.")
        elif "," in cleaned:
            last, first = [x.strip() for x in cleaned.split(",", 1)]
            formatted.append(f"{first} {last}".strip())
        else:
            formatted.append(cleaned)
    return formatted


def parse_bibtex(text: str) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    i = 0
    n = len(text)

    while i < n:
        at_idx = text.find("@", i)
        if at_idx == -1:
            break
        header_match = re.match(r"@(\w+)\s*\{\s*([^,\s]+)\s*,", text[at_idx:])
        if not header_match:
            i = at_idx + 1
            continue

        entry_type = header_match.group(1).lower()
        key = header_match.group(2).strip()
        pos = at_idx + header_match.end()
        depth = 1
        fields: dict[str, str] = {"_type": entry_type, "_key": key}

        while pos < n and depth > 0:
            while pos < n and text[pos] in " \t\r\n,":
                pos += 1
            if pos >= n:
                break
            if text[pos] == "}":
                depth -= 1
                pos += 1
                break

            field_match = re.match(r"([A-Za-z0-9_]+)\s*=\s*", text[pos:])
            if not field_match:
                pos += 1
                continue

            field_name = field_match.group(1).lower()
            pos += field_match.end()
            if pos >= n:
                break

            delim = text[pos]
            if delim == "{":
                pos += 1
                val_start = pos
                brace_depth = 1
                while pos < n and brace_depth > 0:
                    if text[pos] == "{":
                        brace_depth += 1
                    elif text[pos] == "}":
                        brace_depth -= 1
                    pos += 1
                raw_val = text[val_start : pos - 1]
            elif delim == '"':
                pos += 1
                val_start = pos
                while pos < n and not (text[pos] == '"' and text[pos - 1] != "\\"):
                    pos += 1
                raw_val = text[val_start:pos]
                pos += 1
            else:
                val_match = re.match(r"[^,\}\r\n]+", text[pos:])
                raw_val = val_match.group(0) if val_match else ""
                pos += len(raw_val)

            fields[field_name] = raw_val.strip()

        entries.append(fields)
        i = pos

    return entries


def build_publication_record(
    raw: dict[str, str],
    scholar_pubs: dict[str, dict[str, object]],
) -> dict[str, object]:
    entry_type = raw["_type"]
    title = _clean_latex(raw.get("title", ""))
    authors = _format_authors(raw.get("author", ""))
    year = _clean_latex(raw.get("year", ""))

    if entry_type == "article":
        venue = _clean_latex(raw.get("journal", ""))
    elif entry_type in ("inproceedings", "incollection"):
        venue = _clean_latex(raw.get("booktitle", ""))
    elif entry_type in ("phdthesis", "mastersthesis", "thesis"):
        degree = "Ph.D. Dissertation" if entry_type == "phdthesis" else "M.S. Thesis"
        school = _clean_latex(raw.get("school", ""))
        venue = f"{degree}, {school}".strip(", ")
    else:
        venue = _clean_latex(raw.get("booktitle", raw.get("journal", raw.get("school", ""))))

    gs_id = raw.get("google_scholar_id", "").strip()
    citations = 0
    if gs_id and gs_id in scholar_pubs:
        citations = int(scholar_pubs[gs_id].get("citations", 0) or 0)

    urls: dict[str, str] = {}
    if raw.get("doi"):
        urls["doi"] = f"https://doi.org/{raw['doi'].strip()}"
    if raw.get("arxiv"):
        urls["arxiv"] = f"https://arxiv.org/abs/{raw['arxiv'].strip()}"
    if raw.get("html"):
        urls["html"] = raw["html"].strip()
    if raw.get("url") and "html" not in urls:
        urls["url"] = raw["url"].strip()
    if raw.get("pdf"):
        urls["pdf"] = raw["pdf"].strip()
    if raw.get("code"):
        urls["code"] = raw["code"].strip()
    if gs_id:
        urls["scholar"] = (
            f"https://scholar.google.com/citations?view_op=view_citation&hl=en"
            f"&user={SCHOLAR_USER_ID}&citation_for_view={SCHOLAR_USER_ID}:{gs_id}"
        )

    preview = raw.get("preview", "").strip()
    preview_url = (
        preview
        if preview.startswith("http")
        else (f"{SITE_URL}/assets/img/publication_preview/{preview}" if preview else "")
    )

    return {
        "key": raw["_key"],
        "type": entry_type,
        "title": title,
        "authors": authors,
        "year": int(year) if year.isdigit() else year,
        "venue": venue,
        "abbr": _clean_latex(raw.get("abbr", "")),
        "topic": raw.get("topic", "").strip(),
        "selected": raw.get("selected", "").strip().lower() == "true",
        "citations": citations,
        "google_scholar_id": gs_id or None,
        "award": _clean_latex(raw["award"]) if raw.get("award") else None,
        "doi": raw.get("doi", "").strip() or None,
        "arxiv": raw.get("arxiv", "").strip() or None,
        "preview_image": preview_url or None,
        "urls": urls,
        "abstract": _clean_latex(raw.get("abstract", "")) or None,
    }


def main() -> int:
    bib_text = BIB_PATH.read_text(encoding="utf-8")
    resume = json.loads(RESUME_PATH.read_text(encoding="utf-8"))
    scholar = json.loads(SCHOLAR_PATH.read_text(encoding="utf-8")) if SCHOLAR_PATH.exists() else {}

    scholar_metrics = scholar.get("metrics", {})
    scholar_pubs = scholar.get("publications", {})
    updated_at = scholar.get("updated_at", "")

    raw_entries = parse_bibtex(bib_text)
    publications = [build_publication_record(entry, scholar_pubs) for entry in raw_entries]

    pub_payload = {
        "author": resume.get("basics", {}).get("name", "Samiul Alam"),
        "site_url": SITE_URL,
        "scholar_profile": f"https://scholar.google.com/citations?user={SCHOLAR_USER_ID}&hl=en",
        "updated_at": updated_at,
        "total_publications": len(publications),
        "metrics": scholar_metrics,
        "publications": publications,
    }
    PUB_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    PUB_JSON_PATH.write_text(json.dumps(pub_payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")

    selected = [p for p in publications if p["selected"]]
    citations_all = scholar_metrics.get("citations_all", 0)
    h_index = scholar_metrics.get("h_index_all", 0)
    i10_index = scholar_metrics.get("i10_index_all", 0)

    llms_lines = [
        "# Samiul Alam",
        "",
        (
            "> Software Engineer at Google (Mountain View, CA) & Ph.D. in Computer Science and Engineering "
            "from The Ohio State University. Research & engineering focus: spatial computing and supermemory "
            "for AR smart glasses, multimodal foundation models, agentic recommendation systems, on-device AI, "
            "and federated learning."
        ),
        "",
        "## Identity & Affiliations",
        "",
        "- **Current Role**: Software Engineer, Google (Mountain View, CA) — user activity modeling & agentic recommendation systems",
        "- **Education**: Ph.D. in CSE, The Ohio State University (2026); M.S. in CS, Michigan State University (2023); B.Sc. in EEE, BUET (2017)",
        "- **Prior Industry & Non-Profit**: Research Scientist Intern, Meta Reality Labs (2026); SWE Intern, Google (2025); Software Engineer, Samsung R&D (2018–2021); Co-Founder, Bengali.AI",
        (
            f"- **Google Scholar Metrics** (synced {updated_at}): "
            f"{citations_all:,} citations | h-index: {h_index} | i10-index: {i10_index}"
        ),
        "- **Selected Honors**: 2024 IEEE Internet Computing Best Paper Award; OSU Graduate School University Fellowship; Kaggle Community Competition Creator Prize",
        "",
        "## Pages & Machine-Readable Endpoints",
        "",
        f"- [About & Overview]({SITE_URL}/): Biography, current affiliations, research pillars, selected publications, and news",
        f"- [Publications ({len(publications)} papers)]({SITE_URL}/publications/): Interactive search, topic filters, per-paper Google Scholar citation counts, abstracts, and BibTeX",
        f"- [Curriculum Vitae]({SITE_URL}/cv/): Complete academic and industry timeline, awards, and technical skills",
        f"- [Full Agent Context (llms-full.txt)]({SITE_URL}/llms-full.txt): Self-contained Markdown dossier with full CV and all {len(publications)} paper abstracts & citations",
        f"- [Publications JSON]({SITE_URL}/assets/json/publications.json): Structured catalog of all {len(publications)} publications with venues, citations, DOIs, and links",
        f"- [JSON Resume]({SITE_URL}/assets/json/resume.json): Schema-compliant JSON Resume for experience, education, awards, and skills",
        f"- [Google Scholar Metrics JSON]({SITE_URL}/assets/json/google_scholar.json): Profile citation summary and per-paper citation map",
        f"- [XML Sitemap]({SITE_URL}/sitemap.xml): Canonical URL index",
        "",
        "## Research Pillars",
        "",
        "- **Spatial Computing & Supermemory**: Selective memory creation (Reading Recognition in the Wild, NeurIPS '25), gaze-guided retrieval (MemoLens, MobiSys '26), and longitudinal egocentric VQA (SuperMemory-VQA).",
        "- **Agentic & Multimodal Recommenders**: User activity modeling, synthetic-to-real browsing alignment, and multimodal LLM personalization.",
        "- **Efficient & On-Device AI**: Singular value truncation for LLM compression (SVD-LLM V2, NAACL '25) and RL dynamic sensor capture for prototype smart glasses.",
        "- **Federated Learning & Bengali.AI**: Model-heterogeneous & geo-distributed FL (FedRolex, FedAIoT, GeoFL) and large open-source Bengali datasets (NumtaDB, Graphemes, Bengali Common Voice, OOD-Speech).",
        "",
        "## Selected Publications",
        "",
    ]

    for pub in selected:
        urls = pub["urls"]
        primary_url = urls.get("doi") or urls.get("html") or urls.get("arxiv") or urls.get("pdf") or f"{SITE_URL}/publications/"
        cite_str = f" · Cited by {pub['citations']}" if pub["citations"] else ""
        award_str = " · Best Paper Award" if pub["award"] else ""
        llms_lines.append(
            f"- [{pub['title']}]({primary_url}) ({pub['abbr'] or pub['year']}, {pub['year']}{cite_str}{award_str})"
        )

    llms_lines.extend(
        [
            "",
            "## Profiles & Contact",
            "",
            f"- Google Scholar: https://scholar.google.com/citations?user={SCHOLAR_USER_ID}&hl=en",
            "- GitHub: https://github.com/samiul272",
            "- LinkedIn: https://www.linkedin.com/in/samiul-alam",
            "- ORCID: https://orcid.org/0000-0002-8458-4642",
            "- Email: samiul272@gmail.com",
            "",
        ]
    )

    LLMS_TXT_PATH.write_text("\n".join(llms_lines), encoding="utf-8", newline="\n")

    # Build comprehensive llms-full.txt
    full_lines = [
        "# Samiul Alam — Complete Profile, CV & Publications Context",
        "",
        f"Canonical website: {SITE_URL}/",
        f"Structured JSON catalog: {SITE_URL}/assets/json/publications.json",
        f"Structured JSON Resume: {SITE_URL}/assets/json/resume.json",
        f"Google Scholar metrics JSON: {SITE_URL}/assets/json/google_scholar.json (synced {updated_at})",
        "",
        "## Biography & Summary",
        "",
        resume.get("basics", {}).get("summary", ""),
        "",
        "- **Email**: samiul272@gmail.com",
        "- **Location**: Mountain View, CA, USA",
        f"- **Google Scholar**: https://scholar.google.com/citations?user={SCHOLAR_USER_ID}&hl=en ({citations_all:,} citations, h-index {h_index}, i10-index {i10_index})",
        "- **GitHub**: https://github.com/samiul272",
        "- **LinkedIn**: https://www.linkedin.com/in/samiul-alam",
        "- **ORCID**: https://orcid.org/0000-0002-8458-4642",
        "- **Bengali.AI**: https://bengali.ai",
        "",
        "## Experience",
        "",
    ]

    for job in resume.get("work", []):
        dates = f"{job.get('startDate', '')} – {job.get('endDate') or 'Present'}"
        loc = f" | {job['location']}" if job.get("location") else ""
        full_lines.append(f"### {job['position']} — {job['name']} ({dates}{loc})")
        if job.get("summary"):
            full_lines.append(job["summary"])
        for h in job.get("highlights", []):
            full_lines.append(f"- {h}")
        full_lines.append("")

    full_lines.extend(["## Education", ""])
    for edu in resume.get("education", []):
        dates = f"{edu.get('startDate', '')} – {edu.get('endDate', '')}"
        score = f" | {edu['score']}" if edu.get("score") else ""
        full_lines.append(f"### {edu['studyType']} in {edu['area']} — {edu['institution']} ({dates}{score})")
        for course in edu.get("courses", []):
            full_lines.append(f"- {course}")
        full_lines.append("")

    full_lines.extend(["## Honors & Awards", ""])
    for award in resume.get("awards", []):
        full_lines.append(f"- **{award['title']}** ({award['awarder']}, {award['date']}): {award['summary']}")
    full_lines.append("")

    full_lines.extend(["## Technical & Research Skills", ""])
    for skill in resume.get("skills", []):
        full_lines.append(f"- **{skill['name']}**: {', '.join(skill.get('keywords', []))}")
    full_lines.append("")

    full_lines.extend([f"## Publications ({len(publications)} Total)", ""])
    for idx, pub in enumerate(publications, start=1):
        cite_label = f" | Cited by {pub['citations']}" if pub["citations"] else ""
        full_lines.append(f"### {idx}. {pub['title']}")
        full_lines.append(f"- **Authors**: {', '.join(pub['authors'])}")
        full_lines.append(f"- **Venue & Year**: {pub['venue']} ({pub['year']}){cite_label}")
        if pub["award"]:
            full_lines.append(f"- **Award**: {pub['award']}")
        if pub["urls"]:
            url_parts = [f"{k.upper()}: {v}" for k, v in pub["urls"].items()]
            full_lines.append(f"- **Links**: {' | '.join(url_parts)}")
        if pub["abstract"]:
            full_lines.append(f"- **Abstract**: {pub['abstract']}")
        full_lines.append("")

    LLMS_FULL_TXT_PATH.write_text("\n".join(full_lines), encoding="utf-8", newline="\n")
    print(f"Generated {PUB_JSON_PATH.name} ({len(publications)} papers), llms.txt, llms-full.txt")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
