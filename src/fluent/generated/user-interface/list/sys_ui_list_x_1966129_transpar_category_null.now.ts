import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_1966129_transpar_category',
    view: default_view,
    columns: ['name', 'active', 'code', 'description', 'parent_category', 'sort_order'],
})
