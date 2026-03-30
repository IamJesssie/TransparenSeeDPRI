import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Drug Categories - Seed Data
Record({
    $id: Now.ID['category_antibiotic'],
    table: 'x_1966129_transpar_category',
    data: {
        name: 'Antibiotic',
        description: 'Medicines that fight bacterial infections',
        icon_code: 'shield-check',
        color: '#007A72',
        sort_order: 1,
    },
})

Record({
    $id: Now.ID['category_analgesic'],
    table: 'x_1966129_transpar_category', 
    data: {
        name: 'Analgesic/Fever',
        description: 'Pain relievers and fever reducers',
        icon_code: 'thermometer',
        color: '#F59E0B',
        sort_order: 2,
    },
})

Record({
    $id: Now.ID['category_antihypertensive'],
    table: 'x_1966129_transpar_category',
    data: {
        name: 'Antihypertensive', 
        description: 'Blood pressure and heart medications',
        icon_code: 'heart',
        color: '#3949AB',
        sort_order: 3,
    },
})

Record({
    $id: Now.ID['category_antidiabetic'],
    table: 'x_1966129_transpar_category',
    data: {
        name: 'Antidiabetic',
        description: 'Diabetes management medications', 
        icon_code: 'drop',
        color: '#558B2F',
        sort_order: 4,
    },
})

Record({
    $id: Now.ID['category_vitamins'],
    table: 'x_1966129_transpar_category',
    data: {
        name: 'Vitamins/Minerals',
        description: 'Nutritional supplements and vitamins',
        icon_code: 'leaf',
        color: '#E65100', 
        sort_order: 5,
    },
})

Record({
    $id: Now.ID['category_antihistamine'],
    table: 'x_1966129_transpar_category',
    data: {
        name: 'Antihistamine',
        description: 'Allergy and anti-inflammatory medicines',
        icon_code: 'eye-closed',
        color: '#9D174D',
        sort_order: 6,
    },
})

Record({
    $id: Now.ID['category_antacid'],
    table: 'x_1966129_transpar_category',
    data: {
        name: 'Antacid/GI', 
        description: 'Stomach, acid reflux, and digestive medicines',
        icon_code: 'stomach',
        color: '#0288D1',
        sort_order: 7,
    },
})