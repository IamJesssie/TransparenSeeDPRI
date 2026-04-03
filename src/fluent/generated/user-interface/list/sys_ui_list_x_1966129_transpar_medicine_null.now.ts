import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1966129_transpar_medicine',
    view: default_view,
    columns: [
        'active',
        'brand_name',
        'category',
        'description',
        'dpri_price',
        'form',
        'generic_name',
        'hospital_avg_price',
        'savings_amount',
        'savings_percentage',
    ],
})
