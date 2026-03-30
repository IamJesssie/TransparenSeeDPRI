import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['transparensee_map_page'],
    endpoint: 'x_1966129_transpar_map.do',
    description: 'TransparenSee Pharmacy Map with Geolocation',
    category: 'general', 
    html: Now.include('./../../client/ui-pages/transparensee-map.html'),
    clientScript: Now.include('./../../client/ui-pages/transparensee-map.js'),
    direct: true,
})