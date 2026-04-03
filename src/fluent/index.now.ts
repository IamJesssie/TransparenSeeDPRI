import '@servicenow/sdk/global'

// Import Tables
import './tables/medicine.now'
import './tables/pharmacy.now'
import './tables/category.now'
import './tables/search-log.now'
import './tables/drug-facility-price.now'

// Import Roles  
import './roles/dpri-roles.now'

// Import Script Includes
import './script-includes/dpri-price-engine.now'
import './script-includes/pharmacy-locator.now'
import './script-includes/ai-concierge.now'

// Import Business Rules
import './business-rules/calculate-savings.now'

// Import ACLs
import './acls/table-security.now'

// Import UI Pages
import './ui-pages/transparensee-home.now'
import './ui-pages/transparensee-search.now'
import './ui-pages/transparensee-detail.now'
import './ui-pages/transparensee-map.now'

// Import Sample Data
import './records/categories.now'
import './records/medicines.now'
import './records/pharmacies.now'
import './records/drug-facility-prices.now'