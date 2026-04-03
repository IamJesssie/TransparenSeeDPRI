import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['calculate_savings_rule'],
    name: 'Calculate Savings Percentage',
    table: 'x_1966129_transpar_medicine',
    when: 'before',
    action: ['update', 'insert'],
    condition: 'current.dpri_price.changes() || current.hospital_avg_price.changes()',
    script: Now.include('./../../server/business-rules/calculate-savings.js'),
    order: 100,
    active: true,
})
