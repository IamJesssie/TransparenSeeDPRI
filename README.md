<div align="center">

<img src="https://raw.githubusercontent.com/IamJesssie/TransparenSeeDPRI/main/docs/assets/TransparenSee.png" alt="TransparenSee Logo" width="320"/>

# TransparenSee
### Pharmacy Price Transparency (DPRI) Concierge

**Bridging the gap between patients and affordable medicine.**

[![ServiceNow](https://img.shields.io/badge/Built%20on-ServiceNow-009688?style=for-the-badge&logo=servicenow&logoColor=white)](https://developer.servicenow.com)
[![DPRI 2025](https://img.shields.io/badge/Data-DPRI%202025-0D1F4E?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2Zy8+&logoColor=white)](https://dpri.doh.gov.ph)
[![Hackathon](https://img.shields.io/badge/EY%20GDS%20×%20ServiceNow-Hackathon%202025-F59E0B?style=for-the-badge)](https://github.com/IamJesssie/TransparenSeeDPRI)
[![Case](https://img.shields.io/badge/Case-PRBCS00034-10B981?style=for-the-badge)](https://github.com/IamJesssie/TransparenSeeDPRI)
[![Status](https://img.shields.io/badge/Status-In%20Progress-F59E0B?style=for-the-badge)](https://github.com/IamJesssie/TransparenSeeDPRI)

---

*"Last year, a minimum wage worker in Cebu spent ₱450 on Amoxicillin.*
*The government already set the fair price at ₱120. She just didn't know it existed.*
***TransparenSee changes that."***

---

[🔍 Features](#-features) · [🏗️ Architecture](#-architecture) · [🚀 Getting Started](#-getting-started) · [📱 Pages](#-pages) · [🔐 Security](#-security) · [👥 Team](#-team)

</div>

---

## 📌 Overview

**TransparenSee** is a ServiceNow-powered web portal that puts the Philippine Department of Health's **Drug Price Reference Index (DPRI 2025)** directly in the hands of patients. Built as a scoped ServiceNow application, it allows any Filipino patient to:

- 🔍 **Search** any drug and see official DPRI reference price benchmarks (lowest/median/highest)
- 📍 **Find** nearby DOH-accredited pharmacies/facilities using real geolocation
- 🤖 **Get AI counsel** from a built-in pharmacist assistant (via Gemini API integration)
- 📄 **Generate** a printable price report with DPRI references and nearby accredited options

> Note: "nearest cheapest" ranking is based on available mapped accredited facility records and DPRI reference data.

> **Hackathon:** ALPS Batch 2 · EY GDS × ServiceNow · Case PRBCS00034 · Health Sector
> **Team:** TransparenSee · G6 · Cebu Institute of Technology - University

---

## 🧩 The Problem

The Philippine DOH maintains the **Drug Price Reference Index (DPRI)** — an official public reference benchmark for essential medicine pricing. The reality:

| The Gap | The Impact |
|---|---|
| Most patients don't know DPRI exists | Patients pay up to **300% more** than the fair price |
| No digital interface for ordinary Filipinos | Minimum wage earners spend a significant portion of daily wage on one prescription |
| No way to locate nearest accredited pharmacy | Patients buy expensive drugs out of exhaustion, not necessity |
| Medical jargon is inaccessible | Generic equivalents (equally safe, far cheaper) go unused |

---

## ✨ Features

### 🔍 Smart Drug Search
- Live autocomplete search as you type — powered by **GlideAjax + AngularJS**
- Results show DPRI benchmark prices (lowest/median/highest), brand names, dosage form, and savings context
- Filter by drug category, dosage form, and generic-only toggle
- Clinical recommendation banner for generic alternatives

### 📍 Pharmacy Geolocation Map
- HTML5 GPS detection of patient location
- **Haversine formula** distance calculation to accredited pharmacies/facilities
- Interactive Leaflet.js map with custom teal pharmacy pins
- Sorted list: nearest first, with distance in km and mapped acquisition price where available

### 🤖 AI Pharmacist Concierge
- Powered by **Google Gemini API** via ServiceNow Integration Hub
- Generates personalized drug safety counsel in simple Filipino/English (Taglish)
- Warns if a drug's common retail price exceeds DPRI
- Suggests safe generic alternatives with estimated savings

### 📄 Price Report Generator
- One-click printable PDF summary
- Includes: Drug name, DPRI benchmark prices, nearest accredited options, AI safety note, DPRI 2025 official citation
- Patients can show this report to any pharmacist as price reference

### 🔔 Automated Workflows
- Pharmacy accreditation approval via email (Flow Designer)
- Inbound email submission for pharmacy registration requests
- Admin notifications for new pharmacy submissions
- Search activity logging for analytics

---

## 🏗️ Architecture

```
x_1966129_transparensee (Scoped Application)
│
├── 📊 Data Layer
│   ├── x_1966129_transparensee_medicine      → DPRI drug price records
│   ├── x_1966129_transparensee_pharmacy      → Accredited pharmacy locations
│   ├── x_1966129_transparensee_drug_facility_price → Drug-to-facility acquisition price mapping
│   ├── x_1966129_transparensee_category      → Drug classification categories
│   └── x_1966129_transparensee_search_log    → Patient search analytics
│
├── 🧠 Business Logic
│   ├── DPRI_PriceEngine (Script Include)  → Drug search + GlideAjax API
│   ├── PharmacyLocator (Script Include)   → Haversine geolocation + nearest-by-drug lookup
│   └── AI_Concierge (Script Include)      → Gemini REST integration
│
├── ⚙️ Automation
│   ├── Business Rule: ts_calculate_savings     → Auto-calc savings %
│   ├── Business Rule: ts_flag_overprice        → Price validation guard
│   ├── Business Rule: ts_pharmacy_approval     → Triggers approval flow
│   ├── Flow: ts_drug_search_flow               → Search → AI → Log → Notify
│   └── Flow: ts_pharmacy_approval_flow         → Approval via email
│
├── 🎨 Frontend (UI Pages — Jelly + AngularJS)
│   ├── transparensee_home.do        → Hero search portal
│   ├── transparensee_search.do      → Results with filters
│   ├── transparensee_detail.do      → Drug detail + AI panel
│   ├── transparensee_map.do         → Pharmacy map view
│   ├── transparensee_report.do      → Printable price report
│   └── transparensee_admin.do       → Admin dashboard
│
├── 🔐 Security
│   ├── Role: dpri_patient            → Read access (all portal users)
│   └── Role: dpri_admin              → Full CRUD + approvals
│
└── 🔗 Integrations
    ├── gemini API (via RESTMessageV2)  → AI Concierge
    └── HTML5 Geolocation API           → Patient location detection
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Platform** | ServiceNow (Scoped Application) |
| **IDE** | ServiceNow Extension for VS Code |
| **Frontend** | AngularJS + Jelly (UI Pages) |
| **Backend** | Server-side JavaScript (ES5) — Script Includes |
| **Database** | ServiceNow Tables (GlideRecord) |
| **Maps** | Leaflet.js + OpenStreetMap |
| **AI** | Gemini API via Integration Hub |
| **Styling** | Custom CSS (Clash Display + Plus Jakarta Sans + DM Mono) |
| **Data Source** | DPRI 2025 PDF/CSV → ServiceNow Import Set |
| **Version Control** | Git + Github |

---

## 🚀 Getting Started

### Prerequisites

- ServiceNow Developer Instance ([Free signup](https://developer.servicenow.com)) — **Xanadu release or later**
- [VS Code](https://code.visualstudio.com/) with [ServiceNow Extension](https://marketplace.visualstudio.com/items?itemName=ServiceNow.servicenow-vscode-extension)
- Gemini API Key (for AI Concierge feature)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/IamJesssie/TransparenSeeDPRI.git
cd TransparenSeeDPRI
```

### 2.Install Dependencies
- This project uses the modern ServiceNow Fluent SDK. You must install the required Node modules before building.

```
# Open your terminal in the project folder and run:
npm install
```

### 3. Connect to Your ServiceNow Instance
- Authenticate the ServiceNow SDK with your developer instance credentials via the terminal:
```
# Add your instance connection (replace with your instance URL)
npx now-sdk auth --add https://devXXXXXX.service-now.com --type basic --alias mydev

# Set it as your default profile
npx now-sdk auth --use mydev
```

### 4. Build and Deploy
- Compile the TypeScript/React code and push it directly to your ServiceNow instance:
```
# To build the application locally:
npm run build

# To build and deploy to your instance:
npm run deploy
```
### 5. Import DPRI Drug Data
```
1. Download the sample CSV from /data/dpri_2025_sample.csv (if applicable) or prepare your DPRI dataset.

2. In your ServiceNow instance, go to: System Import Sets → Load Data

3. Upload the CSV file

4. Run Transform Map A to target x_1966129_transpar_medicine (drug benchmark fields).

5. Run Transform Map B to target x_1966129_transpar_drug_facility_price (facility-level acquisition rows).

6. Verify data at: x_1966129_transpar_medicine.list and x_1966129_transpar_drug_facility_price.list


```
### 6. Configure Gemini API Integration
1. Go to System Properties → New

>Name: x_1966129_transpar.gemini_api_key

>Value: your-gemini-api-key-here

2. Go to System Web Services → REST Messages → Gemini_API

Verify endpoint points to the standard Google Gemini generation URL.

### 7. Seed Pharmacy Locations (Cebu)

```
Run the background script at:
/scripts/seed_cebu_pharmacies.js

This inserts 10+ Cebu City pharmacy locations with GPS coordinates.
```

### 8. Access the Portal

```
[https://devXXXXXX.service-now.com/transparensee](https://devXXXXXX.service-now.com/x_1966129_transpar_home.do)
```

---

## 📱 Pages

| Page | URL | Description |
|---|---|---|
| **Home** | `/x_1966129_transpar_home.do` | Hero search portal with live autocomplete |
| **Search Results** | `/x_1966129_transpar_search.do` | Drug results with filters and savings badges |
| **Drug Detail** | `/x_1966129_transpar_detail.do` | Full drug info + AI Concierge panel |
| **Pharmacy Map** | `/x_1966129_transpar_map.do` | Geolocation map sorted by distance, with mapped prices when available |
| **Price Report** | `/transparensee/report/{id}` | Printable patient price report |
| **Admin Dashboard** | `/transparensee/admin` | `dpri_admin` only — data management |

---

## 🔐 Security

### Roles

| Role | Access Level | Who Gets It |
|---|---|---|
| `x_1966129_transpar.dpri_patient` | Read all drugs + pharmacies · Create search logs | All portal users |
| `x_1966129_transpar.dpri_admin` | Full CRUD · Approve pharmacies · View analytics | Admin team |

### ACL Summary

| Table | Patient | Admin |
|---|---|---|
| `dpri_medicine` | Read only | Full CRUD |
| `dpri_pharmacy` | Read (approved only) | Full CRUD + Approve |
| `dpri_category` | Read only | Full CRUD |
| `dpri_search_log` | Create only (anonymous) | Read + Delete |

---

## 📊 Data: DPRI 2025

Drug price data is sourced from the official **Philippine Department of Health Drug Price Reference Index 2025**.

- **Source:** [dpri.doh.gov.ph](https://dpri.doh.gov.ph/downloads/DPRI-2025-Booklet-asofOctober7.pdf)
- **Import format:** CSV via ServiceNow Import Sets (drug benchmark + facility mapping)
- **Sample dataset:** 30 most common drugs (Amoxicillin, Paracetamol, Metformin, Amlodipine, etc.)
- **Update frequency:** DPRI is updated annually by DOH

```
Sample Data Preview:
┌─────────────────────┬──────────────┬────────────────┬────────────┬─────────────┐
│ Generic Name        │ Form         │ Strength       │ DPRI Price │ Hospital Avg│
├─────────────────────┼──────────────┼────────────────┼────────────┼─────────────┤
│ Amoxicillin         │ Capsule      │ 500mg          │ ₱120.00    │ ₱450.00     │
│ Paracetamol         │ Tablet       │ 500mg          │ ₱8.50      │ ₱35.00      │
│ Metformin           │ Tablet       │ 500mg          │ ₱6.50      │ ₱28.00      │
│ Amlodipine          │ Tablet       │ 5mg            │ ₱12.00     │ ₱68.00      │
│ Azithromycin        │ Tablet       │ 500mg          │ ₱185.00    │ ₱650.00     │
└─────────────────────┴──────────────┴────────────────┴────────────┴─────────────┘
```

---

## 🧪 Hackathon Requirements Coverage

Validated snapshot (as of 2026-04-04): Home and Search flows are working and tested in-instance; remaining items below are tracked in docs/checklist/FRS/SRS/USESCASES.md.

| Requirement | Component | Status |
|---|---|---|
| ✅ Scoped Application | `x_1966129_transpar` | ✅ Done |
| ⬜ Stored in Update Set | TransparenSee v1.0 Update Set | 🔧 In Progress |
| ✅ Client Scripts | Live search autocomplete | ✅ Done |
| ⬜ Business Rules | Price validation + savings calc | 🔧 In Progress |
| ⬜ UI Action | Generate Price Report button | 🔧 In Progress |
| ⬜ Notifications (Outbound) | Pharmacy approval email | 🔧 In Progress |
| ⬜ Notifications (Inbound) | Email-to-pharmacy submission | 🔧 In Progress |
| ⬜ Approval via Email | Pharmacy accreditation flow | 🔧 In Progress |
| ⬜ Integration Hub (API) | Gemini AI Concierge spoke | 🔧 In Progress |
| ⬜ Flow Designer | Search → AI → Log → Notify | 🔧 In Progress |
| ⬜ Service Portal | `/transparensee` portal | 🔧 In Progress |
| ✅ User Criteria & Roles | `dpri_patient` + `dpri_admin` | ✅ Done |
| ⬜ AI Integration | Gemini pharmacist counsel | 🔧 In Progress |

---

## 🗺️ User Journey: Maria's Story

```
👩 Maria's child has a bacterial infection.
   Doctor prescribes: Amoxicillin 500mg

   WITHOUT TransparenSee:                WITH TransparenSee:
   ┌─────────────────────────┐           ┌────────────────────────────┐
   │ Hospital pharmacy       │           │ Opens TransparenSee portal │
   │ quotes ₱450             │    vs     │ Types "Amoxicillin"        │
   │ Nearby generics closed  │           │ Sees DPRI price: ₱120.00   │
   │ Buys expensive drug     │           │ AI says: safe to use       │
   │ out of exhaustion 😞    │           │ Map shows pharmacy 0.3km   │
   └─────────────────────────┘           │ Saves ₱330 on one visit 🎉 │
                                         └────────────────────────────┘
```

---

## 📁 Repository Structure

```
TransparenSeeDPRI/
├── now.config.json
├── now.prebuild.mjs
├── package.json
├── docs/
│   ├── assets/
│   │   └── TransparenSee_Design_System.md
│   ├── checklist/
│   └── references/
├── src/
│   ├── assets
│   ├── client/
│   │   ├── app.css
│   │   ├── app.jsx
│   │   ├── index.html
│   │   ├── main.jsx
│   │   ├── css/
│   │   └── ui-pages/
│   │       ├── transparensee-home.html / transparensee-home.js
│   │       ├── transparensee-search.html / transparensee-search.js
│   │       ├── transparensee-detail.html / transparensee-detail.js
│   │       ├── transparensee-map.html / transparensee-map.js
│   │       └── transparensee-profile.html / transparensee-profile.js
│   ├── server/
│   │   ├── business-rules/
│   │   │   └── calculate-savings.js
│   │   └── script-includes/
│   │       ├── dpri-price-engine.js
│   │       ├── pharmacy-locator.js
│   │       └── ai-concierge.js
│   └── fluent/
│       ├── index.now.ts
│       ├── acls/
│       │   └── table-security.now.ts
│       ├── business-rules/
│       │   └── calculate-savings.now.ts
│       ├── roles/
│       │   └── dpri-roles.now.ts
│       ├── script-includes/
│       │   ├── dpri-price-engine.now.ts
│       │   ├── pharmacy-locator.now.ts
│       │   └── ai-concierge.now.ts
│       ├── tables/
│       │   ├── medicine.now.ts
│       │   ├── pharmacy.now.ts
│       │   ├── category.now.ts
│       │   ├── search-log.now.ts
│       │   └── drug-facility-price.now.ts
│       └── records/
│           ├── medicines.now.ts
│           ├── medicines-top.now.ts
│           ├── categories.now.ts
│           ├── pharmacies.now.ts
│           └── drug-facility-prices.now.ts
└── target/
```

---

## 👥 Team

**TransparenSee · G6 · ALPS Batch 2**

| Member | GitHub |
|---|---|
| Jessie Noel Lapure | [@IamJesssie](https://github.com/IamJesssie) |
| Josephjames Banico | |
| Michaelgrant Libato |  |
| Raymart Ruperez |  |
| Axcel Macansantos |  |

> 📍 Cebu Institute of Technology - University · BS Information Technology  
> 🏢 EY GDS × ServiceNow Hackathon · Health Sector · Case PRBCS00034

---

## 🙏 Acknowledgments

- **Philippine Department of Health** — for maintaining the DPRI 2025 public data
- **EY GDS Philippines** — for the hackathon opportunity and mentorship
- **ServiceNow** — developer instance and platform
- **Gemini** — API powering the AI Concierge
- **Leaflet.js + OpenStreetMap** — open-source mapping

---

## 📄 License

This project is currently under active development as part of the **ALPS Batch 2 EY GDS × ServiceNow Hackathon**. Licensing will be finalized upon project completion.

> ⚠️ Drug price data is sourced from the official DPRI 2025 (DOH Philippines) and is for reference only.  
> Always consult a licensed pharmacist or physician for medical advice.

---

<div align="center">

**Made with 💊 and ☕ in Cebu City, Philippines**

*TransparenSee — Because every Filipino deserves to know the fair price of their medicine.*

[![GitHub](https://img.shields.io/badge/GitHub-IamJesssie-0D1F4E?style=flat-square&logo=github)](https://github.com/IamJesssie/TransparenSeeDPRI)
[![ServiceNow](https://img.shields.io/badge/ServiceNow-Xanadu-009688?style=flat-square&logo=servicenow&logoColor=white)](https://developer.servicenow.com)
[![DOH DPRI](https://img.shields.io/badge/Data-DOH%20DPRI%202025-10B981?style=flat-square)](https://dpri.doh.gov.ph)
[![Status](https://img.shields.io/badge/Status-In%20Progress-F59E0B?style=flat-square)](https://github.com/IamJesssie/TransparenSeeDPRI)

</div>
