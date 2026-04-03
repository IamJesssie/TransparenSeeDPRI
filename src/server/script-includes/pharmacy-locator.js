var PharmacyLocator = Class.create()
PharmacyLocator.prototype = Object.assign(new AbstractAjaxProcessor(), {
    /**
     * Find nearest pharmacies to user location
     * Params: sysparm_lat, sysparm_lng, sysparm_limit (default 5)
     * Returns: JSON array sorted by distance asc
     */
    findNearest: function () {
        var userLat = parseFloat(this.getParameter('sysparm_lat')) || 0
        var userLng = parseFloat(this.getParameter('sysparm_lng')) || 0
        var limit = parseInt(this.getParameter('sysparm_limit')) || 5

        if (userLat === 0 || userLng === 0) {
            return JSON.stringify({ error: 'Invalid coordinates' })
        }

        var pharmacies = []
        var gr = new GlideRecord('x_1966129_transpar_pharmacy')
        gr.addEncodedQuery('is_active=true^accreditation_status=approved')
        gr.query()

        while (gr.next()) {
            var pLat = parseFloat(gr.latitude.toString())
            var pLng = parseFloat(gr.longitude.toString())
            var dist = this._haversine(userLat, userLng, pLat, pLng)

            pharmacies.push({
                sys_id: gr.sys_id.toString(),
                name: gr.name.toString(),
                chain: gr.chain.toString(),
                address: gr.address.toString(),
                phone: gr.phone.toString(),
                lat: pLat,
                lng: pLng,
                distance: Math.round(dist * 100) / 100, // km, 2 decimal places
            })
        }

        // Sort by distance ascending
        pharmacies.sort(function (a, b) {
            return a.distance - b.distance
        })
        return JSON.stringify(pharmacies.slice(0, limit))
    },

    /**
     * Find nearest pharmacies carrying a specific drug with acquisition pricing.
     * Params: sysparm_lat, sysparm_lng, sysparm_drug_id, sysparm_limit (default 10)
     */
    findNearestByDrug: function () {
        var userLat = parseFloat(this.getParameter('sysparm_lat')) || 0
        var userLng = parseFloat(this.getParameter('sysparm_lng')) || 0
        var drugId = this.getParameter('sysparm_drug_id') || ''
        var limit = parseInt(this.getParameter('sysparm_limit')) || 10

        if (userLat === 0 || userLng === 0 || !drugId) {
            return JSON.stringify({ error: 'Invalid parameters' })
        }

        var byPharmacy = {}
        var priceGR = new GlideRecord('x_1966129_transpar_drug_facility_price')
        priceGR.addQuery('medicine', drugId)
        priceGR.query()

        while (priceGR.next()) {
            var pharmacyId = priceGR.pharmacy.toString()
            if (!pharmacyId || byPharmacy[pharmacyId]) {
                continue
            }

            var pgr = new GlideRecord('x_1966129_transpar_pharmacy')
            if (!pgr.get(pharmacyId)) {
                continue
            }
            if (pgr.is_active.toString() !== 'true' || pgr.accreditation_status.toString() !== 'approved') {
                continue
            }

            var pLat = parseFloat(pgr.latitude.toString())
            var pLng = parseFloat(pgr.longitude.toString())
            var dist = this._haversine(userLat, userLng, pLat, pLng)

            byPharmacy[pharmacyId] = {
                pharmacy_id: pharmacyId,
                pharmacy_name: pgr.name.toString(),
                chain: pgr.chain.toString(),
                address: pgr.address.toString(),
                city: pgr.city.toString(),
                phone: pgr.phone.toString(),
                lat: pLat,
                lng: pLng,
                distance: Math.round(dist * 100) / 100,
                facility_name: priceGR.facility_name.toString() || pgr.name.toString(),
                acquisition: parseFloat(priceGR.acquisition_price.toString()) || 0,
                quantity: parseInt(priceGR.quantity.toString()) || 0,
                brand: priceGR.brand.toString(),
                manufacturer: priceGR.manufacturer.toString(),
                supplier: priceGR.supplier.toString(),
            }
        }

        var rows = Object.keys(byPharmacy).map(function (id) {
            return byPharmacy[id]
        })
        rows.sort(function (a, b) {
            if (a.acquisition === b.acquisition) {
                return a.distance - b.distance
            }
            return a.acquisition - b.acquisition
        })

        return JSON.stringify(rows.slice(0, limit))
    },

    /**
     * Haversine formula — distance between two lat/lng points in km
     */
    _haversine: function (lat1, lon1, lat2, lon2) {
        var R = 6371 // Earth radius in km
        var dLat = this._toRad(lat2 - lat1)
        var dLon = this._toRad(lon2 - lon1)
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    },

    _toRad: function (deg) {
        return deg * (Math.PI / 180)
    },

    type: 'PharmacyLocator',
})
