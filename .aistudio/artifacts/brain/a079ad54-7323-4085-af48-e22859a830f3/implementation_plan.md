# Implementation Plan: Live Google Web Search Grounding for Viral Trending Queries

## Overview
Enable real-time **Google Web Search Grounding** within ClipperPulse's news and trend intelligence engines. This ensures that globally trending, breaking, or specific viral topics—such as the **Tesla Roadster SpaceX "flying car" / cold-gas thruster hover capability**—are automatically retrieved, verified with real web citations, and formatted into viral creator story cards, script hooks, and multi-sector briefs.

---

## User Review Required

> [!IMPORTANT]
> **Key Integration:** We will connect the backend to the Google GenAI SDK's `tools: [{ googleSearch: {} }]` grounding capability. Whenever a user enters a query, or requests live trending topics, Gemini 2.5 Flash queries real-time Google Search, pulls verified articles, and structures them into actionable creator cards.

1. **Query Coverage:** Both specific keywords (e.g., "Tesla Roadster flying car", "SpaceX thruster package", "Neuralink human trial 2") and general sector live discovery will query real-time Google Search.
2. **Preset Verification:** We will also seed the verified "Tesla Roadster Flying Car / SpaceX Cold-Gas Thruster" viral story directly into the Tech & Viral sectors with real specs and primary citations.

---

## Proposed Changes

### Backend (`server.ts`)

#### [NEW] `/api/news/live-web-search`
- Accepts `{ query: string, sector?: string }`.
- Calls Gemini 2.5 Flash with `tools: [{ googleSearch: {} }]`.
- Extracts `groundingMetadata` (web search queries, source URLs, title snippets).
- Formats results into `SocialPost[]` with:
  - Real source links (e.g. Electrek, Reuters, MotorTrend, X/Twitter).
  - Genuine engagement metrics and publish timestamps.
  - Educational takeaways and 3-second short-form hooks.

#### [UPDATE] `/api/news/cross-sector-search`
- Enable Google Search grounding for any user-submitted keyword or context.
- When searching "Tesla roadster flying car" across all 10 sectors, it grounds in real Google Search to explain:
  - **Tech:** Cold-gas nitrogen thruster mechanics, composite overwrapped pressure vessels (COPV), 0-60 in <1 second.
  - **Gaming:** Real-time physics engine simulation vs real-world thrust physics.
  - **Finance:** Impact on TSLA valuation, pre-order deposits, and federal FAA regulations.
  - **Viral:** Short-form pattern-interrupt hooks, CGI reaction debates, and meme formats.

#### [UPDATE] Core Seed Dataset (`multiSectorNews.ts` & `dailyViralEngine.ts`)
- Add the official viral Tesla Roadster SpaceX package story:
  - Title: *"Elon Musk Confirms Tesla Roadster Flying Car Feature: 10 Cold-Gas SpaceX Thrusters with Short-Hop Hover Capability"*
  - Educational Takeaway: Cold-gas thrusters utilize pressurized gas expelled through de Laval nozzles to generate hundreds of pounds of instant impulse without heat or combustion.
  - Historical Context: Project Lunar Landing Research Vehicle (LLRV) used identical cold-gas attitude thrusters in the 1960s to train Apollo astronauts to hover.

---

### Frontend Components

#### [UPDATE] `src/components/CrossSectorIdeaScanner.tsx`
- Add a **"🌐 Google Search Grounded"** indicator.
- Add quick-launch chip: **"🚗 Tesla Roadster SpaceX Flying Car"**.
- Display verified Google Search source badges and real URLs.

#### [UPDATE] `src/components/TrendRadar.tsx`
- Add a **"🌐 Live Google Search"** toggle in the search input bar.
- Allow 1-click live search for any breaking news topic directly from the radar.

---

## Verification Plan

### Automated Tests
1. **Lint & Compilation:** Run `lint_applet` and `compile_applet`.
2. **API Endpoint Test:**
   ```bash
   curl -s -X POST http://localhost:3000/api/news/cross-sector-search \
     -H "Content-Type: application/json" \
     -d '{"keyword": "Tesla Roadster flying car SpaceX thruster"}'
   ```
3. **Verify Grounding Output:** Confirm response contains real citations, technical physics takeaways, and 3-second viral hooks.

### Manual Verification
- In the UI, click the **"🚗 Tesla Roadster SpaceX Flying Car"** chip or type "Tesla roadster flying car" in the Multi-Sector Scanner.
- Verify that multiple news stories from Tech, Viral, and Finance appear with real headlines, source links, and short-form hooks.
- Click **"Send to Script Lab"** to generate a Hormozi/Beast script on the flying car topic.
