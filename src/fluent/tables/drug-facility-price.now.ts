import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, IntegerColumn, ReferenceColumn } from '@servicenow/sdk/core'

// Maps a medicine to facility-level acquisition pricing entries from DPRI booklet exports.
export const x_1966129_transpar_drug_facility_price = Table({
    name: 'x_1966129_transpar_drug_facility_price',
    label: 'Drug Facility Price',
    schema: {
        medicine: ReferenceColumn({
            label: 'Medicine',
            referenceTable: 'x_1966129_transpar_medicine',
            mandatory: true
        }),
        pharmacy: ReferenceColumn({
            label: 'Pharmacy',
            referenceTable: 'x_1966129_transpar_pharmacy'
        }),
        facility_name: StringColumn({
            label: 'Facility Name',
            maxLength: 250,
            mandatory: true
        }),
        acquisition_price: DecimalColumn({
            label: 'Acquisition Price (P)',
            mandatory: true
        }),
        quantity: IntegerColumn({
            label: 'Quantity'
        }),
        brand: StringColumn({
            label: 'Brand',
            maxLength: 120
        }),
        manufacturer: StringColumn({
            label: 'Manufacturer',
            maxLength: 200
        }),
        supplier: StringColumn({
            label: 'Supplier',
            maxLength: 200
        }),
        source_ref: StringColumn({
            label: 'Source Reference',
            maxLength: 100
        })
    },
    display: 'facility_name',
    extensible: false,
    accessible_from: 'public',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    text_index: true
})
