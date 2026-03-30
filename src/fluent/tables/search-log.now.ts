import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, ReferenceColumn, IntegerColumn } from '@servicenow/sdk/core'

// Creates search log table for patient search analytics
export const x_1966129_transpar_search_log = Table({
    name: 'x_1966129_transpar_search_log',
    label: 'Search Log',
    schema: {
        search_term: StringColumn({ 
            label: 'Search Term', 
            maxLength: 200,
            mandatory: true 
        }),
        search_type: StringColumn({
            label: 'Search Type',
            choices: {
                drug_name: { label: 'Drug Name', sequence: 0 },
                category: { label: 'Category', sequence: 1 },
                brand: { label: 'Brand Name', sequence: 2 },
                generic: { label: 'Generic Name', sequence: 3 }
            },
            dropdown: 'dropdown_with_none',
            default: 'drug_name'
        }),
        results_count: IntegerColumn({ 
            label: 'Results Count',
            default: '0' 
        }),
        user_location: StringColumn({ 
            label: 'User Location', 
            maxLength: 200 
        }),
        latitude: StringColumn({ 
            label: 'User Latitude', 
            maxLength: 50 
        }),
        longitude: StringColumn({ 
            label: 'User Longitude', 
            maxLength: 50 
        }),
        session_id: StringColumn({ 
            label: 'Session ID', 
            maxLength: 100 
        }),
        search_timestamp: DateTimeColumn({ 
            label: 'Search Time',
            mandatory: true 
        }),
        medicine_selected: ReferenceColumn({ 
            label: 'Medicine Selected',
            referenceTable: 'x_1966129_transpar_medicine' 
        }),
        ai_counsel_requested: StringColumn({
            label: 'AI Counsel Requested',
            choices: {
                'true': { label: 'Yes', sequence: 0 },
                'false': { label: 'No', sequence: 1 }
            },
            dropdown: 'dropdown_without_none',
            default: 'false'
        }),
        pharmacy_map_viewed: StringColumn({
            label: 'Pharmacy Map Viewed',
            choices: {
                'true': { label: 'Yes', sequence: 0 },
                'false': { label: 'No', sequence: 1 }
            },
            dropdown: 'dropdown_without_none',
            default: 'false'
        }),
        price_report_generated: StringColumn({
            label: 'Price Report Generated',
            choices: {
                'true': { label: 'Yes', sequence: 0 },
                'false': { label: 'No', sequence: 1 }
            },
            dropdown: 'dropdown_without_none',
            default: 'false'
        })
    },
    display: 'search_term',
    extensible: false,
    accessible_from: 'public',
    actions: ['create', 'read'],
    allow_web_service_access: true,
    text_index: true
})