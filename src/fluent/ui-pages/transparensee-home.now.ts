import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['transparensee_home_page'],
    endpoint: 'x_1966129_transpar_home.do',
    description: 'TransparenSee DPRI Home Page - Drug Search Portal',
    category: 'general',
    html: Now.include('./../../client/ui-pages/transparensee-home.html'),
    clientScript: Now.include('./../../client/ui-pages/transparensee-home.js'),
    direct: true,
})