---
name: transparensee-servicenow
description: >
  Full-stack ServiceNow development skill for the TransparenSee DPRI Pharmacy Price Transparency app (PRBCS00034).
  Use this skill whenever the user is building, editing, or debugging ANY part of the TransparenSee ServiceNow
  application — including UI Pages, Script Includes, Business Rules, Client Scripts, UI Actions, Flow Designer,
  Integration Hub, Service Portal widgets, ACLs, roles, table schemas, GlideAjax, GlideRecord queries, or
  AngularJS frontend code. Trigger this skill for ANY ServiceNow IDE / VSCode work on the TransparenSee project,
  even if the user just asks a vague question like "how do I wire the search bar" or "write me the price engine"
  or "how do I set up the pharmacy table". Also trigger when the user attaches the TransparenSee_Design_System.md
  file, pastes DPRI data, or asks about connecting to OpenAI or Now Assist from ServiceNow.
---

# TransparenSee — ServiceNow Development Skill

## 🏗️ Project Overview

**App:** TransparenSee — Pharmacy Price Transparency (DPRI) Concierge  
**Hackathon Case:** PRBCS00034 · Health · Team TransparenSee · G6  
**Instance:** ServiceNow Developer Instance (developer.servicenow.com)  
**Scope prefix:** `x_snc_transparensee`  
**Portal URL:** `/transparensee`  
**VSCode Extension:** ServiceNow Extension for VS Code (by ServiceNow)

---

## 📁 App Architecture At-a-Glance

```
x_snc_transparensee (Scoped App)
├── Tables/               → See references/01_tables.md
├── Script Includes/      → See references/02_script_includes.md
├── UI Pages/             → See references/03_ui_pages.md
├── Business Rules/       → See references/04_business_rules.md
├── Client Scripts/       → See references/05_client_scripts.md
├── UI Actions/           → See references/06_ui_actions.md
├── Flow Designer/        → See references/07_flows.md
├── Service Portal/       → references/08_portal.md
├── Integration Hub/      → references/09_integrations.md
└── Security (ACL+Roles)/ → references/10_security.md
```

**Read the relevant reference file before generating code.** Each file has
copy-paste-ready boilerplate for that layer. Always prefix table/field names
with `x_snc_transparensee_` in production; shorthand `ts_` is used in comments.

---

## ⚡ VSCode + ServiceNow Extension Workflow

### One-time Setup
```
1. Install "ServiceNow Extension for VS Code" from the VSCode Marketplace
2. Press Ctrl+Shift+P → "ServiceNow: Add Connection"
   - Instance URL: https://devXXXXXX.service-now.com
   - Username: admin
   - Password: (your dev instance password)
3. Ctrl+Shift+P → "ServiceNow: Open Application" → select x_snc_transparensee
4. Files sync to your local workspace; save = auto-push to instance
```

### Daily Development Loop
```
1. Ctrl+Shift+P → "ServiceNow: Sync Files"      ← pull latest from instance
2. Edit file in VS Code
3. Ctrl+S                                         ← auto-pushes to instance
4. Test in browser at devXXXXXX.service-now.com
5. Git commit locally for version control
```

### File Type → ServiceNow Record Mapping
| VS Code file | ServiceNow record type |
|---|---|
| `script_includes/DPRI_PriceEngine.js` | Script Include |
| `ui_pages/transparensee_home.html` | UI Page (HTML tab) |
| `ui_pages/transparensee_home.client.js` | UI Page (Client Script tab) |
| `ui_pages/transparensee_home.server.js` | UI Page (Processing Script tab) |
| `business_rules/ts_flag_overprice.js` | Business Rule |
| `client_scripts/ts_search_autocomplete.js` | Client Script |
| `style_sheets/transparensee_theme.css` | Style Sheet |

---

## 🧠 Core Coding Rules (Always Apply)

### JavaScript Version
ServiceNow uses **ES5** (no arrow functions, no `let/const`, no template literals
in server-side scripts). Client-side scripts inside UI Pages CAN use ES6 since
they run in the browser, but AngularJS itself is ES5-compatible.

```javascript
// ✅ Server-side (Script Includes, Business Rules) — ES5 only
var engine = new DPRI_PriceEngine();
var results = engine.searchDrug('amoxicillin');

// ✅ Client-side AngularJS — ES6 OK in browser context
const app = angular.module('TransparenSeeApp', []);
```

### GlideRecord Best Practices
```javascript
// ✅ CORRECT — always use encoded query, limit records
var gr = new GlideRecord('x_snc_transparensee_medicine');
gr.addEncodedQuery('generic_nameLIKE' + searchTerm);
gr.setLimit(20);
gr.query();
while (gr.next()) {
    // access fields via gr.field_name.toString()
}

// ❌ WRONG — never do this in Script Includes
var gr = new GlideRecord('x_snc_transparensee_medicine');
gr.query(); // no limit = kills performance
```

### GlideAjax Pattern (Client → Server bridge)
```javascript
// Client Script calls Script Include via GlideAjax
var ga = new GlideAjax('DPRI_PriceEngine');
ga.addParam('sysparm_name', 'searchDrug');
ga.addParam('sysparm_query', searchTerm);
ga.getXMLAnswer(function(response) {
    var results = JSON.parse(response);
    $scope.$apply(function() {
        $scope.drugResults = results;
    });
});
```

---

## 🎨 Design System Quick Reference

> Full spec in `assets/TransparenSee_Design_System.md`
> When writing HTML/CSS always reference this file for colors, fonts, spacing.

```css
/* Core CSS Variables — paste into Style Sheet record */
:root {
  --ts-teal:        #009688;
  --ts-teal-deep:   #007A72;
  --ts-teal-bright: #00BFA5;
  --ts-teal-light:  #E0F2F1;
  --ts-teal-ghost:  #F0FAFA;
  --ts-navy:        #0D1F4E;
  --ts-navy-mid:    #1A2B5E;
  --ts-gold:        #F59E0B;
  --ts-surface:     #F8FAFB;
  --ts-border:      #E2EAEB;
  --ts-shadow:      0 4px 24px rgba(0,122,114,0.08);
  --ts-radius-card: 20px;
  --ts-radius-pill: 9999px;
  --ts-font-display: 'Clash Display', 'DM Sans', sans-serif;
  --ts-font-body:    'Plus Jakarta Sans', 'Nunito', sans-serif;
  --ts-font-mono:    'DM Mono', monospace;
}
```

---

## ✅ Hackathon Rubric Checklist

Before finalizing, verify every item is implemented:

### Development (45%)
- [ ] **Business Rule** — `ts_flag_overprice` on `x_snc_transparensee_medicine` (before insert/update)
- [ ] **Client Script** — Live search autocomplete on Service Portal page
- [ ] **Integration Hub** — Spoke to OpenAI / Now Assist for AI Concierge
- [ ] **UI Action** — "Generate Price Report" button on drug detail
- [ ] **Notifications (Outbound)** — Email when pharmacy record is approved
- [ ] **Notifications (Inbound)** — Email-to-case for pharmacy submission requests
- [ ] **Approval via Email** — Pharmacy accreditation workflow with email approval
- [ ] **Flow Designer** — Search → AI tip → Log → Notify flow
- [ ] **Service Portal** — Full TransparenSee portal at `/transparensee`
- [ ] **User Criteria & Access Roles** — `dpri_patient` and `dpri_admin` roles + ACLs

### AI (15%)
- [ ] AI Concierge generates drug safety counsel per search
- [ ] Suggests generic alternatives with savings estimate
- [ ] Optional: Agentic AI bonus (AI triggers follow-up action, not just text)

### Portal Design (10%)
- [ ] Matches TransparenSee design system (teal/navy, bento grid, glass panels)
- [ ] Mobile responsive
- [ ] Logo displayed in navbar

### Solution to Problem (20%)
- [ ] DPRI 2025 real data imported (min 30 drugs)
- [ ] Pharmacy table with Cebu locations
- [ ] Price comparison showing peso savings vs hospital

### Presentation (10%)
- [ ] All 7 required slides (see references/11_presentation.md)
- [ ] Process flow diagram included
- [ ] Demo rehearsed and timed (5-7 min)

---

## 🔗 Reference Files Index

| File | Contents | Read When |
|---|---|---|
| `references/01_tables.md` | Full schema for all 4 tables | Creating/editing table structure |
| `references/02_script_includes.md` | DPRI_PriceEngine + PharmacyLocator code | Writing backend logic |
| `references/03_ui_pages.md` | Jelly wrapper + AngularJS page templates | Building frontend pages |
| `references/04_business_rules.md` | All business rule scripts | Setting up data validation |
| `references/05_client_scripts.md` | Search autocomplete + portal scripts | Client-side UI behavior |
| `references/06_ui_actions.md` | Generate Price Report + other UI actions | Adding buttons/actions |
| `references/07_flows.md` | Flow Designer steps + approval workflow | Automation & notifications |
| `references/08_portal.md` | Service Portal setup + widget config | Portal theming & pages |
| `references/09_integrations.md` | OpenAI + Now Assist REST calls | AI Concierge integration |
| `references/10_security.md` | ACL rules + role assignments | Security setup |
| `references/11_presentation.md` | Slide content + demo script | Presentation prep |
| `assets/TransparenSee_Design_System.md` | Full design spec | Any HTML/CSS work |
