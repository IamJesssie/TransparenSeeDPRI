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
        var gr = new GlideRecord('x_1966129_transpar_pharmacy');
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