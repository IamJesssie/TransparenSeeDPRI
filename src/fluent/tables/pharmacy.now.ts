import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, BooleanColumn, DateColumn } from '@servicenow/sdk/core'

// Creates pharmacy table for accredited pharmacy locations
export const x_1966129_transpar_pharmacy = Table({
    name: 'x_1966129_transpar_pharmacy',
    label: 'Pharmacy Location',
    schema: {
        name: StringColumn({
            label: 'Pharmacy Name',
            maxLength: 200,
            mandatory: true,
        }),
        chain: StringColumn({
            label: 'Pharmacy Chain',
            choices: {
                mercury: { label: 'Mercury Drug', sequence: 0 },
                generika: { label: 'Generika Drugstore', sequence: 1 },
                rose: { label: 'Rose Pharmacy', sequence: 2 },
                southstar: { label: 'SouthStar Drug', sequence: 3 },
                watsons: { label: 'Watsons', sequence: 4 },
                generic_plus: { label: 'The Generics Pharmacy', sequence: 5 },
                other: { label: 'Other', sequence: 6 },
            },
            default: 'other',
            dropdown: 'dropdown_with_none',
        }),
        address: StringColumn({
            label: 'Address',
            maxLength: 500,
            mandatory: true,
        }),
        city: StringColumn({
            label: 'City',
            maxLength: 100,
            mandatory: true,
        }),
        latitude: DecimalColumn({
            label: 'Latitude',
            mandatory: true,
        }),
        longitude: DecimalColumn({
            label: 'Longitude',
            mandatory: true,
        }),
        phone: StringColumn({
            label: 'Phone Number',
            maxLength: 50,
        }),
        is_accredited: BooleanColumn({
            label: 'DOH Accredited',
            default: false,
        }),
        accreditation_status: StringColumn({
            label: 'Accreditation Status',
            choices: {
                pending: { label: 'Pending Approval', sequence: 0 },
                approved: { label: 'Approved', sequence: 1 },
                rejected: { label: 'Rejected', sequence: 2 },
            },
            default: 'pending',
            dropdown: 'dropdown_with_none',
        }),
        approved_by: StringColumn({
            label: 'Approved By',
            maxLength: 200,
        }),
        approval_date: DateColumn({
            label: 'Approval Date',
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true,
        }),
    },
    display: 'name',
    extensible: false,
    accessibleFrom: 'public',
    actions: ['read', 'update', 'delete', 'create'],
    allowWebServiceAccess: true,
    textIndex: true,
})
