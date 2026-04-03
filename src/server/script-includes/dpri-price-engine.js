var DPRI_PriceEngine = Class.create();
DPRI_PriceEngine.prototype = Object.assign(new AbstractAjaxProcessor(), {

    /**
     * Search drugs by name — called via GlideAjax from portal
     * Param: sysparm_query (string)
     * Returns: JSON array of drug objects
     */
    searchDrug: function() {
        var query = this.getParameter('sysparm_query') || '';
        query = query.trim().toLowerCase();

        if (query.length < 2) {
            return JSON.stringify([]);
        }

        var results = [];
        var gr = new GlideRecord('x_1966129_transpar_medicine');
        gr.addEncodedQuery(
            'generic_nameLIKE' + query +
            '^ORbrand_nameLIKE' + query +
            '^active=active'
        );
        gr.orderBy('generic_name');
        gr.setLimit(15);
        gr.query();

        while (gr.next()) {
            var dpriPrice = parseFloat(gr.dpri_price.toString()) || 0;
            var lowest = parseFloat(gr.dpri_lowest_price.toString()) || dpriPrice;
            var median = parseFloat(gr.dpri_median_price.toString()) || dpriPrice;
            var highest = parseFloat(gr.dpri_highest_price.toString()) || dpriPrice;
            var hospitalAvg = parseFloat(gr.hospital_avg_price.toString()) || 0;
            var savingsPct = parseInt(gr.savings_percentage.toString()) || 0;

            results.push({
                sys_id:          gr.sys_id.toString(),
                generic_name:    gr.generic_name.toString(),
                brand_names:     gr.brand_name.toString(), // Output as brand_names for frontend compatibility
                dosage_strength: gr.strength.toString(),   // Output as dosage_strength for frontend
                dosage_form:     gr.form.toString(),       // Output as dosage_form for frontend
                route:           'oral', // Default since route field doesn't exist
                dpri_price:      dpriPrice,
                dpri_lowest:     lowest,
                dpri_median:     median,
                dpri_highest:    highest,
                hospital_avg:    hospitalAvg,
                savings_percent: savingsPct,
                category:        gr.category.getDisplayValue(),
                is_generic:      true,  // Default true since field doesn't exist
                limited_stock:   false, // Default false since field doesn't exist
                indications:     gr.description.toString()  // Use description as indications
            });
        }

        return JSON.stringify(results);
    },

    /**
     * Get single drug detail by sys_id
     * Param: sysparm_id (sys_id string)
     */
    getDrugDetail: function() {
        var id = this.getParameter('sysparm_id') || '';
        var gr = new GlideRecord('x_1966129_transpar_medicine');
        if (!gr.get(id)) {
            return JSON.stringify({ error: 'Not found' });
        }

        return JSON.stringify({
            sys_id:          gr.sys_id.toString(),
            generic_name:    gr.generic_name.toString(),
            brand_names:     gr.brand_name.toString(),
            dosage_strength: gr.strength.toString(),
            dosage_form:     gr.form.toString(),
            route:           'oral',
            dpri_price:      parseFloat(gr.dpri_price.toString()),
            dpri_lowest:     parseFloat(gr.dpri_lowest_price.toString()) || parseFloat(gr.dpri_price.toString()) || 0,
            dpri_median:     parseFloat(gr.dpri_median_price.toString()) || parseFloat(gr.dpri_price.toString()) || 0,
            dpri_highest:    parseFloat(gr.dpri_highest_price.toString()) || parseFloat(gr.dpri_price.toString()) || 0,
            hospital_avg:    parseFloat(gr.hospital_avg_price.toString()),
            savings_percent: parseInt(gr.savings_percentage.toString()),
            category:        gr.category.getDisplayValue(),
            indications:     gr.description.toString(),
            warnings:        'Consult your pharmacist for proper usage.',
            dpri_ref_code:   'DPRI-2025-' + gr.sys_id.toString().substr(0, 8)
        });
    },

    /**
     * Get all drug categories for filter options
     * Returns: JSON array of category objects
     */
    getCategories: function() {
        var results = [];
        var gr = new GlideRecord('x_1966129_transpar_category');
        gr.orderBy('sort_order');
        gr.query();

        while (gr.next()) {
            results.push({
                sys_id: gr.sys_id.toString(),
                name: gr.name.toString(),
                description: gr.description.toString(),
                color: gr.color.toString(),
                icon_code: gr.icon_code.toString()
            });
        }

        return JSON.stringify(results);
    },

    /**
     * Get app statistics for homepage
     */
    getStats: function() {
        var drugCount = 0;
        var pharmacyCount = 0;
        
        var gr = new GlideRecord('x_1966129_transpar_medicine');
        gr.addEncodedQuery('active=active');
        gr.query();
        drugCount = gr.getRowCount();

        var gr2 = new GlideRecord('x_1966129_transpar_pharmacy');
        gr2.addEncodedQuery('is_active=true^accreditation_status=approved');
        gr2.query();
        pharmacyCount = gr2.getRowCount();

        return JSON.stringify({
            totalDrugs: drugCount,
            totalPharmacies: pharmacyCount
        });
    },

    /**
     * Advanced search with filters
     * Params: sysparm_query, sysparm_category, sysparm_form, sysparm_generic_only, sysparm_max_price
     */
    advancedSearch: function() {
        var query = this.getParameter('sysparm_query') || '';
        var category = this.getParameter('sysparm_category') || '';
        var form = this.getParameter('sysparm_form') || '';
        var genericOnly = this.getParameter('sysparm_generic_only') === 'true';
        var maxPrice = parseFloat(this.getParameter('sysparm_max_price')) || 999999;

        var results = [];
        var gr = new GlideRecord('x_1966129_transpar_medicine');
        
        var queryParts = ['active=active'];
        
        if (query && query.length >= 2) {
            queryParts.push('(generic_nameLIKE' + query.trim().toLowerCase() + '^ORbrand_nameLIKE' + query.trim().toLowerCase() + ')');
        }
        
        if (category) {
            queryParts.push('category.name=' + category);
        }
        
        if (form) {
            queryParts.push('form=' + form);
        }
        
        queryParts.push('dpri_price<=' + maxPrice);
        
        gr.addEncodedQuery(queryParts.join('^'));
        gr.orderBy('generic_name');
        gr.setLimit(50);
        gr.query();

        while (gr.next()) {
            var dpriPrice = parseFloat(gr.dpri_price.toString()) || 0;
            var lowest = parseFloat(gr.dpri_lowest_price.toString()) || dpriPrice;
            var median = parseFloat(gr.dpri_median_price.toString()) || dpriPrice;
            var highest = parseFloat(gr.dpri_highest_price.toString()) || dpriPrice;
            var hospitalAvg = parseFloat(gr.hospital_avg_price.toString()) || 0;
            var savingsPct = parseInt(gr.savings_percentage.toString()) || 0;

            results.push({
                sys_id:          gr.sys_id.toString(),
                generic_name:    gr.generic_name.toString(),
                brand_names:     gr.brand_name.toString(),
                dosage_strength: gr.strength.toString(),
                dosage_form:     gr.form.toString(),
                route:           'oral',
                dpri_price:      dpriPrice,
                dpri_lowest:     lowest,
                dpri_median:     median,
                dpri_highest:    highest,
                hospital_avg:    hospitalAvg,
                savings_percent: savingsPct,
                category:        gr.category.getDisplayValue(),
                is_generic:      true,
                limited_stock:   false,
                indications:     gr.description.toString()
            });
        }

        return JSON.stringify(results);
    },

    /**
     * Return facility-level acquisition rows for a selected drug.
     * Params: sysparm_drug_id, sysparm_limit (optional)
     */
    getDrugFacilityPrices: function() {
        var drugId = this.getParameter('sysparm_drug_id') || '';
        var limit = parseInt(this.getParameter('sysparm_limit')) || 20;
        if (!drugId) return JSON.stringify([]);

        var rows = [];
        var gr = new GlideRecord('x_1966129_transpar_drug_facility_price');
        gr.addQuery('medicine', drugId);
        gr.orderBy('acquisition_price');
        gr.setLimit(limit);
        gr.query();

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
                source_ref: gr.source_ref.toString()
            });
        }

        return JSON.stringify(rows);
    },

    /**
     * Log a search to x_1966129_transpar_search_log
     * Params: sysparm_term, sysparm_count, sysparm_drug_id (optional)
     */
    logSearch: function() {
        var gr = new GlideRecord('x_1966129_transpar_search_log');
        gr.search_term    = this.getParameter('sysparm_term') || '';
        gr.result_count   = parseInt(this.getParameter('sysparm_count')) || 0;
        gr.drug_selected  = this.getParameter('sysparm_drug_id') || '';
        gr.searched_at    = new GlideDateTime();
        gr.insert();
        return 'ok';
    },

    type: 'DPRI_PriceEngine'
});