import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, IntegerColumn, ReferenceColumn } from '@servicenow/sdk/core'

// Creates medicine table for DPRI drug price records
export const x_1966129_transpar_medicine = Table({
    name: 'x_1966129_transpar_medicine',
    label: 'Medicine (DPRI)',
    schema: {
        generic_name: StringColumn({ 
            label: 'Generic Name', 
            maxLength: 200,
            mandatory: true 
        }),
        brand_name: StringColumn({ 
            label: 'Brand Name', 
            maxLength: 200 
        }),
        form: StringColumn({ 
            label: 'Dosage Form', 
            maxLength: 100,
            choices: {
                tablet: { label: 'Tablet', sequence: 0 },
                capsule: { label: 'Capsule', sequence: 1 },
                syrup: { label: 'Syrup', sequence: 2 },
                suspension: { label: 'Suspension', sequence: 3 },
                injection: { label: 'Injection', sequence: 4 },
                cream: { label: 'Cream', sequence: 5 },
                ointment: { label: 'Ointment', sequence: 6 },
                drops: { label: 'Drops', sequence: 7 },
                powder: { label: 'Powder', sequence: 8 }
            },
            dropdown: 'dropdown_with_none'
        }),
        strength: StringColumn({ 
            label: 'Strength', 
            maxLength: 50 
        }),
        dpri_price: DecimalColumn({ 
            label: 'DPRI Fair Price (₱)', 
            mandatory: true 
        }),
        dpri_lowest_price: DecimalColumn({
            label: 'DPRI Lowest Price (₱)'
        }),
        dpri_median_price: DecimalColumn({
            label: 'DPRI Median Price (₱)'
        }),
        dpri_highest_price: DecimalColumn({
            label: 'DPRI Highest Price (₱)'
        }),
        hospital_avg_price: DecimalColumn({ 
            label: 'Hospital Average Price (₱)' 
        }),
        savings_amount: DecimalColumn({ 
            label: 'Savings Amount (₱)',
            read_only: true 
        }),
        savings_percentage: IntegerColumn({ 
            label: 'Savings Percentage (%)',
            read_only: true 
        }),
        category: ReferenceColumn({ 
            label: 'Drug Category',
            referenceTable: 'x_1966129_transpar_category' 
        }),
        description: StringColumn({ 
            label: 'Description', 
            maxLength: 1000 
        }),
        active: StringColumn({
            label: 'Status',
            choices: {
                active: { label: 'Active', sequence: 0 },
                inactive: { label: 'Inactive', sequence: 1 },
                discontinued: { label: 'Discontinued', sequence: 2 }
            },
            dropdown: 'dropdown_without_none',
            default: 'active'
        })
    },
    display: 'generic_name',
    extensible: false,
    accessible_from: 'public',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true,
    text_index: true
})