import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample DPRI Medicine Records - Top 10 for testing
Record({
    $id: Now.ID['medicine_amoxicillin'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Amoxicillin',
        brand_names: 'Amoxil, Trimox, Moxatag',
        dosage_strength: '500mg',
        dosage_form: 'capsule',
        route: 'oral',
        dpri_price: 120.00,
        hospital_avg_price: 450.00,
        category: Now.ID['category_antibiotic'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AB-001',
        indications: 'Treatment of bacterial infections including respiratory tract infections, urinary tract infections, and skin infections',
        warnings: 'May cause allergic reactions in patients with penicillin allergy. Complete the full course as prescribed.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_paracetamol'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Paracetamol',
        brand_names: 'Biogesic, Tempra, Tylenol',
        dosage_strength: '500mg',
        dosage_form: 'tablet',
        route: 'oral',
        dpri_price: 8.50,
        hospital_avg_price: 35.00,
        category: Now.ID['category_analgesic'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AN-001',
        indications: 'Relief of mild to moderate pain and reduction of fever',
        warnings: 'Do not exceed recommended dose. Overdose can cause serious liver damage.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_metformin'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Metformin',
        brand_names: 'Glucophage, Diamet, Gluformin',
        dosage_strength: '500mg',
        dosage_form: 'tablet',
        route: 'oral',
        dpri_price: 6.50,
        hospital_avg_price: 28.00,
        category: Now.ID['category_antidiabetic'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AD-001',
        indications: 'Treatment of Type 2 diabetes mellitus to control blood sugar levels',
        warnings: 'Take with food to reduce stomach upset. Monitor blood sugar regularly.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_amlodipine'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Amlodipine',
        brand_names: 'Norvasc, Amtas, Amlodac',
        dosage_strength: '5mg',
        dosage_form: 'tablet',
        route: 'oral',
        dpri_price: 12.00,
        hospital_avg_price: 68.00,
        category: Now.ID['category_antihypertensive'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AH-001',
        indications: 'Treatment of high blood pressure and chest pain (angina)',
        warnings: 'May cause dizziness. Avoid sudden position changes. Monitor blood pressure.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_ibuprofen'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Ibuprofen',
        brand_names: 'Advil, Motrin, Medicol',
        dosage_strength: '200mg',
        dosage_form: 'tablet',
        route: 'oral',
        dpri_price: 12.00,
        hospital_avg_price: 45.00,
        category: Now.ID['category_analgesic'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AN-002',
        indications: 'Relief of pain, inflammation, and fever',
        warnings: 'Take with food. May cause stomach irritation. Not recommended for patients with stomach ulcers.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_cetirizine'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Cetirizine',
        brand_names: 'Zyrtec, Virlix, Cetirex',
        dosage_strength: '10mg',
        dosage_form: 'tablet',
        route: 'oral',
        dpri_price: 8.00,
        hospital_avg_price: 35.00,
        category: Now.ID['category_antihistamine'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AH-002',
        indications: 'Treatment of allergic reactions, hay fever, and hives',
        warnings: 'May cause drowsiness. Avoid alcohol and driving.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_azithromycin'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Azithromycin',
        brand_names: 'Zithromax, Azithral, Azimycin',
        dosage_strength: '500mg',
        dosage_form: 'tablet',
        route: 'oral',
        dpri_price: 185.00,
        hospital_avg_price: 650.00,
        category: Now.ID['category_antibiotic'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AB-002',
        indications: 'Treatment of respiratory tract infections, skin infections, and sexually transmitted infections',
        warnings: 'Complete the full course. May cause stomach upset and diarrhea.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_omeprazole'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Omeprazole',
        brand_names: 'Losec, Prilosec, Omez',
        dosage_strength: '20mg',
        dosage_form: 'capsule',
        route: 'oral',
        dpri_price: 15.00,
        hospital_avg_price: 65.00,
        category: Now.ID['category_antacid'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AG-001',
        indications: 'Treatment of acid reflux, stomach ulcers, and GERD',
        warnings: 'Take before meals. Long-term use may affect magnesium absorption.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_ascorbic_acid'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Ascorbic Acid',
        brand_names: 'Ceelin, Enervon-C, Cebion',
        dosage_strength: '500mg',
        dosage_form: 'tablet',
        route: 'oral',
        dpri_price: 4.50,
        hospital_avg_price: 18.00,
        category: Now.ID['category_vitamins'],
        is_generic: true,
        dpri_ref_code: 'DPRI-VM-001',
        indications: 'Vitamin C supplementation and immune system support',
        warnings: 'High doses may cause stomach upset. Generally safe for most people.',
        is_active: true,
        limited_stock: false,
    },
})

Record({
    $id: Now.ID['medicine_losartan'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Losartan',
        brand_names: 'Cozaar, Angioten, Lifezar',
        dosage_strength: '50mg',
        dosage_form: 'tablet',
        route: 'oral',
        dpri_price: 18.50,
        hospital_avg_price: 75.00,
        category: Now.ID['category_antihypertensive'],
        is_generic: true,
        dpri_ref_code: 'DPRI-AH-003',
        indications: 'Treatment of high blood pressure and protection of kidneys in diabetic patients',
        warnings: 'Monitor blood pressure regularly. May cause dizziness or elevated potassium levels.',
        is_active: true,
        limited_stock: false,
    },
})