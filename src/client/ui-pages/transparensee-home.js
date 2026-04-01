var app = angular.module('TransparenSeeApp', []);

app.controller('HomeController', function($scope, $timeout) {
    $scope.searchQuery   = '';
    $scope.suggestions   = [];
    $scope.searchState   = 'idle';
    $scope.showSuggestions = false;
    $scope.searchFocused = false;
    $scope.popularTerms  = ['Paracetamol', 'Metformin', 'Amoxicillin', 'Amlodipine', 'Atorvastatin'];
    $scope.recentSearches = [
        { search_term: 'Amoxicillin', time_ago: 'Mar 28, 2025 · 2:30 PM' },
        { search_term: 'Paracetamol', time_ago: 'Mar 27, 2025 · 11:15 AM' },
        { search_term: 'Metformin', time_ago: 'Mar 25, 2025 · 9:00 AM' },
        { search_term: 'Amlodipine', time_ago: 'Mar 22, 2025 · 3:45 PM' },
        { search_term: 'Cetirizine', time_ago: 'Mar 20, 2025 · 7:20 PM' }
    ];
    $scope.savingsItems = [
        { name: 'Metformin 500mg', save: 'save P13.25/tablet' },
        { name: 'Atorvastatin 20mg', save: 'save P26.50/tablet' },
        { name: 'Amlodipine 5mg', save: 'save P15.25/tablet' }
    ];
    $scope.statsLoading = false;
    $scope.stats = { totalDrugs: '2,847', totalPharmacies: '1,234' };

    var searchTimeout = null;

    // Debounced search — waits 300ms after typing stops
    $scope.onSearchChange = function() {
        if (searchTimeout) $timeout.cancel(searchTimeout);
        if ($scope.searchQuery.length < 2) {
            $scope.suggestions = [];
            $scope.searchState = 'idle';
            $scope.showSuggestions = false;
            return;
        }
        $scope.searchState = 'loading';
        searchTimeout = $timeout(function() {
            var ga = new GlideAjax('DPRI_PriceEngine');
            ga.addParam('sysparm_name', 'searchDrug');
            ga.addParam('sysparm_query', $scope.searchQuery);
            ga.getXMLAnswer(function(resp) {
                $scope.$apply(function() {
                    try {
                        var parsed = JSON.parse(resp);
                        var arr = Array.isArray(parsed)
                            ? parsed
                            : (Array.isArray(parsed.results) ? parsed.results : (Array.isArray(parsed.data) ? parsed.data : []));
                        $scope.suggestions = arr.slice(0, 6);
                        $scope.searchState = $scope.suggestions.length ? 'ready' : 'empty';
                        $scope.showSuggestions = $scope.suggestions.length > 0;
                    } catch(e) {
                        console.error('Search error:', e);
                        $scope.suggestions = [];
                        $scope.searchState = 'empty';
                        $scope.showSuggestions = false;
                    }
                });
            });
        }, 300);
    };

    $scope.onSearchBlur = function() {
        $timeout(function() {
            $scope.showSuggestions = false;
        }, 200);
    };

    $scope.selectSuggestion = function(drug) {
        if (!drug || !drug.generic_name || !drug.sys_id) return;

        // Log the search
        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'logSearch');
        ga.addParam('sysparm_term', drug.generic_name);
        ga.addParam('sysparm_count', 1);
        ga.addParam('sysparm_drug_id', drug.sys_id);
        ga.getXMLAnswer(function(resp) {
            // Navigate to detail page
            window.location.href = '/x_1966129_transpar_detail.do?id=' + drug.sys_id;
        });
    };

    $scope.goToResults = function() {
        if ($scope.searchQuery.trim()) {
            window.location.href = '/x_1966129_transpar_search.do?q=' + encodeURIComponent($scope.searchQuery);
        }
    };

    $scope.quickSearch = function(term) {
        window.location.href = '/x_1966129_transpar_search.do?q=' + encodeURIComponent(term);
    };

    // Load stats on page init
    (function loadStats() {
        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'getStats');
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                try {
                    var data = JSON.parse(resp);
                    $scope.stats = {
                        totalDrugs: data.totalDrugs || data.total_drugs || data.drug_count || '2,847',
                        totalPharmacies: data.totalPharmacies || data.total_pharmacies || data.pharmacy_count || '1,234'
                    };
                } catch(e) {
                    console.error('Stats loading error:', e);
                }
            });
        });
    })();
});