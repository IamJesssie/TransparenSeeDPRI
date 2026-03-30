function calculateSavings(current, previous) {
    // Auto-calculate savings percentage when DPRI price or hospital avg changes
    var dpriPrice = parseFloat(current.getValue('dpri_price')) || 0;
    var hospitalAvg = parseFloat(current.getValue('hospital_avg_price')) || 0;
    
    if (hospitalAvg > 0 && dpriPrice > 0) {
        var savingsPercent = Math.round(((hospitalAvg - dpriPrice) / hospitalAvg) * 100);
        current.setValue('savings_percent', savingsPercent);
        
        // Log significant savings (>50%) for admin review
        if (savingsPercent > 50) {
            gs.addInfoMessage('High savings detected: ' + current.getValue('generic_name') + 
                             ' saves ' + savingsPercent + '% vs hospital pricing');
        }
    } else {
        current.setValue('savings_percent', 0);
    }
}