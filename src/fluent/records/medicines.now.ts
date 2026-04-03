import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample DPRI Medicine Records - Top 10 for testing
Record({
    $id: Now.ID['medicine_amoxicillin'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Amoxicillin',
        brand_name: 'Amoxil, Trimox, Moxatag',
        strength: '500mg',
        form: 'capsule',
        dpri_price: 120.00,
        dpri_lowest_price: 110.00,
        dpri_median_price: 120.00,
        dpri_highest_price: 145.00,
        hospital_avg_price: 450.00,
        category: Now.ID['category_antibiotic'],
        description: 'Treatment of bacterial infections including respiratory tract infections, urinary tract infections, and skin infections',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_paracetamol'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Paracetamol',
        brand_name: 'Biogesic, Tempra, Tylenol',
        strength: '500mg',
        form: 'tablet',
        dpri_price: 8.50,
        dpri_lowest_price: 7.70,
        dpri_median_price: 8.50,
        dpri_highest_price: 12.00,
        hospital_avg_price: 35.00,
        category: Now.ID['category_analgesic'],
        description: 'Relief of mild to moderate pain and reduction of fever',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_metformin'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Metformin',
        brand_name: 'Glucophage, Diamet, Gluformin',
        strength: '500mg',
        form: 'tablet',
        dpri_price: 6.50,
        dpri_lowest_price: 5.90,
        dpri_median_price: 6.50,
        dpri_highest_price: 9.40,
        hospital_avg_price: 28.00,
        category: Now.ID['category_antidiabetic'],
        description: 'Treatment of Type 2 diabetes mellitus to control blood sugar levels',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_amlodipine'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Amlodipine',
        brand_name: 'Norvasc, Amtas, Amlodac',
        strength: '5mg',
        form: 'tablet',
        dpri_price: 12.00,
        dpri_lowest_price: 10.50,
        dpri_median_price: 12.00,
        dpri_highest_price: 16.20,
        hospital_avg_price: 68.00,
        category: Now.ID['category_antihypertensive'],
        description: 'Treatment of high blood pressure and chest pain (angina)',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_ibuprofen'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Ibuprofen',
        brand_name: 'Advil, Motrin, Medicol',
        strength: '200mg',
        form: 'tablet',
        dpri_price: 12.00,
        dpri_lowest_price: 11.00,
        dpri_median_price: 12.00,
        dpri_highest_price: 18.50,
        hospital_avg_price: 45.00,
        category: Now.ID['category_analgesic'],
        description: 'Relief of pain, inflammation, and fever',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_cetirizine'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Cetirizine',
        brand_name: 'Zyrtec, Virlix, Cetirex',
        strength: '10mg',
        form: 'tablet',
        dpri_price: 8.00,
        dpri_lowest_price: 7.20,
        dpri_median_price: 8.00,
        dpri_highest_price: 11.60,
        hospital_avg_price: 35.00,
        category: Now.ID['category_antihistamine'],
        description: 'Treatment of allergic reactions, hay fever, and hives',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_azithromycin'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Azithromycin',
        brand_name: 'Zithromax, Azithral, Azimycin',
        strength: '500mg',
        form: 'tablet',
        dpri_price: 185.00,
        dpri_lowest_price: 174.00,
        dpri_median_price: 185.00,
        dpri_highest_price: 220.00,
        hospital_avg_price: 650.00,
        category: Now.ID['category_antibiotic'],
        description: 'Treatment of respiratory tract infections, skin infections, and sexually transmitted infections',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_omeprazole'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Omeprazole',
        brand_name: 'Losec, Prilosec, Omez',
        strength: '20mg',
        form: 'capsule',
        dpri_price: 15.00,
        dpri_lowest_price: 13.80,
        dpri_median_price: 15.00,
        dpri_highest_price: 20.40,
        hospital_avg_price: 65.00,
        category: Now.ID['category_antacid'],
        description: 'Treatment of acid reflux, stomach ulcers, and GERD',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_ascorbic_acid'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Ascorbic Acid',
        brand_name: 'Ceelin, Enervon-C, Cebion',
        strength: '500mg',
        form: 'tablet',
        dpri_price: 4.50,
        dpri_lowest_price: 4.00,
        dpri_median_price: 4.50,
        dpri_highest_price: 6.20,
        hospital_avg_price: 18.00,
        category: Now.ID['category_vitamins'],
        description: 'Vitamin C supplementation and immune system support',
        active: 'active',
    },
})

Record({
    $id: Now.ID['medicine_losartan'],
    table: 'x_1966129_transpar_medicine',
    data: {
        generic_name: 'Losartan',
        brand_name: 'Cozaar, Angioten, Lifezar',
        strength: '50mg',
        form: 'tablet',
        dpri_price: 18.50,
        dpri_lowest_price: 17.00,
        dpri_median_price: 18.50,
        dpri_highest_price: 26.00,
        hospital_avg_price: 75.00,
        category: Now.ID['category_antihypertensive'],
        description: 'Treatment of high blood pressure and protection of kidneys in diabetic patients',
        active: 'active',
    },
})