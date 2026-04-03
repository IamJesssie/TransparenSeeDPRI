import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['facility_price_amox_mercury_ayala'],
    table: 'x_1966129_transpar_drug_facility_price',
    data: {
        medicine: Now.ID['medicine_amoxicillin'],
        pharmacy: Now.ID['pharmacy_mercury_ayala'],
        facility_name: 'Mercury Drug Ayala Center Cebu',
        acquisition_price: 118.00,
        quantity: 200,
        brand: 'Amoxil',
        manufacturer: 'GSK',
        supplier: 'Zuellig Pharma',
        source_ref: 'DPRI-2025-SAMPLE-001'
    }
})

Record({
    $id: Now.ID['facility_price_amox_generika_itpark'],
    table: 'x_1966129_transpar_drug_facility_price',
    data: {
        medicine: Now.ID['medicine_amoxicillin'],
        pharmacy: Now.ID['pharmacy_generika_itpark'],
        facility_name: 'Generika IT Park Cebu',
        acquisition_price: 112.00,
        quantity: 150,
        brand: 'Generic Amoxicillin',
        manufacturer: 'Pascual Labs',
        supplier: 'Pascual Distribution',
        source_ref: 'DPRI-2025-SAMPLE-002'
    }
})

Record({
    $id: Now.ID['facility_price_para_rose_capitol'],
    table: 'x_1966129_transpar_drug_facility_price',
    data: {
        medicine: Now.ID['medicine_paracetamol'],
        pharmacy: Now.ID['pharmacy_rose_capitol'],
        facility_name: 'Rose Pharmacy Capitol',
        acquisition_price: 7.80,
        quantity: 500,
        brand: 'Biogesic',
        manufacturer: 'Unilab',
        supplier: 'Metro Drug Distribution',
        source_ref: 'DPRI-2025-SAMPLE-003'
    }
})
