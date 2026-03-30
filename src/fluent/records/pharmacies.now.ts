import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Sample Pharmacy Locations in Cebu City
Record({
    $id: Now.ID['pharmacy_mercury_ayala'],
    table: 'x_1966129_transpar_pharmacy',
    data: {
        name: 'Mercury Drug - Ayala Center Cebu',
        chain: 'mercury',
        address: 'Ground Floor, Ayala Center Cebu, Cebu Business Park, Cebu City, Cebu 6000',
        city: 'Cebu City',
        latitude: 10.3181,
        longitude: 123.9065,
        phone: '(032) 231-0515',
        is_accredited: true,
        accreditation_status: 'approved',
        is_active: true,
    },
})

Record({
    $id: Now.ID['pharmacy_generika_itpark'],
    table: 'x_1966129_transpar_pharmacy',
    data: {
        name: 'Generika Drugstore - IT Park',
        chain: 'generika',
        address: 'Ground Floor, Aboitiz Corporate Center, Governor Manuel Cuenco Ave, Lahug, Cebu City, Cebu 6000',
        city: 'Cebu City',
        latitude: 10.3268,
        longitude: 123.9063,
        phone: '(032) 520-8899',
        is_accredited: true,
        accreditation_status: 'approved',
        is_active: true,
    },
})

Record({
    $id: Now.ID['pharmacy_rose_capitol'],
    table: 'x_1966129_transpar_pharmacy',
    data: {
        name: 'Rose Pharmacy - Capitol Site',
        chain: 'rose',
        address: 'Capitol Site, Cebu City, Cebu 6000',
        city: 'Cebu City',
        latitude: 10.3099,
        longitude: 123.8937,
        phone: '(032) 254-6677',
        is_accredited: true,
        accreditation_status: 'approved',
        is_active: true,
    },
})

Record({
    $id: Now.ID['pharmacy_southstar_sm'],
    table: 'x_1966129_transpar_pharmacy',
    data: {
        name: 'SouthStar Drug - SM City Cebu',
        chain: 'southstar',
        address: 'Ground Floor, SM City Cebu, North Reclamation Area, Cebu City, Cebu 6000',
        city: 'Cebu City',
        latitude: 10.3115,
        longitude: 123.9019,
        phone: '(032) 231-0923',
        is_accredited: true,
        accreditation_status: 'approved',
        is_active: true,
    },
})

Record({
    $id: Now.ID['pharmacy_watsons_galleria'],
    table: 'x_1966129_transpar_pharmacy',
    data: {
        name: 'Watsons - Robinson\'s Galleria Cebu',
        chain: 'watsons',
        address: 'Ground Floor, Robinsons Galleria Cebu, General Maxilom Avenue, Cebu City, Cebu 6000',
        city: 'Cebu City',
        latitude: 10.3203,
        longitude: 123.8967,
        phone: '(032) 412-4588',
        is_accredited: true,
        accreditation_status: 'approved',
        is_active: true,
    },
})

Record({
    $id: Now.ID['pharmacy_mercury_colon'],
    table: 'x_1966129_transpar_pharmacy',
    data: {
        name: 'Mercury Drug - Colon Street',
        chain: 'mercury',
        address: 'Colon Street, Downtown, Cebu City, Cebu 6000',
        city: 'Cebu City',
        latitude: 10.2958,
        longitude: 123.9019,
        phone: '(032) 254-3456',
        is_accredited: true,
        accreditation_status: 'approved',
        is_active: true,
    },
})

Record({
    $id: Now.ID['pharmacy_tgp_banilad'],
    table: 'x_1966129_transpar_pharmacy',
    data: {
        name: 'The Generics Pharmacy - Banilad',
        chain: 'generic_plus',
        address: 'Banilad Town Centre, Cebu City, Cebu 6000',
        city: 'Cebu City',
        latitude: 10.3445,
        longitude: 123.9127,
        phone: '(032) 234-5678',
        is_accredited: true,
        accreditation_status: 'approved',
        is_active: true,
    },
})

Record({
    $id: Now.ID['pharmacy_rose_lahug'],
    table: 'x_1966129_transpar_pharmacy',
    data: {
        name: 'Rose Pharmacy - Lahug',
        chain: 'rose',
        address: 'JY Square Mall, Lahug, Cebu City, Cebu 6000',
        city: 'Cebu City',
        latitude: 10.3312,
        longitude: 123.9045,
        phone: '(032) 233-4567',
        is_accredited: true,
        accreditation_status: 'approved',
        is_active: true,
    },
})