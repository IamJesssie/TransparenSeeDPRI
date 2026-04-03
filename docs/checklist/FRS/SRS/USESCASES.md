# TransparenSee FRS/SRS/Use Cases Tracker

Last updated: 2026-04-04  
Scope: Hackathon PRBCS00034 delivery tracking aligned to README claims and hackathon rubric.

## 1. Purpose
This document tracks what is:
- Done
- In Progress
- Not Started
- Blocked

It links each requirement to repository evidence and defines next actions so the team can execute quickly.

## 2. Status Legend
- ✅ Done: Implemented in repo and reasonably testable.
- ❌ In Progress: Partially implemented; missing config, data, or final behavior.
- 🟡 Not Started: No implementation evidence in repo.
- ⛔ Blocked: Implementation present but prevented by dependency/config/policy.

## 3. Important Scope Note
The rubric in docs/SKILL.md uses prefix x_snc_transparensee, while the active codebase uses x_1966129_transpar. This is a naming divergence only; requirement intent is equivalent.

## 3.1 Validated Today (2026-04-04)
- Home hero/search UX polish validated in instance: improved spacing, cleaned trust copy, removed redundant source/sync badges, and removed recent-search timestamps.
- Home/Search autocomplete and suggestions validated, including typo-tolerant matching improvements for Salbutamol.
- Canonical category normalization patched and validated in search/detail API responses (including Bronchodilator handling).
- Search result cards validated with added savings-impact helper line.

## 4. Rubric Traceability Matrix

### 4.1 Development (45%)
| Rubric Item | Status | Evidence | Gap / Next Action |
|---|---|---|---|
| Business Rule ts_flag_overprice | 🟡 Not Started | src/fluent/business-rules/calculate-savings.now.ts, src/server/business-rules/calculate-savings.js | Add new BR file for positive DPRI validation, wire in src/fluent/index.now.ts |
| Client Script live autocomplete | ✅ Done | src/client/ui-pages/transparensee-home.js, src/client/ui-pages/transparensee-home.html, src/server/script-includes/dpri-price-engine.js | Validated in instance; continue smoke test after full data import |
| Integration Hub spoke for AI Concierge | ❌ In Progress | src/server/script-includes/ai-concierge.js | Uses direct RESTMessageV2 to Gemini; add formal Integration Hub spoke or document accepted equivalent |
| UI Action Generate Price Report | ❌ In Progress | src/client/ui-pages/transparensee-detail.js, src/client/ui-pages/transparensee-detail.html | Report endpoint/page artifact missing; implement report UI page and registration |
| Notifications outbound (pharmacy approved) | 🟡 Not Started | docs/references/04_05_06_rules_scripts_actions.md | Implement event + notification records and add BR for approval event |
| Notifications inbound (email-to-case) | 🟡 Not Started | docs/references/07_08_09_10_flow_security_presentation.md | Create inbound email action and case mapping |
| Approval via email workflow | 🟡 Not Started | docs/references/07_08_09_10_flow_security_presentation.md | Build flow in Flow Designer and export artifacts/doc evidence |
| Flow Designer Search -> AI -> Log -> Notify | 🟡 Not Started | docs/references/07_08_09_10_flow_security_presentation.md | Build flow; currently only script-level search logging exists |
| Service Portal full at /transparensee | ❌ In Progress | README.md, src/fluent/ui-pages/*.now.ts | Current UI Pages exist under /x_1966129_transpar_*.do, not full Service Portal widgets/pages |
| User criteria + roles + ACLs | ❌ In Progress | src/fluent/roles/dpri-roles.now.ts, src/fluent/acls/table-security.now.ts | User Criteria artifact not found in repo; add and verify role assignment strategy |

### 4.2 AI (15%)
| Rubric Item | Status | Evidence | Gap / Next Action |
|---|---|---|---|
| AI counsel per search | ✅ Done | src/server/script-includes/ai-concierge.js, src/client/ui-pages/transparensee-detail.js | Add prompt/version governance and error telemetry |
| Generic alternatives with savings estimate | ❌ In Progress | src/client/ui-pages/transparensee-search.html, src/client/ui-pages/transparensee-search.js | Rule-based recommendation banner exists; make AI-driven alternative rationale explicit |
| Agentic AI bonus | 🟡 Not Started | N/A | Add action-taking workflow (ex: AI triggers follow-up notification/report suggestion) |

### 4.3 Portal Design (10%)
| Rubric Item | Status | Evidence | Gap / Next Action |
|---|---|---|---|
| Matches design system | ❌ In Progress | src/client/ui-pages/transparensee-home.html, docs/assets/TransparenSee_Design_System.md | Home close to target; search/map/detail still need final parity polish |
| Mobile responsive | ❌ In Progress | src/client/ui-pages/transparensee-home.html, src/client/ui-pages/transparensee-search.html | Verify breakpoints on map/detail/profile in instance |
| Logo in navbar | ✅ Done | src/client/ui-pages/transparensee-home.html, src/client/ui-pages/transparensee-search.html, src/client/ui-pages/transparensee-map.html | Ensure image assets are uploaded in System UI Images |

### 4.4 Solution to Problem (20%)
| Rubric Item | Status | Evidence | Gap / Next Action |
|---|---|---|---|
| DPRI 2025 real data imported (min 30 drugs) | ❌ In Progress | src/fluent/records/medicines.now.ts | Repo seed has ~10 records; import >=30 real DPRI entries |
| Pharmacy table with Cebu locations | ✅ Done | src/fluent/records/pharmacies.now.ts | Add more branches for better map coverage |
| Price comparison with peso savings | ✅ Done | src/server/script-includes/dpri-price-engine.js, src/server/business-rules/calculate-savings.js | Add cheapest-nearby pharmacy by selected drug for map scenario |

### 4.5 Presentation (10%)
| Rubric Item | Status | Evidence | Gap / Next Action |
|---|---|---|---|
| 7 required slides | ❌ In Progress | docs/references/07_08_09_10_flow_security_presentation.md | Produce final deck artifact in repo or shared drive |
| Process flow diagram | ❌ In Progress | docs/references/07_08_09_10_flow_security_presentation.md | Export final diagram PNG/SVG and reference in slides |
| Demo rehearsed and timed | 🟡 Not Started | N/A | Perform runbook rehearsal and capture timing checklist |

## 5. Functional Requirements Specification (FRS)

| FR ID | Requirement | Status | Evidence | Acceptance Criteria | Gap / Next Action |
|---|---|---|---|---|---|
| FR-01 | Search drugs by generic/brand and return DPRI pricing context | ✅ Done | src/client/ui-pages/transparensee-search.js; src/server/script-includes/dpri-price-engine.js | 1) Query >=2 chars returns rows when data exists<br>2) Card shows DPRI and comparison fields<br>3) No server crash on malformed query<br>4) Typo-tolerant fallback returns likely matches | Add query performance logging |
| FR-02 | Home live autocomplete suggestions | ✅ Done | src/client/ui-pages/transparensee-home.js; src/client/ui-pages/transparensee-home.html; src/server/script-includes/dpri-price-engine.js | 1) Debounce works (~500ms)<br>2) Selection routes correctly<br>3) Suggestions remain readable and non-overlapping | Continue validation with full dataset import |
| FR-03 | Drug detail + AI safety counsel | ✅ Done | src/client/ui-pages/transparensee-detail.js; src/server/script-includes/ai-concierge.js | 1) Detail loads by id<br>2) AI or fallback always displays | Add telemetry and prompt versioning |
| FR-04 | Generate price report from detail page | ❌ In Progress | src/client/ui-pages/transparensee-detail.js | 1) Report page loads with medicine context<br>2) Printable layout available | Implement /x_1966129_transpar_report.do page and registration |
| FR-05 | Map nearby approved pharmacies with geolocation | ⛔ Blocked | src/client/ui-pages/transparensee-map.js; src/server/script-includes/pharmacy-locator.js | 1) Tiles render<br>2) Location updates map and list | Replace blocked OSM tile endpoint with compliant provider |
| FR-06 | Identify cheapest nearby pharmacy for selected drug | 🟡 Not Started | N/A | 1) Nearby list sorted by cheapest then distance for selected drug | Build backend join/ranking endpoint and data model |
| FR-07 | Enforce role/ACL security boundaries | ❌ In Progress | src/fluent/roles/dpri-roles.now.ts; src/fluent/acls/table-security.now.ts | 1) Patient read-only scope works<br>2) Admin CRUD enforcement works | Add user criteria artifacts and assignment strategy |
| FR-08 | Log patient searches for analytics | ✅ Done | src/server/script-includes/dpri-price-engine.js; src/fluent/tables/search-log.now.ts | 1) Search events persist with count/term<br>2) No user-facing delay | Add report/dashboard consumer |
| FR-09 | Auto-calculate savings amount/percent | ✅ Done | src/server/business-rules/calculate-savings.js; src/fluent/business-rules/calculate-savings.now.ts | 1) Savings fields update on relevant changes<br>2) Invalid values default safely | Add regression tests |
| FR-10 | Overprice/invalid DPRI validation rule | 🟡 Not Started | N/A | 1) Reject invalid price writes<br>2) Show admin-friendly error | Implement ts_flag_overprice BR and wire in index |
| FR-11 | Approval + outbound/inbound notification workflows | 🟡 Not Started | docs/references/07_08_09_10_flow_security_presentation.md | 1) Approval email workflow executes<br>2) Inbound/outbound notifications triggered | Build Flow Designer + notifications artifacts |

## 6. System Requirements Specification (SRS)

| NFR ID | Requirement | Target | Status | Evidence | Gap / Next Action |
|---|---|---|---|---|---|
| NFR-01 | Performance (search latency) | <=1.5s for <=15 results | ❌ In Progress | src/server/script-includes/dpri-price-engine.js | Add timing logs and index optimization |
| NFR-02 | Reliability (core journey stability) | Search->Detail->AI->Map works without hard failure | ❌ In Progress | src/server/script-includes/ai-concierge.js; src/client/ui-pages/transparensee-map.js | Replace blocked tile provider; improve search/map failure UX |
| NFR-03 | Security (RBAC + ACL) | Enforce patient/admin boundaries | ❌ In Progress | src/fluent/roles/dpri-roles.now.ts; src/fluent/acls/table-security.now.ts | Add user criteria and guest exposure validation |
| NFR-04 | Data integrity | Savings and price validation consistent | ❌ In Progress | src/server/business-rules/calculate-savings.js | Add ts_flag_overprice and data quality checks |
| NFR-05 | Maintainability | Modular fluent registration and separation | ✅ Done | src/fluent/index.now.ts | Keep architecture guardrails and code owners |
| NFR-06 | Responsive UX | Mobile-ready across all pages | ❌ In Progress | src/client/ui-pages/transparensee-home.html; src/client/ui-pages/transparensee-search.html | Complete mobile QA on map/detail/profile |
| NFR-07 | Observability | Actionable logs and failure dashboard | 🟡 Not Started | N/A | Add structured gs.error/event logs and dashboard |

## 7. Use Cases

| UC ID | Use Case | Actor | Preconditions | Main Flow | Alternate Flow(s) | Postcondition | Status | Evidence | Gap / Next Action |
|---|---|---|---|---|---|---|---|---|---|
| UC-01 | Patient searches a drug | Patient | Medicine data exists; page access available | UI sends GlideAjax searchDrug -> backend query -> result render | A1: query <2 chars no search<br>A2: parse/server error -> safe stop<br>A3: minor typos use stem fallback | Search context shown and loggable | ✅ Done | src/client/ui-pages/transparensee-search.js; src/server/script-includes/dpri-price-engine.js; src/client/ui-pages/transparensee-home.js | Improve explicit empty/error messaging |
| UC-02 | Patient views detail and AI counsel | Patient | Drug id exists | Load detail -> request AI counsel -> render AI/fallback | A1: missing API key -> fallback<br>A2: AI error -> fallback/error state | Patient receives safety + price guidance | ✅ Done | src/client/ui-pages/transparensee-detail.js; src/server/script-includes/ai-concierge.js | Add response-time and failure telemetry |
| UC-03 | Patient finds nearest pharmacies | Patient | Pharmacy lat/lng data present | Geolocation -> findNearest -> map/sidebar update | A1: location denied -> default center<br>A2: tile provider blocked | Nearby options visible | ⛔ Blocked | src/client/ui-pages/transparensee-map.js; src/server/script-includes/pharmacy-locator.js | Replace tile provider and retest instance policy |
| UC-04 | Patient identifies cheapest nearby pharmacy for selected drug | Patient | Selected drug + pharmacy pricing linkage | Not yet implemented | N/A | Lowest nearby price decision available | 🟡 Not Started | N/A | Build drug-pharmacy join + ranking endpoint and UI sorter |
| UC-05 | Patient generates report | Patient | Detail loaded | Click generate -> redirect/open report endpoint | A1: endpoint missing -> dead route | Printable report generated | ❌ In Progress | src/client/ui-pages/transparensee-detail.js | Implement report page + registration |
| UC-06 | Admin secures and manages records | dpri_admin | Admin role assigned | ACL controls table operations by role | A1: unauthorized access denied | Data operations enforced securely | ❌ In Progress | src/fluent/roles/dpri-roles.now.ts; src/fluent/acls/table-security.now.ts | Add user criteria and admin ops evidence |
| UC-07 | Workflow-based approvals and notifications | Admin/Flow engine | Flow and notifications configured | Approval transition triggers emails/updates | A1: missing flow -> no automation | Approval lifecycle automated | 🟡 Not Started | docs/references/07_08_09_10_flow_security_presentation.md | Implement Flow Designer + notifications artifacts |

## 8. Gap Register and Execution Plan

### P0 (Demo-Critical)
1. Fix map tile provider blocking (replace OSM endpoint with allowed provider + key).
2. Restore dynamic stats rendering in home bento values (ensure bindings not empty).
3. Implement report page endpoint and printable layout.
4. Ensure search page correctly exits loading and shows explicit no-results state.

### P1 (Rubric-Critical)
1. Add ts_flag_overprice business rule and tests.
2. Implement outbound/inbound notifications and approval-via-email.
3. Implement flow designer chain Search -> AI -> Log -> Notify.
4. Complete Service Portal artifacts or document equivalent acceptance.
5. Increase DPRI medicine import to >=30 records.

### P2 (Enhancement)
1. Cheapest-nearby pharmacy by selected drug.
2. ADK/agentic AI follow-up actions.
3. Observability dashboard for search/map/AI error rates.

## 9. Demo Readiness Checklist
- [x] Home: search + autocomplete works with real data
- [x] Search: results and filters work, no infinite loading
- [ ] Detail: AI response and fallback work
- [ ] Map: tiles render, location works, nearest list updates
- [ ] Report: generate/open printable report
- [ ] Security: roles and ACL behavior validated
- [ ] Data: >=30 medicines and Cebu pharmacies loaded
- [ ] Slides: 7 slides + flow diagram + rehearsed 5-7 min demo

## 10. Owner and Tracking Fields (fill per team)
- Requirement owner: Jessie Noel Lapure
- Technical owner: Jessie Noel Lapure
- Target date: 2026-04-10
- QA status: Passed (Home/Search smoke test on instance)
- Notes: PADAYON PARA SA FUTURE
