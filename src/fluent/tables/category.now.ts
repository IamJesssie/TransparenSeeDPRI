import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn } from '@servicenow/sdk/core'

// Creates category table for drug classification categories
export const x_1966129_transpar_category = Table({
    name: 'x_1966129_transpar_category',
    label: 'Drug Category',
    schema: {
        name: StringColumn({
            label: 'Category Name',
            maxLength: 100,
            mandatory: true,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 500,
        }),
        code: StringColumn({
            label: 'Category Code',
            maxLength: 20,
        }),
        sort_order: IntegerColumn({
            label: 'Sort Order',
            default: '100',
        }),
        active: StringColumn({
            label: 'Status',
            choices: {
                active: { label: 'Active', sequence: 0 },
                inactive: { label: 'Inactive', sequence: 1 },
            },
            dropdown: 'dropdown_without_none',
            default: 'active',
        }),
        parent_category: StringColumn({
            label: 'Parent Category',
            maxLength: 100,
        }),
    },
    display: 'name',
    extensible: false,
    accessibleFrom: 'public',
    actions: ['read', 'update', 'delete', 'create'],
    allowWebServiceAccess: true,
})
