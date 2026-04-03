var app = angular.module('TransparenSeeSearchApp', []);

app.filter('titleCase', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
});

app.controller('SearchController', function($scope, $timeout) {
    // Get search query from URL
    var params = new URLSearchParams(window.location.search);
    $scope.searchQuery = params.get('q') || '';
    
    // State
    $scope.results = [];
    $scope.isLoading = false;
    $scope.filterOpen = false;
    $scope.showClinicalTip = false;
    $scope.selectedDrugs = [];
    
    // Categories and forms
    $scope.categories = [];
    $scope.dosageForms = ['tablet', 'capsule', 'syrup', 'suspension', 'injection', 'topical', 'drops'];
    
    // Filters
    $scope.filters = {
        categories: {},
        forms: {},
        maxPrice: 1000,
        genericOnly: false
    };
    var activeRequestId = 0;

    // Load categories
    function loadCategories() {
        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'getCategories');
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                try {
                    $scope.categories = JSON.parse(resp);
                } catch(e) {
                    console.error('Categories loading error:', e);
                }
            });
        });
    }

    // Search function
    $scope.performSearch = function() {
        if (!$scope.searchQuery || $scope.searchQuery.length < 2) {
            $scope.results = [];
            $scope.showClinicalTip = false;
            $scope.isLoading = false;
            return;
        }
        
        activeRequestId += 1;
        var requestId = activeRequestId;
        $scope.isLoading = true;
        $scope.showClinicalTip = false;
        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'searchDrug');
        ga.addParam('sysparm_query', $scope.searchQuery);
        ga.getXMLAnswer(function(resp) {
            if (requestId !== activeRequestId) return;
            $scope.$apply(function() {
                try {
                    var parsed = JSON.parse(resp);
                    $scope.results = Array.isArray(parsed) ? parsed : [];
                    $scope.isLoading = false;
                    $scope.showClinicalTip = $scope.results.length > 2;
                    
                    // Log the search
                    var logGa = new GlideAjax('DPRI_PriceEngine');
                    logGa.addParam('sysparm_name', 'logSearch');
                    logGa.addParam('sysparm_term', $scope.searchQuery);
                    logGa.addParam('sysparm_count', $scope.results.length);
                    logGa.getXMLAnswer(function() {}); // Fire and forget
                    
                } catch(e) {
                    console.error('Search error:', e);
                    $scope.results = [];
                    $scope.showClinicalTip = false;
                    $scope.isLoading = false;
                }
            });
        });

        $timeout(function() {
            if (requestId === activeRequestId && $scope.isLoading) {
                $scope.isLoading = false;
            }
        }, 10000);
    };

    // Debounced search on input change
    var searchTimeout = null;
    $scope.onSearchChange = function() {
        if (searchTimeout) $timeout.cancel(searchTimeout);
        searchTimeout = $timeout(function() {
            $scope.performSearch();
        }, 500);
    };

    // Filter functions
    $scope.toggleFilters = function() {
        $scope.filterOpen = !$scope.filterOpen;
    };

    $scope.filteredResults = function() {
        return $scope.results.filter(function(drug) {
            // Category filter
            var categoryKeys = Object.keys($scope.filters.categories);
            var categoryMatch = categoryKeys.length === 0 || 
                categoryKeys.every(function(key) { return !$scope.filters.categories[key]; }) ||
                $scope.filters.categories[drug.category];
            
            // Form filter
            var formKeys = Object.keys($scope.filters.forms);
            var formMatch = formKeys.length === 0 || 
                formKeys.every(function(key) { return !$scope.filters.forms[key]; }) ||
                $scope.filters.forms[drug.dosage_form];
            
            // Price filter
            var priceMatch = drug.dpri_price <= $scope.filters.maxPrice;
            
            // Generic filter
            var genericMatch = !$scope.filters.genericOnly || drug.is_generic;
            
            return categoryMatch && formMatch && priceMatch && genericMatch;
        });
    };

    $scope.getCategoryColor = function(categoryName) {
        var category = $scope.categories.find(function(cat) { return cat.name === categoryName; });
        return category ? category.color : '#009688';
    };

    $scope.goToDetail = function(drugId) {
        window.location.href = '/x_1966129_transpar_detail.do?id=' + drugId;
    };

    $scope.showGenericsOnly = function() {
        $scope.filters.genericOnly = true;
        $scope.showClinicalTip = false;
    };

    $scope.clearFilters = function() {
        $scope.filters = {
            categories: {},
            forms: {},
            maxPrice: 1000,
            genericOnly: false
        };
    };

    $scope.compareSelected = function() {
        var ids = $scope.selectedDrugs.map(function(drug) { return drug.sys_id; });
        window.location.href = '/x_1966129_transpar_compare.do?ids=' + ids.join(',');
    };

    // Initialize
    loadCategories();
    if ($scope.searchQuery) {
        $scope.performSearch();
    }
});