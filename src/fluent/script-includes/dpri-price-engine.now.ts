import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['dpri_price_engine'],
    name: 'DPRI_PriceEngine',
    description: 'Drug search and price comparison engine for DPRI data',
    clientCallable: true,
    script: Now.include('./../../server/script-includes/dpri-price-engine.js'),
})