import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1966129_transpar_pharmacy',
    view: default_view,
    columns: [
        'name',
        'accreditation_status',
        'address',
        'approval_date',
        'approved_by',
        'chain',
        'city',
        'is_accredited',
        'is_active',
        'latitude',
    ],
})
