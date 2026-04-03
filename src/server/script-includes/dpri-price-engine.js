var DPRI_PriceEngine = Class.create()
DPRI_PriceEngine.prototype = Object.assign(new AbstractAjaxProcessor(), {
    _CATEGORY_MAP: {
        analgesic: { label: 'Analgesic/Fever', color: '#F59E0B' },
        antibiotic: { label: 'Antibiotic', color: '#EF4444' },
        antihypertensive: { label: 'Antihypertensive', color: '#3949AB' },
        antidiabetic: { label: 'Antidiabetic', color: '#558B2F' },
        antihistamine: { label: 'Antihistamine', color: '#9D174D' },
        antacid: { label: 'Antacid/GI', color: '#0288D1' },
        vitamins: { label: 'Vitamins', color: '#E65100' },
        bronchodilator: { label: 'Bronchodilator', color: '#0EA5A4' },
        cardiovascular: { label: 'Cardiovascular', color: '#1D4ED8' },
        antiviral: { label: 'Antiviral', color: '#8B5CF6' },
        antiparasitic: { label: 'Antiparasitic', color: '#92400E' },
        general: { label: 'General Medicine', color: '#0F766E' },
    },

    _normalizeText: function (value) {
        return String(value || '')
            .toLowerCase()
            .replace(/category_/g, ' ')
            .replace(/[^a-z0-9]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
    },

    _inferCategoryKey: function (genericName, categoryName) {
        var name = this._normalizeText(genericName)
        var category = this._normalizeText(categoryName)
        var haystack = (name + ' ' + category).trim()

        if (/(salbutamol|albuterol|ipratropium|tiotropium|budesonide|formoterol|salmeterol|montelukast|aminophylline|theophylline|bronch)/.test(haystack)) return 'bronchodilator'
        if (/(paracetamol|acetaminophen|ibuprofen|diclofenac|mefenamic|ketorolac|naproxen|aspirin|pain|fever|analgesic)/.test(haystack)) return 'analgesic'
        if (/(amoxicillin|azithromycin|cef|ciprofloxacin|cloxacillin|co amoxiclav|clavulanic|penicillin|antibiotic)/.test(haystack)) return 'antibiotic'
        if (/(metformin|insulin|gliclazide|glimepiride|linagliptin|diabet)/.test(haystack)) return 'antidiabetic'
        if (/(amlodipine|losartan|enalapril|valsartan|telmisartan|nifedipine|metoprolol|carvedilol|furosemide|hydrochlorothiazide|hypertens)/.test(haystack)) return 'antihypertensive'
        if (/(atorvastatin|simvastatin|clopidogrel|sacubitril|statin|cardio)/.test(haystack)) return 'cardiovascular'
        if (/(cetirizine|loratadine|diphenhydramine|chlorphenamine|fexofenadine|histamine|allerg)/.test(haystack)) return 'antihistamine'
        if (/(omeprazole|pantoprazole|ranitidine|aluminum hydroxide|magnesium hydroxide|antacid|acid reflux|gastro|gi)/.test(haystack)) return 'antacid'
        if (/(aciclovir|acyclovir|antiviral|viral)/.test(haystack)) return 'antiviral'
        if (/(albendazole|antiparasitic|helminth|worm)/.test(haystack)) return 'antiparasitic'
        if (/(ascorbic|vitamin|multivitamin|folic|ferrous|calcium|zinc|mineral)/.test(haystack)) return 'vitamins'

        if (/analgesic|fever/.test(category)) return 'analgesic'
        if (/antibiotic/.test(category)) return 'antibiotic'
        if (/antidiabetic/.test(category)) return 'antidiabetic'
        if (/antihypertensive/.test(category)) return 'antihypertensive'
        if (/antihistamine/.test(category)) return 'antihistamine'
        if (/antacid|gi/.test(category)) return 'antacid'
        if (/vitamin/.test(category)) return 'vitamins'

        return 'general'
    },

    _getCanonicalCategory: function (genericName, categoryName) {
        var key = this._inferCategoryKey(genericName, categoryName)
        var meta = this._CATEGORY_MAP[key] || this._CATEGORY_MAP.general
        return {
            category_key: key,
            category_label: meta.label,
            category_color: meta.color,
        }
    },

    /**
     * Search drugs by name — called via GlideAjax from portal
     * Param: sysparm_query (string)
     * Returns: JSON array of drug objects
     */
    searchDrug: function () {
        var query = this.getParameter('sysparm_query') || ''
        query = query.trim().toLowerCase()

        if (query.length < 2) {
            return JSON.stringify([])
        }

        var results = []
        var seen = {}

        var pushRow = function (gr) {
            var id = gr.sys_id.toString()
            if (seen[id]) return
            seen[id] = true

            var dpriPrice = parseFloat(gr.dpri_price.toString()) || 0
            var lowest = parseFloat(gr.dpri_lowest_price.toString()) || dpriPrice
            var median = parseFloat(gr.dpri_median_price.toString()) || dpriPrice
            var highest = parseFloat(gr.dpri_highest_price.toString()) || dpriPrice
            var hospitalAvg = parseFloat(gr.hospital_avg_price.toString()) || 0
            var savingsPct = parseInt(gr.savings_percentage.toString()) || 0
            var canonicalCategory = this._getCanonicalCategory(gr.generic_name.toString(), gr.category.getDisplayValue())

            results.push({
                sys_id: id,
                generic_name: gr.generic_name.toString(),
                brand_names: gr.brand_name.toString(), // Output as brand_names for frontend compatibility
                dosage_strength: gr.strength.toString(), // Output as dosage_strength for frontend
                dosage_form: gr.form.toString(), // Output as dosage_form for frontend
                route: 'oral', // Default since route field doesn't exist
                dpri_price: dpriPrice,
                dpri_lowest: lowest,
                dpri_median: median,
                dpri_highest: highest,
                hospital_avg: hospitalAvg,
                savings_percent: savingsPct,
                category: canonicalCategory.category_label,
                category_key: canonicalCategory.category_key,
                category_color: canonicalCategory.category_color,
                is_generic: true, // Default true since field doesn't exist
                limited_stock: false, // Default false since field doesn't exist
                indications: gr.description.toString(), // Use description as indications
            })
        }.bind(this)

        var gr = new GlideRecord('x_1966129_transpar_medicine')
        gr.addQuery('active', 'active')
        var qc = gr.addQuery('generic_name', 'CONTAINS', query)
        qc.addOrCondition('brand_name', 'CONTAINS', query)
        gr.orderBy('generic_name')
        gr.setLimit(15)
        gr.query()
        while (gr.next()) pushRow(gr)

        // If strict contains has no rows, retry with a short stem so near-typos still surface likely matches.
        if (!results.length && query.length >= 4) {
            var stem = query.substring(0, 4)
            var grStem = new GlideRecord('x_1966129_transpar_medicine')
            grStem.addQuery('active', 'active')
            var qcStem = grStem.addQuery('generic_name', 'CONTAINS', stem)
            qcStem.addOrCondition('brand_name', 'CONTAINS', stem)
            grStem.orderBy('generic_name')
            grStem.setLimit(15)
            grStem.query()
            while (grStem.next()) pushRow(grStem)
        }

        return JSON.stringify(results)
    },

    /**
     * Get single drug detail by sys_id
     * Param: sysparm_id (sys_id string)
     */
    getDrugDetail: function () {
        var id = this.getParameter('sysparm_id') || ''
        var gr = new GlideRecord('x_1966129_transpar_medicine')
        if (!gr.get(id)) {
            return JSON.stringify({ error: 'Not found' })
        }

        var canonicalCategory = this._getCanonicalCategory(gr.generic_name.toString(), gr.category.getDisplayValue())

        return JSON.stringify({
            sys_id: gr.sys_id.toString(),
            generic_name: gr.generic_name.toString(),
            brand_names: gr.brand_name.toString(),
            dosage_strength: gr.strength.toString(),
            dosage_form: gr.form.toString(),
            route: 'oral',
            dpri_price: parseFloat(gr.dpri_price.toString()),
            dpri_lowest: parseFloat(gr.dpri_lowest_price.toString()) || parseFloat(gr.dpri_price.toString()) || 0,
            dpri_median: parseFloat(gr.dpri_median_price.toString()) || parseFloat(gr.dpri_price.toString()) || 0,
            dpri_highest: parseFloat(gr.dpri_highest_price.toString()) || parseFloat(gr.dpri_price.toString()) || 0,
            hospital_avg: parseFloat(gr.hospital_avg_price.toString()),
            savings_percent: parseInt(gr.savings_percentage.toString()),
            category: canonicalCategory.category_label,
            category_key: canonicalCategory.category_key,
            category_color: canonicalCategory.category_color,
            indications: gr.description.toString(),
            warnings: 'Consult your pharmacist for proper usage.',
            dpri_ref_code: 'DPRI-2025-' + gr.sys_id.toString().substr(0, 8),
        })
    },

    /**
     * Get all drug categories for filter options
     * Returns: JSON array of category objects
     */
    getCategories: function () {
        var results = []
        var gr = new GlideRecord('x_1966129_transpar_category')
        gr.orderBy('sort_order')
        gr.query()

        while (gr.next()) {
            results.push({
                sys_id: gr.sys_id.toString(),
                name: gr.name.toString(),
                description: gr.description.toString(),
                color: gr.color.toString(),
                icon_code: gr.icon_code.toString(),
            })
        }

        return JSON.stringify(results)
    },

    /**
     * Get app statistics for homepage
     */
    getStats: function () {
        var drugCount = 0
        var pharmacyCount = 0

        var gr = new GlideRecord('x_1966129_transpar_medicine')
        gr.addEncodedQuery('active=active')
        gr.query()
        drugCount = gr.getRowCount()

        var gr2 = new GlideRecord('x_1966129_transpar_pharmacy')
        gr2.addEncodedQuery('is_active=true^accreditation_status=approved')
        gr2.query()
        pharmacyCount = gr2.getRowCount()

        return JSON.stringify({
            totalDrugs: drugCount,
            totalPharmacies: pharmacyCount,
        })
    },

    /**
     * Advanced search with filters
     * Params: sysparm_query, sysparm_category, sysparm_form, sysparm_generic_only, sysparm_max_price
     */
    advancedSearch: function () {
        var query = this.getParameter('sysparm_query') || ''
        var category = this.getParameter('sysparm_category') || ''
        var form = this.getParameter('sysparm_form') || ''
        var genericOnly = this.getParameter('sysparm_generic_only') === 'true'
        var maxPrice = parseFloat(this.getParameter('sysparm_max_price')) || 999999

        var results = []
        var gr = new GlideRecord('x_1966129_transpar_medicine')

        var queryParts = ['active=active']

        if (query && query.length >= 2) {
            queryParts.push(
                '(generic_nameLIKE' +
                    query.trim().toLowerCase() +
                    '^ORbrand_nameLIKE' +
                    query.trim().toLowerCase() +
                    ')'
            )
        }

        if (category) {
            queryParts.push('category.name=' + category)
        }

        if (form) {
            queryParts.push('form=' + form)
        }

        queryParts.push('dpri_price<=' + maxPrice)

        gr.addEncodedQuery(queryParts.join('^'))
        gr.orderBy('generic_name')
        gr.setLimit(50)
        gr.query()

        while (gr.next()) {
            var dpriPrice = parseFloat(gr.dpri_price.toString()) || 0
            var lowest = parseFloat(gr.dpri_lowest_price.toString()) || dpriPrice
            var median = parseFloat(gr.dpri_median_price.toString()) || dpriPrice
            var highest = parseFloat(gr.dpri_highest_price.toString()) || dpriPrice
            var hospitalAvg = parseFloat(gr.hospital_avg_price.toString()) || 0
            var savingsPct = parseInt(gr.savings_percentage.toString()) || 0
            var canonicalCategory = this._getCanonicalCategory(gr.generic_name.toString(), gr.category.getDisplayValue())

            results.push({
                sys_id: gr.sys_id.toString(),
                generic_name: gr.generic_name.toString(),
                brand_names: gr.brand_name.toString(),
                dosage_strength: gr.strength.toString(),
                dosage_form: gr.form.toString(),
                route: 'oral',
                dpri_price: dpriPrice,
                dpri_lowest: lowest,
                dpri_median: median,
                dpri_highest: highest,
                hospital_avg: hospitalAvg,
                savings_percent: savingsPct,
                category: canonicalCategory.category_label,
                category_key: canonicalCategory.category_key,
                category_color: canonicalCategory.category_color,
                is_generic: true,
                limited_stock: false,
                indications: gr.description.toString(),
            })
        }

        return JSON.stringify(results)
    },

    /**
     * Return facility-level acquisition rows for a selected drug.
     * Params: sysparm_drug_id, sysparm_limit (optional)
     */
    getDrugFacilityPrices: function () {
        var drugId = this.getParameter('sysparm_drug_id') || ''
        var limit = parseInt(this.getParameter('sysparm_limit')) || 20
        if (!drugId) return JSON.stringify([])

        var rows = []
        var gr = new GlideRecord('x_1966129_transpar_drug_facility_price')
        gr.addQuery('medicine', drugId)
        gr.orderBy('acquisition_price')
        gr.setLimit(limit)
        gr.query()

        while (gr.next()) {
            rows.push({
                sys_id: gr.sys_id.toString(),
                facility_name: gr.facility_name.toString(),
                acquisition: parseFloat(gr.acquisition_price.toString()) || 0,
                quantity: parseInt(gr.quantity.toString()) || 0,
                brand: gr.brand.toString(),
                manufacturer: gr.manufacturer.toString(),
                supplier: gr.supplier.toString(),
                pharmacy_id: gr.pharmacy.toString(),
                pharmacy_name: gr.pharmacy.getDisplayValue(),
                source_ref: gr.source_ref.toString(),
            })
        }

        return JSON.stringify(rows)
    },

    /**
     * Log a search to x_1966129_transpar_search_log
     * Params: sysparm_term, sysparm_count, sysparm_drug_id (optional)
     */
    logSearch: function () {
        var gr = new GlideRecord('x_1966129_transpar_search_log')
        gr.initialize()

        var term = (this.getParameter('sysparm_term') || '').trim()
        var count = parseInt(this.getParameter('sysparm_count'), 10)
        var selectedDrugId = (this.getParameter('sysparm_drug_id') || '').trim()

        if (gr.isValidField('search_term')) gr.setValue('search_term', term)

        if (isNaN(count) || count < 0) count = 0
        if (gr.isValidField('result_count')) {
            gr.setValue('result_count', count)
        } else if (gr.isValidField('results_count')) {
            gr.setValue('results_count', count)
        }

        if (selectedDrugId) {
            if (gr.isValidField('medicine_selected')) {
                gr.setValue('medicine_selected', selectedDrugId)
            } else if (gr.isValidField('drug_selected')) {
                gr.setValue('drug_selected', selectedDrugId)
            }
        }

        var now = new GlideDateTime()
        if (gr.isValidField('searched_at')) gr.searched_at = now
        if (gr.isValidField('search_timestamp')) gr.search_timestamp = now
        gr.insert()
        return 'ok'
    },

    /**
     * Return recent searches for homepage activity feed.
     * Params: sysparm_limit (optional)
     */
    getRecentSearches: function () {
        var limit = parseInt(this.getParameter('sysparm_limit'), 10)
        if (!limit || limit < 1) limit = 5
        if (limit > 20) limit = 20

        var rows = []
        var gr = new GlideRecord('x_1966129_transpar_search_log')
        // Always use creation time for recency ordering because some inserts may not set custom date fields.
        gr.orderByDesc('sys_created_on')
        gr.setLimit(limit)
        gr.query()

        while (gr.next()) {
            var when = gr.sys_created_on.getDisplayValue()
            var whenMs = parseInt(new GlideDateTime(gr.sys_created_on.getValue()).getNumericValue(), 10) || 0

            if (!whenMs && gr.isValidField('search_timestamp') && !gr.search_timestamp.nil()) {
                when = gr.search_timestamp.getDisplayValue()
                whenMs = parseInt(new GlideDateTime(gr.search_timestamp.getValue()).getNumericValue(), 10) || 0
            }

            if (!whenMs && gr.isValidField('searched_at') && !gr.searched_at.nil()) {
                when = gr.searched_at.getDisplayValue()
                whenMs = parseInt(new GlideDateTime(gr.searched_at.getValue()).getNumericValue(), 10) || 0
            }

            rows.push({
                search_term: gr.search_term.toString(),
                result_count: gr.isValidField('result_count')
                    ? (parseInt(gr.result_count.toString(), 10) || 0)
                    : (gr.isValidField('results_count') ? (parseInt(gr.results_count.toString(), 10) || 0) : 0),
                searched_at: when,
                searched_at_ms: whenMs,
            })
        }

        return JSON.stringify(rows)
    },

    type: 'DPRI_PriceEngine',
})
