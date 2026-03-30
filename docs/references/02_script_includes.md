# 02 — Script Includes

All Script Includes must be in **ES5**, set to **Client-callable: true** when
used with GlideAjax from the portal. Scope: `x_snc_transparensee`.

---

## DPRI_PriceEngine (Client-callable)

**Purpose:** Search drugs, return JSON results for AngularJS frontend.

```javascript
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
        var gr = new GlideRecord('x_snc_transparensee_medicine');
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
        var gr = new GlideRecord('x_snc_transparensee_medicine');
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
     * Log a search to x_snc_transparensee_search_log
     * Params: sysparm_term, sysparm_count, sysparm_drug_id (optional)
     */
    logSearch: function() {
        var gr = new GlideRecord('x_snc_transparensee_search_log');
        gr.search_term    = this.getParameter('sysparm_term') || '';
        gr.result_count   = parseInt(this.getParameter('sysparm_count')) || 0;
        gr.drug_selected  = this.getParameter('sysparm_drug_id') || '';
        gr.searched_at    = new GlideDateTime();
        gr.insert();
        return 'ok';
    },

    type: 'DPRI_PriceEngine'
});
```

---

## PharmacyLocator (Client-callable)

**Purpose:** Find nearest pharmacies using Haversine distance formula.

```javascript
var PharmacyLocator = Class.create();
PharmacyLocator.prototype = Object.assign(new AbstractAjaxProcessor(), {

    /**
     * Find nearest pharmacies to user location
     * Params: sysparm_lat, sysparm_lng, sysparm_limit (default 5)
     * Returns: JSON array sorted by distance asc
     */
    findNearest: function() {
        var userLat = parseFloat(this.getParameter('sysparm_lat')) || 0;
        var userLng = parseFloat(this.getParameter('sysparm_lng')) || 0;
        var limit   = parseInt(this.getParameter('sysparm_limit')) || 5;

        if (userLat === 0 || userLng === 0) {
            return JSON.stringify({ error: 'Invalid coordinates' });
        }

        var pharmacies = [];
        var gr = new GlideRecord('x_snc_transparensee_pharmacy');
        gr.addEncodedQuery('is_active=true^accreditation_status=approved');
        gr.query();

        while (gr.next()) {
            var pLat = parseFloat(gr.latitude.toString());
            var pLng = parseFloat(gr.longitude.toString());
            var dist = this._haversine(userLat, userLng, pLat, pLng);

            pharmacies.push({
                sys_id:   gr.sys_id.toString(),
                name:     gr.name.toString(),
                chain:    gr.chain.toString(),
                address:  gr.address.toString(),
                phone:    gr.phone.toString(),
                lat:      pLat,
                lng:      pLng,
                distance: Math.round(dist * 100) / 100  // km, 2 decimal places
            });
        }

        // Sort by distance ascending
        pharmacies.sort(function(a, b) { return a.distance - b.distance; });
        return JSON.stringify(pharmacies.slice(0, limit));
    },

    /**
     * Haversine formula — distance between two lat/lng points in km
     */
    _haversine: function(lat1, lon1, lat2, lon2) {
        var R    = 6371; // Earth radius in km
        var dLat = this._toRad(lat2 - lat1);
        var dLon = this._toRad(lon2 - lon1);
        var a    = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) *
                   Math.sin(dLon/2) * Math.sin(dLon/2);
        var c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    _toRad: function(deg) {
        return deg * (Math.PI / 180);
    },

    type: 'PharmacyLocator'
});
```

---

## AI_Concierge (Server-side only — NOT client-callable)

**Purpose:** Call OpenAI API to generate drug safety counsel.  
**Called from:** Flow Designer action or UI Action script.

```javascript
var AI_Concierge = Class.create();
AI_Concierge.prototype = {

    /**
     * Generate pharmacist safety tip for a drug
     * @param {string} drugName - Generic drug name
     * @param {number} dpriPrice - Official DPRI price
     * @param {string} indications - What the drug treats
     * @returns {string} AI-generated safety counsel text
     */
    getCounsel: function(drugName, dpriPrice, indications) {
        try {
            var rm = new sn_ws.RESTMessageV2('OpenAI_API', 'generate_counsel');
            
            var prompt = 'You are a helpful Filipino pharmacist. ' +
                'In 2-3 short sentences in simple English or Tagalog mix (Taglish), ' +
                'explain what ' + drugName + ' is used for and give one important safety tip. ' +
                'Also mention that the government fair price (DPRI) is ₱' + dpriPrice + '. ' +
                'Keep it friendly, simple, and reassuring for a non-medical person. ' +
                'Drug info: ' + indications;

            rm.setStringParameterNoEscape('prompt', prompt);
            var response = rm.execute();
            var body = JSON.parse(response.getBody());

            if (body.choices && body.choices[0]) {
                return body.choices[0].message.content;
            }
            return this._fallbackCounsel(drugName, dpriPrice);

        } catch(e) {
            gs.error('AI_Concierge error: ' + e.message);
            return this._fallbackCounsel(drugName, dpriPrice);
        }
    },

    /**
     * Fallback if AI call fails — pre-written generic message
     */
    _fallbackCounsel: function(drugName, dpriPrice) {
        return 'The government-set fair price (DPRI 2025) for ' + drugName +
               ' is ₱' + dpriPrice + '. Always follow your doctor\'s prescription ' +
               'and take the full course as directed. If you experience side effects, ' +
               'consult your pharmacist or doctor immediately.';
    },

    type: 'AI_Concierge'
};
```
