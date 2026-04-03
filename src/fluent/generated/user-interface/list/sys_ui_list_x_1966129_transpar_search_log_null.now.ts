import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1966129_transpar_search_log',
    view: default_view,
    columns: [
        'ai_counsel_requested',
        'latitude',
        'longitude',
        'medicine_selected',
        'pharmacy_map_viewed',
        'price_report_generated',
        'results_count',
        'search_term',
        'search_timestamp',
        'search_type',
    ],
})
