import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['transparensee_detail_page'],
    endpoint: 'x_1966129_transpar_detail.do',
    description: 'TransparenSee Drug Detail Page with AI Concierge',
    category: 'general',
    html: Now.include('./../../client/ui-pages/transparensee-detail.html'),
    clientScript: Now.include('./../../client/ui-pages/transparensee-detail.js'),
    direct: true,
})