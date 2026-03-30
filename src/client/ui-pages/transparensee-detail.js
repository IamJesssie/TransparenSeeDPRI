var app = angular.module('TransparenSeeDetailApp', []);

app.filter('titleCase', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
});

app.controller('DetailController', function($scope, $timeout) {
    // Get drug ID from URL
    var params = new URLSearchParams(window.location.search);
    var drugId = params.get('id');
    
    // State
    $scope.drug = {};
    $scope.nearbyPharmacies = [];
    $scope.categoryColor = '#009688';
    $scope.aiResponse = '';
    $scope.aiLoading = false;
    $scope.aiError = false;

    // Load drug details
    function loadDrugDetail() {
        if (!drugId) {
            window.location.href = '/x_1966129_transpar_home.do';
            return;
        }

        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'getDrugDetail');
        ga.addParam('sysparm_id', drugId);
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                try {
                    $scope.drug = JSON.parse(resp);
                    if ($scope.drug.error) {
                        window.location.href = '/x_1966129_transpar_home.do';
                        return;
                    }
                    
                    // Update page title
                    document.title = $scope.drug.generic_name + ' - TransparenSee';
                    
                    // Load additional data
                    loadNearbyPharmacies();
                    generateAICounsel();
                    
                } catch(e) {
                    console.error('Drug detail loading error:', e);
                    window.location.href = '/x_1966129_transpar_home.do';
                }
            });
        });
    }

    // Load nearby pharmacies (mock data for now - would use geolocation)
    function loadNearbyPharmacies() {
        var ga = new GlideAjax('PharmacyLocator');
        ga.addParam('sysparm_name', 'findNearest');
        ga.addParam('sysparm_lat', '10.3157'); // Cebu City coordinates
        ga.addParam('sysparm_lng', '123.8854');
        ga.addParam('sysparm_limit', '5');
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                try {
                    var result = JSON.parse(resp);
                    if (!result.error) {
                        $scope.nearbyPharmacies = result;
                    }
                } catch(e) {
                    console.error('Pharmacy loading error:', e);
                }
            });
        });
    }

    // Generate AI safety counsel
    function generateAICounsel() {
        $scope.aiLoading = true;
        $scope.aiError = false;
        
        // Call AI Concierge Script Include
        var ga = new GlideAjax('AI_Concierge');
        ga.addParam('sysparm_name', 'getCounsel');
        ga.addParam('sysparm_drug_name', $scope.drug.generic_name);
        ga.addParam('sysparm_dpri_price', $scope.drug.dpri_price);
        ga.addParam('sysparm_indications', $scope.drug.indications || '');
        
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                $scope.aiLoading = false;
                try {
                    var result = JSON.parse(resp);
                    if (result.error) {
                        $scope.aiError = true;
                    } else {
                        $scope.aiResponse = result.counsel || resp;
                    }
                } catch(e) {
                    // Handle plain text response
                    if (resp && resp.length > 10) {
                        $scope.aiResponse = resp;
                    } else {
                        $scope.aiError = true;
                    }
                }
            });
        });
    }

    // Price bar visualization
    $scope.getBarWidth = function(type) {
        if (!$scope.drug.hospital_avg || $scope.drug.hospital_avg <= 0) return 50;
        
        var maxPrice = Math.max($scope.drug.dpri_price, $scope.drug.hospital_avg);
        if (type === 'dpri') {
            return ($scope.drug.dpri_price / maxPrice) * 80; // Max 80% width
        } else {
            return ($scope.drug.hospital_avg / maxPrice) * 80;
        }
    };

    // Action handlers
    $scope.generateReport = function() {
        window.location.href = '/x_1966129_transpar_report.do?id=' + $scope.drug.sys_id;
    };

    $scope.findPharmacies = function() {
        window.location.href = '/x_1966129_transpar_map.do?drug=' + $scope.drug.sys_id;
    };

    $scope.viewFullMap = function() {
        window.location.href = '/x_1966129_transpar_map.do';
    };

    $scope.getDirections = function(pharmacy) {
        // Open Google Maps with directions
        var url = 'https://www.google.com/maps/dir/?api=1&destination=' + 
                  encodeURIComponent(pharmacy.address);
        window.open(url, '_blank');
    };

    $scope.shareThis = function() {
        if (navigator.share) {
            navigator.share({
                title: $scope.drug.generic_name + ' - DPRI Price',
                text: 'Fair price for ' + $scope.drug.generic_name + ' is ₱' + $scope.drug.dpri_price,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(function() {
                alert('Link copied to clipboard!');
            });
        }
    };

    // AI quick questions
    $scope.askAI = function(question) {
        $scope.aiLoading = true;
        
        var ga = new GlideAjax('AI_Concierge');
        ga.addParam('sysparm_name', 'answerQuestion');
        ga.addParam('sysparm_drug_name', $scope.drug.generic_name);
        ga.addParam('sysparm_question', question);
        
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                $scope.aiLoading = false;
                try {
                    $scope.aiResponse = JSON.parse(resp).answer || resp;
                } catch(e) {
                    $scope.aiResponse = resp || 'Sorry, I could not process your question right now.';
                }
            });
        });
    };

    // Initialize
    loadDrugDetail();
});