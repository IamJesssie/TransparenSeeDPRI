import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['pharmacy_locator'],
    name: 'PharmacyLocator',
    description: 'Geolocation service for finding nearest pharmacies using Haversine formula',
    clientCallable: true,
    script: Now.include('./../../server/script-includes/pharmacy-locator.js'),
    apiName: 'x_1966129_transpar.PharmacyLocator',
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
