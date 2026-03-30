# 10 — Security: ACLs + Roles

## Roles to Create

| Role Name | Description | Who Gets It |
|---|---|---|
| `dpri_patient` | Read-only access to medicines + pharmacies | All portal users |
| `dpri_admin` | Full CRUD + approve pharmacies + import data | Admin team members |

### How to Create Roles
`System Security → Roles → New`  
Name: `x_snc_transparensee.dpri_patient`  
Name: `x_snc_transparensee.dpri_admin`

---

## ACL Rules

### Medicine Table ACLs

| Operation | Role Required | Notes |
|---|---|---|
| Read | `dpri_patient` OR `dpri_admin` | Everyone can read drug prices |
| Create | `dpri_admin` | Only admin can add drugs |
| Write | `dpri_admin` | Only admin can edit |
| Delete | `dpri_admin` | Only admin can delete |

### Pharmacy Table ACLs

| Operation | Role Required |
|---|---|
| Read | `dpri_patient` OR `dpri_admin` |
| Create | `dpri_admin` |
| Write | `dpri_admin` |
| Delete | `dpri_admin` |

### Search Log Table ACLs

| Operation | Role Required | Script |
|---|---|---|
| Read | `dpri_admin` | Only admins see logs |
| Create | (none — allow all including guests) | Patients can log searches anonymously |
| Delete | `dpri_admin` | |

### Category Table ACLs
Read: `dpri_patient` | Write/Create/Delete: `dpri_admin`

---

## User Criteria for Service Portal

Create a User Criteria record:  
`Service Portal → User Criteria → New`  
- **Name:** TransparenSee Patients  
- **Match all:** Checked  
- **Roles:** `dpri_patient`  
- Apply to your portal pages

---

# 07 — Flow Designer

## Flow 1: `ts_drug_search_flow`
**Trigger:** Record Created on `x_snc_transparensee_search_log`  
**Purpose:** When a search is logged, optionally generate AI counsel if drug was selected

```
TRIGGER: Record Created — x_snc_transparensee_search_log

STEP 1 — Check Condition
  IF: [drug_selected] is not empty
  THEN: Continue to Step 2
  ELSE: End flow

STEP 2 — Get Drug Record
  Action: Look Up Record
  Table: x_snc_transparensee_medicine
  Filter: sys_id = [trigger.drug_selected]

STEP 3 — Call AI Concierge (Integration Hub spoke)
  Action: REST Step → OpenAI API
  Input: drug name + dpri price + indications from Step 2

STEP 4 — Send Notification (optional)
  Action: Send Email
  To: [trigger.user email if logged in]
  Template: "ts_drug_counsel_email"
```

---

## Flow 2: `ts_pharmacy_approval_flow`
**Trigger:** Record Updated on `x_snc_transparensee_pharmacy`  
**Condition:** `accreditation_status` changed to `pending`

```
TRIGGER: Record Updated — x_snc_transparensee_pharmacy
         Condition: accreditation_status changed to pending

STEP 1 — Ask for Approval (email)
  Action: Ask for Approval
  Approvers: Users with role dpri_admin
  Email subject: "New Pharmacy Submission: [name] awaiting accreditation"
  Approve label: "Accredit Pharmacy"
  Reject label: "Reject Submission"

STEP 2A (Approved) — Update Record
  Action: Update Record
  Set: accreditation_status = approved
  Set: approval_date = now

STEP 2B (Rejected) — Update Record
  Action: Update Record
  Set: accreditation_status = rejected

STEP 3 — Send Outbound Notification
  Action: Send Email
  Template: ts_pharmacy_decision_email
  To: submitter (if email was captured)
```

---

# 09 — Integration Hub: OpenAI REST

## RESTMessageV2 Setup

**Name:** `OpenAI_API`  
`System Web Services → Outbound → REST Message → New`

| Field | Value |
|---|---|
| Name | OpenAI_API |
| Endpoint | `https://api.openai.com/v1/chat/completions` |
| Authentication Type | No Authentication (we set header manually) |

**HTTP Method Record:** `generate_counsel`  
| Field | Value |
|---|---|
| HTTP Method | POST |
| Endpoint | (inherits from parent) |

**HTTP Headers:**
```
Authorization: Bearer ${openai_api_key}
Content-Type: application/json
```

**HTTP Request Body:**
```json
{
  "model": "gpt-3.5-turbo",
  "max_tokens": 150,
  "messages": [
    {
      "role": "user",
      "content": "${prompt}"
    }
  ]
}
```

**MID Server:** None (direct outbound)  
**Store API key in:** System Properties → `x_snc_transparensee.openai_api_key`

---

## Calling from AI_Concierge Script Include

```javascript
// Read API key from system property (never hardcode!)
var apiKey = gs.getProperty('x_snc_transparensee.openai_api_key', '');
var rm = new sn_ws.RESTMessageV2('OpenAI_API', 'generate_counsel');
rm.setStringParameterNoEscape('prompt', yourPromptString);
rm.setStringParameterNoEscape('openai_api_key', apiKey);
var response = rm.execute();
```

---

# 08 — Service Portal Quick Setup

## Portal Record
`Service Portal → Portals → New`  
| Field | Value |
|---|---|
| Title | TransparenSee |
| URL Suffix | `transparensee` |
| Theme | (custom — set after creating theme) |
| Homepage | `ts_home` page record |
| Logo | Upload TransparenSee logo |

## Theme Record
`Service Portal → Themes → New`  
| Field | Value |
|---|---|
| Name | TransparenSee Theme |
| CSS Variables | Paste from Design System `--ts-*` variables |
| Header | ts_navbar widget |

## Key Pages to Create
| Page ID | Title | Widget/Content |
|---|---|---|
| `ts_home` | Home | Home search widget |
| `ts_search` | Search Results | Results list widget |
| `ts_detail` | Drug Detail | Drug info + AI panel |
| `ts_map` | Pharmacy Map | Map widget |
| `ts_report` | Price Report | Printable report widget |
| `ts_admin` | Admin Dashboard | Admin panel (dpri_admin only) |

---

# 11 — Presentation Guide

## Required Slides (7 total)

1. **Title Slide**
   - Team name: TransparenSee
   - Members: 5 names + emails
   - Case: PRBCS00034 · Health · G6
   - Date

2. **Problem Statement**
   - DOH maintains DPRI — most patients don't know it exists
   - Same drug: ₱450 hospital vs ₱120 DPRI fair price
   - Stat: Minimum wage earner spends 15% of daily wage on one prescription

3. **Key Challenges**
   - Information gap: DPRI is a PDF nobody reads
   - No geolocation: patients don't know which pharmacy is nearest
   - No guidance: patients don't know if generics are safe substitutes
   - Language barrier: medical terms not accessible to non-professionals

4. **Proposed Solution**
   - TransparenSee: a ServiceNow-powered search + counsel + map portal
   - Maria's journey: 4 steps from problem to solved in under 2 minutes

5. **Solution Process Flow Diagram**
   ```
   Patient Searches Drug
        ↓
   DPRI_PriceEngine queries medicine table
        ↓
   Results show DPRI price + savings % vs hospital
        ↓
   AI Concierge generates safety counsel
        ↓
   PharmacyLocator shows 3 nearest accredited stores
        ↓
   Patient generates printable Price Report
        ↓
   Flow logs search → sends confirmation email
   ```

6. **Key Benefits**
   - Up to 65% savings on essential medicines
   - AI-powered safety counsel (no pharmacist queue)
   - Real government DPRI 2025 data — not estimates
   - Works on any smartphone browser — no app install

7. **Demo**
   - Open: `devXXX.service-now.com/transparensee`
   - Type "Amoxicillin" → show results with prices
   - Click drug → show AI counsel panel
   - Click "Find Nearest Pharmacy" → show map
   - Click "Generate Price Report" → show printout

## Demo Script (5-7 minutes)

```
0:00 — Opening hook
"Last year, a minimum wage worker in Cebu spent ₱450 on Amoxicillin.
The government already set the fair price at ₱120. She just didn't know it existed.
TransparenSee changes that."

0:30 — Show the app homepage
Walk through the hero, stats, popular searches

1:00 — Live search: type "Amoxicillin"
Point out: DPRI price, savings badge, generic alternatives

2:00 — Click drug detail
Show: AI pharmacist counsel generated live, price comparison chart

3:00 — Click Find Nearest Pharmacy
Show: Map with pharmacy pins, sorted by distance in km

4:00 — Generate Price Report
Show: Printable PDF with drug info, pharmacies, AI note, DPRI stamp

5:00 — Show admin panel briefly
Tables, search logs, pharmacy accreditation approval workflow

6:00 — Closing
"TransparenSee doesn't just show prices. It empowers every Filipino patient
with the knowledge they deserve — in their language, on their phone, for free."
```
