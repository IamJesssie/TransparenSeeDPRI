var app = angular.module('TransparenSeeApp', []);

app.controller('HomeController', function($scope, $timeout) {
    $scope.searchQuery   = '';
    $scope.suggestions   = [];
    $scope.showSuggestions = false;
    $scope.searchFocused = false;
    $scope.popularTerms  = ['Paracetamol', 'Metformin', 'Amoxicillin', 'Amlodipine'];
    $scope.recentSearches = [
        { search_term: 'Paracetamol', time_ago: '2 hours ago' },
        { search_term: 'Ibuprofen', time_ago: '1 day ago' },
        { search_term: 'Metformin', time_ago: '3 days ago' }
    ];
    $scope.stats = { totalDrugs: '—', totalPharmacies: '—' };

    var searchTimeout = null;

    // Debounced search — waits 300ms after typing stops
    $scope.onSearchChange = function() {
        if (searchTimeout) $timeout.cancel(searchTimeout);
        if ($scope.searchQuery.length < 2) {
            $scope.suggestions = [];
            return;
        }
        searchTimeout = $timeout(function() {
            var ga = new GlideAjax('DPRI_PriceEngine');
            ga.addParam('sysparm_name', 'searchDrug');
            ga.addParam('sysparm_query', $scope.searchQuery);
            ga.getXMLAnswer(function(resp) {
                $scope.$apply(function() {
                    try {
                        $scope.suggestions = JSON.parse(resp).slice(0, 6);
                        $scope.showSuggestions = true;
                    } catch(e) {
                        console.error('Search error:', e);
                        $scope.suggestions = [];
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
                    $scope.stats = data;
                } catch(e) {
                    console.error('Stats loading error:', e);
                }
            });
        });
    })();
});