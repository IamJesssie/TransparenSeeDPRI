# Member Task Tracker - Sprint 2026-04-05

Owner: Jessie Noel Lapure
Scope: Continue Detail, Map, Price Report, Admin Dashboard, AI and workflow completion.

## Working Rules
- Keep commits scoped by feature area (no bulk commits).
- Open PR/commit note must include: What changed, Why, Evidence (screenshot/log), Risks.
- If backend fields or API contracts change, notify all members before merge.

## Team Assignment Board

| Member | Feature Focus | Priority | Deliverables | Dependencies | Status |
|---|---|---|---|---|---|
| Jessie Noel Lapure | Detail page hardening + API contract | P0 | 1) Final detail layout parity 2) category color/key rendering consistency 3) AI fallback UX polish | DPRI_PriceEngine + AI_Concierge | Not Started |
| Josephjames Banico | Map page reliability | P0 | 1) Replace blocked tile source 2) validate locate-me and nearest list 3) mobile map UX fixes | PharmacyLocator + map provider key/policy | Not Started |
| Michaelgrant Libato | Price report page implementation | P0 | 1) Build transparensee_report.do 2) printable layout 3) bind medicine + DPRI + savings + source citation | Detail route + DPRI_PriceEngine | Not Started |
| Raymart Ruperez | Admin dashboard + role-safe controls | P1 | 1) Admin dashboard page shell 2) table widgets/actions 3) enforce dpri_admin UI guardrails | ACL/roles | Not Started |
| Axcel Macansantos | AI + automations integration | P1 | 1) AI prompt/version notes 2) telemetry logging 3) draft flow chain Search -> AI -> Log -> Notify artifacts | AI_Concierge + Flow Designer | Not Started |

## Checklist by Area

### 1. Drug Detail Page
- [ ] Verify all fields render with null-safe fallback text.
- [ ] Add clear "Why this matters" and savings presentation consistency with search cards.
- [ ] Confirm AI loading/error/success states across slow and failed API responses.
- [ ] Validate category canonical label + color from backend fields.

### 2. Map Page
- [ ] Resolve tile provider policy blocking.
- [ ] Validate geolocation denied/granted alternate flows.
- [ ] Show nearest pharmacies with stable sorting and clear empty states.
- [ ] Mobile viewport QA for map + list panel.

### 3. Price Report Page
- [ ] Create report endpoint/page artifact and routing.
- [ ] Include medicine name, DPRI benchmark, savings line, and DOH citation.
- [ ] Ensure print CSS and one-click print action work.
- [ ] Confirm data integrity for missing/partial fields.

### 4. Admin Dashboard
- [ ] Build dashboard shell and sections.
- [ ] Add safe admin actions for medicine/pharmacy curation.
- [ ] Confirm non-admin access denied behavior.
- [ ] Add simple activity metrics from search logs.

### 5. AI + Flows
- [ ] Finalize Gemini usage notes and error telemetry format.
- [ ] Track prompt version and fallback path.
- [ ] Draft and export flow artifacts for hackathon evidence.
- [ ] Align README + USESCASES with completed flow states.

## End-of-Day Reporting Format
Each member posts:
1. Completed tasks
2. Current blocker
3. Proof (screenshot/log/file links)
4. Next planned task

## Commit Grouping Plan
1. feat(detail): detail page and API contract alignment
2. feat(map): tile provider + geolocation stability
3. feat(report): price report endpoint and print layout
4. feat(admin): dashboard and role-safe controls
5. feat(ai-flow): AI telemetry + flow artifacts
6. docs(progress): update USESCASES + README + tracker
