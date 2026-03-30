import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['transparensee_search_page'],
    endpoint: 'x_1966129_transpar_search.do',
    description: 'TransparenSee Drug Search Results Page',
    category: 'general',
    html: Now.include('./../../client/ui-pages/transparensee-search.html'),
    clientScript: Now.include('./../../client/ui-pages/transparensee-search.js'),
    direct: true,
})