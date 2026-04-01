import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: 'transparensee_profile_page',
    endpoint: 'x_1966129_transpar_profile.do',
    description: 'TransparenSee Profile Page',
    category: 'general',
    html: Now.include('./../../client/ui-pages/transparensee-profile.html'),
    clientScript: Now.include('./../../client/ui-pages/transparensee-profile.js'),
    direct: true,
})
