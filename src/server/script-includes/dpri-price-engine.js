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
            '^ORbrand_namesLIKE' + query +
            '^is_active=true'
        );
        gr.orderBy('generic_name');
        gr.setLimit(15);
        gr.query();

        while (gr.next()) {
            var dpriPrice = parseFloat(gr.dpri_price.toString()) || 0;
            var hospitalAvg = parseFloat(gr.hospital_avg_price.toString()) || 0;
            var savingsPct = hospitalAvg > 0
                ? Math.round(((hospitalAvg - dpriPrice) / hospitalAvg) * 100)
                : 0;

            results.push({
                sys_id:          gr.sys_id.toString(),
                generic_name:    gr.generic_name.toString(),
                brand_names:     gr.brand_names.toString(),
                dosage_strength: gr.dosage_strength.toString(),
                dosage_form:     gr.dosage_form.toString(),
                route:           gr.route.toString(),
                dpri_price:      dpriPrice,
                hospital_avg:    hospitalAvg,
                savings_percent: savingsPct,
                category:        gr.category.getDisplayValue(),
                is_generic:      gr.is_generic.toString() === 'true',
                limited_stock:   gr.limited_stock.toString() === 'true',
                indications:     gr.indications.toString()
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
            brand_names:     gr.brand_names.toString(),
            dosage_strength: gr.dosage_strength.toString(),
            dosage_form:     gr.dosage_form.toString(),
            route:           gr.route.toString(),
            dpri_price:      parseFloat(gr.dpri_price.toString()),
            hospital_avg:    parseFloat(gr.hospital_avg_price.toString()),
            savings_percent: parseInt(gr.savings_percent.toString()),
            category:        gr.category.getDisplayValue(),
            indications:     gr.indications.toString(),
            warnings:        gr.warnings.toString(),
            dpri_ref_code:   gr.dpri_ref_code.toString()
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
        gr.addEncodedQuery('is_active=true');
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
        
        var queryParts = ['is_active=true'];
        
        if (query && query.length >= 2) {
            queryParts.push('(generic_nameLIKE' + query.trim().toLowerCase() + '^ORbrand_namesLIKE' + query.trim().toLowerCase() + ')');
        }
        
        if (category) {
            queryParts.push('category.name=' + category);
        }
        
        if (form) {
            queryParts.push('dosage_form=' + form);
        }
        
        if (genericOnly) {
            queryParts.push('is_generic=true');
        }
        
        queryParts.push('dpri_price<=' + maxPrice);
        
        gr.addEncodedQuery(queryParts.join('^'));
        gr.orderBy('generic_name');
        gr.setLimit(50);
        gr.query();

        while (gr.next()) {
            var dpriPrice = parseFloat(gr.dpri_price.toString()) || 0;
            var hospitalAvg = parseFloat(gr.hospital_avg_price.toString()) || 0;
            var savingsPct = hospitalAvg > 0
                ? Math.round(((hospitalAvg - dpriPrice) / hospitalAvg) * 100)
                : 0;

            results.push({
                sys_id:          gr.sys_id.toString(),
                generic_name:    gr.generic_name.toString(),
                brand_names:     gr.brand_names.toString(),
                dosage_strength: gr.dosage_strength.toString(),
                dosage_form:     gr.dosage_form.toString(),
                route:           gr.route.toString(),
                dpri_price:      dpriPrice,
                hospital_avg:    hospitalAvg,
                savings_percent: savingsPct,
                category:        gr.category.getDisplayValue(),
                is_generic:      gr.is_generic.toString() === 'true',
                limited_stock:   gr.limited_stock.toString() === 'true',
                indications:     gr.indications.toString()
            });
        }

        return JSON.stringify(results);
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