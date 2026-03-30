# 01 — Table Schemas

## Table 1: `x_snc_transparensee_medicine`
**Label:** DPRI Medicine  
**Purpose:** Master drug price reference from DPRI 2025

| Column Label | Field Name | Type | Notes |
|---|---|---|---|
| Generic Name | `generic_name` | String (100) | e.g. "Amoxicillin" — indexed |
| Brand Names | `brand_names` | String (255) | e.g. "Amoxil, Trimox" — comma separated |
| Dosage Strength | `dosage_strength` | String (50) | e.g. "500mg" |
| Dosage Form | `dosage_form` | Choice | tablet, capsule, syrup, suspension, injection, topical, drops |
| Route | `route` | Choice | oral, topical, injection, ophthalmic |
| Category | `category` | Reference → `x_snc_transparensee_category` | |
| DPRI Price | `dpri_price` | Decimal (10,2) | Official max retail price in PHP |
| Hospital Avg Price | `hospital_avg_price` | Decimal (10,2) | Estimated hospital pharmacy price |
| Savings Percent | `savings_percent` | Integer | Auto-calculated by Business Rule |
| Is Generic | `is_generic` | True/False | Default: true |
| DPRI Reference Code | `dpri_ref_code` | String (30) | From DPRI 2025 PDF |
| Indications | `indications` | String (500) | What the drug treats |
| Warnings | `warnings` | String (500) | Side effects / warnings |
| Is Active | `is_active` | True/False | Default: true |
| Limited Stock | `limited_stock` | True/False | Flag for UI badge |

**Indexes:** `generic_name`, `category`, `dosage_form`  
**Access:** Read — `dpri_patient` | Write/Delete — `dpri_admin`

---

## Table 2: `x_snc_transparensee_pharmacy`
**Label:** Accredited Pharmacy  
**Purpose:** Pharmacy locations with GPS coordinates

| Column Label | Field Name | Type | Notes |
|---|---|---|---|
| Pharmacy Name | `name` | String (100) | e.g. "Southstar Drug - Ayala" |
| Chain | `chain` | Choice | southstar, generika, mercury, rose, generic_plus, other |
| Address | `address` | String (255) | Full street address |
| City | `city` | String (50) | Default: "Cebu City" |
| Latitude | `latitude` | Decimal (10,7) | GPS lat — used for Haversine |
| Longitude | `longitude` | Decimal (10,7) | GPS long — used for Haversine |
| Phone | `phone` | String (20) | |
| Is Accredited | `is_accredited` | True/False | DOH accreditation status |
| Accreditation Status | `accreditation_status` | Choice | pending, approved, rejected |
| Approved By | `approved_by` | Reference → sys_user | Admin who approved |
| Approval Date | `approval_date` | Date | |
| Is Active | `is_active` | True/False | |

**Access:** Read — `dpri_patient` | Write — `dpri_admin` | Approve — `dpri_admin`

---

## Table 3: `x_snc_transparensee_category`
**Label:** Drug Category  
**Purpose:** Drug classifications for filtering

| Column Label | Field Name | Type | Notes |
|---|---|---|---|
| Category Name | `name` | String (50) | e.g. "Antibiotic" |
| Description | `description` | String (255) | |
| Icon Code | `icon_code` | String (30) | Phosphor icon name |
| Color | `color` | String (7) | Hex color for UI pill tag |
| Sort Order | `sort_order` | Integer | Display order |

**Seed data to insert:**
```
Antibiotic        | #007A72 | sort: 1
Analgesic/Fever   | #F59E0B | sort: 2  
Antihypertensive  | #3949AB | sort: 3
Antidiabetic      | #558B2F | sort: 4
Vitamins/Minerals | #E65100 | sort: 5
Antihistamine     | #9D174D | sort: 6
Antacid/GI        | #0288D1 | sort: 7
```

---

## Table 4: `x_snc_transparensee_search_log`
**Label:** Search Log  
**Purpose:** Analytics — track what patients search for

| Column Label | Field Name | Type | Notes |
|---|---|---|---|
| Search Term | `search_term` | String (100) | What user typed |
| User | `user` | Reference → sys_user | May be anonymous |
| Result Count | `result_count` | Integer | How many results returned |
| Drug Selected | `drug_selected` | Reference → `x_snc_transparensee_medicine` | If user clicked a result |
| Report Generated | `report_generated` | True/False | Did user print a report |
| User Agent | `user_agent` | String (255) | Mobile vs desktop |
| Searched At | `searched_at` | DateTime | Auto: now() |

**Access:** Insert — all (including anonymous) | Read/Delete — `dpri_admin` only

---

## Sample DPRI Data (30 drugs for hackathon import)

Save as `dpri_2025_sample.csv` and import via System Import Sets:

```csv
generic_name,brand_names,dosage_strength,dosage_form,route,dpri_price,hospital_avg_price,category_name,is_generic,indications
Amoxicillin,Amoxil;Trimox;Moxatag,500mg,capsule,oral,120.00,450.00,Antibiotic,true,Bacterial infections
Amoxicillin,Amoxil Pediatric,250mg/5ml,suspension,oral,85.00,242.00,Antibiotic,true,Bacterial infections (pediatric)
Amoxicillin/Clavulanate,Augmentin,625mg,tablet,oral,340.00,793.00,Antibiotic,false,Resistant bacterial infections
Paracetamol,Biogesic;Tempra,500mg,tablet,oral,8.50,35.00,Analgesic/Fever,true,Fever and mild pain
Paracetamol,Biogesic Syrup,250mg/5ml,syrup,oral,55.00,120.00,Analgesic/Fever,true,Fever (pediatric)
Ibuprofen,Advil;Motrin,200mg,tablet,oral,12.00,45.00,Analgesic/Fever,true,Pain and inflammation
Mefenamic Acid,Ponstan,500mg,capsule,oral,14.50,65.00,Analgesic/Fever,true,Pain relief
Metformin,Glucophage,500mg,tablet,oral,6.50,28.00,Antidiabetic,true,Type 2 diabetes
Metformin,Glucophage XR,1000mg,tablet,oral,22.00,85.00,Antidiabetic,false,Type 2 diabetes (extended release)
Glibenclamide,Daonil,5mg,tablet,oral,3.25,15.00,Antidiabetic,true,Type 2 diabetes
Amlodipine,Norvasc,5mg,tablet,oral,12.00,68.00,Antihypertensive,true,High blood pressure
Amlodipine,Norvasc,10mg,tablet,oral,18.00,95.00,Antihypertensive,true,High blood pressure
Losartan,Cozaar,50mg,tablet,oral,18.50,75.00,Antihypertensive,true,High blood pressure
Enalapril,Vasotec,10mg,tablet,oral,8.75,38.00,Antihypertensive,true,High blood pressure and heart failure
Atorvastatin,Lipitor,20mg,tablet,oral,28.00,145.00,Antihypertensive,true,High cholesterol
Omeprazole,Losec,20mg,capsule,oral,15.00,65.00,Antacid/GI,true,Acid reflux and ulcers
Ranitidine,Zantac,150mg,tablet,oral,9.50,42.00,Antacid/GI,true,Heartburn and ulcers
Cetirizine,Zyrtec,10mg,tablet,oral,8.00,35.00,Antihistamine,true,Allergies
Loratadine,Claritin,10mg,tablet,oral,7.50,30.00,Antihistamine,true,Allergies and hives
Diphenhydramine,Benadryl,25mg,capsule,oral,6.00,28.00,Antihistamine,true,Allergies and sleep aid
Ascorbic Acid,Ceelin,500mg,tablet,oral,4.50,18.00,Vitamins/Minerals,true,Vitamin C supplement
Ferrous Sulfate,,325mg,tablet,oral,3.00,14.00,Vitamins/Minerals,true,Iron deficiency anemia
Vitamin B Complex,Becozyme,tablet,tablet,oral,5.50,22.00,Vitamins/Minerals,true,Vitamin B deficiency
Zinc Sulfate,,20mg,tablet,oral,4.00,18.00,Vitamins/Minerals,true,Zinc supplement
Azithromycin,Zithromax,500mg,tablet,oral,185.00,650.00,Antibiotic,true,Bacterial infections
Ciprofloxacin,Cipro,500mg,tablet,oral,28.00,125.00,Antibiotic,true,Urinary and bacterial infections
Cotrimoxazole,Bactrim,400/80mg,tablet,oral,7.50,32.00,Antibiotic,true,UTI and respiratory infections
Cloxacillin,,500mg,capsule,oral,22.00,95.00,Antibiotic,true,Skin and soft tissue infections
Salbutamol,Ventolin,2mg,tablet,oral,5.50,24.00,Other,true,Asthma and bronchospasm
Dexamethasone,,0.5mg,tablet,oral,2.75,18.00,Other,true,Inflammation and allergic reactions
```
