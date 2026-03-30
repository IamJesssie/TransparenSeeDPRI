# 04 — Business Rules

## BR1: `ts_calculate_savings`
**Table:** `x_snc_transparensee_medicine`  
**When:** Before Insert AND Before Update  
**Condition:** `current.dpri_price.changes() || current.hospital_avg_price.changes()`

```javascript
(function executeRule(current, previous) {
    var dpri     = parseFloat(current.dpri_price.toString()) || 0;
    var hospital = parseFloat(current.hospital_avg_price.toString()) || 0;

    if (hospital > 0 && dpri > 0) {
        current.savings_percent = Math.round(((hospital - dpri) / hospital) * 100);
    } else {
        current.savings_percent = 0;
    }
})(current, previous);
```

---

## BR2: `ts_flag_overprice`
**Table:** `x_snc_transparensee_medicine`  
**When:** Before Insert AND Before Update  
**Condition:** Always  
**Purpose:** Prevent DPRI price being set to 0 or negative

```javascript
(function executeRule(current, previous) {
    var price = parseFloat(current.dpri_price.toString());
    if (isNaN(price) || price <= 0) {
        current.setAbortAction(true);
        gs.addErrorMessage('DPRI Price must be greater than 0. Record not saved.');
    }
})(current, previous);
```

---

## BR3: `ts_pharmacy_approval_notify`
**Table:** `x_snc_transparensee_pharmacy`  
**When:** After Update  
**Condition:** `current.accreditation_status.changesTo('approved')`  
**Purpose:** Trigger notification when pharmacy is approved

```javascript
(function executeRule(current, previous) {
    // Fire the "Pharmacy Approved" notification event
    gs.eventQueue(
        'x_snc_transparensee.pharmacy.approved',
        current,
        current.name.toString(),
        gs.getUserName()
    );
})(current, previous);
```

---

# 05 — Client Scripts

## CS1: Search bar on Service Portal catalog page (if using SP widget)
**Type:** Catalog — onChange  
**Field:** search_query

```javascript
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue.length < 2) return;

    var ga = new GlideAjax('DPRI_PriceEngine');
    ga.addParam('sysparm_name', 'searchDrug');
    ga.addParam('sysparm_query', newValue);
    ga.getXMLAnswer(function(response) {
        var results = JSON.parse(response);
        // Update UI — depends on your portal widget structure
        console.log('Drug results:', results);
    });
}
```

---

# 06 — UI Actions

## UA1: `ts_generate_price_report`
**Table:** `x_snc_transparensee_medicine`  
**Type:** Form button  
**Label:** Generate Price Report  
**Client:** true (runs in browser)

```javascript
// UI Action — Client script
function generateReport() {
    var drugId = g_form.getUniqueValue();
    var reportUrl = '/x_snc_transparensee_report.do?id=' + drugId;
    window.open(reportUrl, '_blank', 'width=800,height=900,scrollbars=yes');
}
generateReport();
```

---

## UA2: `ts_find_pharmacies`
**Table:** `x_snc_transparensee_medicine`  
**Type:** Form button  
**Label:** Find Nearest Pharmacy  
**Client:** true

```javascript
function findPharmacies() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            window.location.href = '/x_snc_transparensee_map.do?lat=' + lat + '&lng=' + lng;
        }, function() {
            // Fallback — open map without coordinates
            window.location.href = '/x_snc_transparensee_map.do';
        });
    } else {
        window.location.href = '/x_snc_transparensee_map.do';
    }
}
findPharmacies();
```

---

## UA3: `ts_approve_pharmacy` (Admin only)
**Table:** `x_snc_transparensee_pharmacy`  
**Type:** Form button  
**Label:** Approve Pharmacy  
**Condition:** `current.accreditation_status == 'pending' && gs.hasRole('dpri_admin')`  
**Client:** false (server-side)

```javascript
// Server-side UI Action
current.accreditation_status = 'approved';
current.approved_by = gs.getUserID();
current.approval_date = new GlideDate().getByFormat('yyyy-MM-dd');
current.update();
gs.addInfoMessage('Pharmacy "' + current.name + '" has been approved and is now visible to patients.');
action.setRedirectURL(current);
```
