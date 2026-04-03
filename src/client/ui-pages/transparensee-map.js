var app = angular.module('TransparenSeeMapApp', []);

app.filter('titleCase', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
});

app.controller('MapController', function($scope, $timeout) {
    var hasGlideAjax = typeof window.GlideAjax === 'function';
    var hasLeaflet = typeof window.L !== 'undefined';

    // State
    $scope.pharmacies = [];
    $scope.selectedPharmacy = {};
    $scope.userLocation = null;
    $scope.loadingPharmacies = false;
    $scope.locating = false;
    $scope.sidebarCollapsed = false;
    $scope.sortBy = 'distance';
    $scope.showLocationModal = false;

    // Map instance
    var map = null;
    var markers = {};
    var userMarker = null;

    // Initialize map
    function initMap() {
        if (!hasLeaflet) {
            console.error('Leaflet not available on map page');
            return;
        }

        // Default to Cebu City center
        var cebuCenter = [10.3157, 123.8854];
        
        map = L.map('pharmacyMap').setView(cebuCenter, 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Custom pharmacy icon
        window.pharmacyIcon = L.divIcon({
            html: '<div class="ts-map-marker">🏪</div>',
            className: 'ts-custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // User location icon
        window.userIcon = L.divIcon({
            html: '<div class="ts-user-marker">📍</div>',
            className: 'ts-user-marker-icon',
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        });
    }

    // Load pharmacies
    function loadPharmacies() {
        $scope.loadingPharmacies = true;

        if (!hasGlideAjax) {
            loadSamplePharmacies();
            $scope.loadingPharmacies = false;
            return;
        }
        
        var lat = $scope.userLocation ? $scope.userLocation.lat : 10.3157;
        var lng = $scope.userLocation ? $scope.userLocation.lng : 123.8854;
        
        var ga = new GlideAjax('PharmacyLocator');
        ga.addParam('sysparm_name', 'findNearest');
        ga.addParam('sysparm_lat', lat);
        ga.addParam('sysparm_lng', lng);
        ga.addParam('sysparm_limit', '20');
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                $scope.loadingPharmacies = false;
                try {
                    var result = JSON.parse(resp);
                    if (!result.error) {
                        $scope.pharmacies = result;
                        addPharmacyMarkers();
                        $scope.sortPharmacies();
                    } else {
                        console.error('Pharmacy loading error:', result.error);
                        // Load sample data for demo
                        loadSamplePharmacies();
                    }
                } catch(e) {
                    console.error('Pharmacy parsing error:', e);
                    loadSamplePharmacies();
                }
            });
        });
    }

    // Sample pharmacies for demo (Cebu City locations)
    function loadSamplePharmacies() {
        $scope.pharmacies = [
            {
                sys_id: 'sample_1',
                name: 'Mercury Drug - Ayala Center',
                chain: 'mercury',
                address: 'Ayala Center Cebu, Cebu Business Park, Cebu City',
                phone: '(032) 231-0515',
                lat: 10.3181,
                lng: 123.9065,
                distance: 2.1
            },
            {
                sys_id: 'sample_2', 
                name: 'Generika Drugstore - IT Park',
                chain: 'generika',
                address: 'Lahug, Cebu IT Park, Cebu City',
                phone: '(032) 520-8899',
                lat: 10.3268,
                lng: 123.9063,
                distance: 1.8
            },
            {
                sys_id: 'sample_3',
                name: 'Rose Pharmacy - Capitol Site',
                chain: 'rose',
                address: 'Capitol Site, Cebu City',
                phone: '(032) 254-6677',
                lat: 10.3099,
                lng: 123.8937,
                distance: 3.2
            },
            {
                sys_id: 'sample_4',
                name: 'SouthStar Drug - SM City Cebu',
                chain: 'southstar',
                address: 'SM City Cebu, North Reclamation Area',
                phone: '(032) 231-0923',
                lat: 10.3115,
                lng: 123.9019,
                distance: 2.8
            },
            {
                sys_id: 'sample_5',
                name: 'Watsons - Robinson\'s Galleria',
                chain: 'watsons',
                address: 'Robinsons Galleria Cebu, General Maxilom Avenue',
                phone: '(032) 412-4588',
                lat: 10.3203,
                lng: 123.8967,
                distance: 1.5
            }
        ];
        addPharmacyMarkers();
    }

    // Add pharmacy markers to map
    function addPharmacyMarkers() {
        if (!hasLeaflet || !map) return;

        // Clear existing markers
        Object.values(markers).forEach(function(marker) {
            map.removeLayer(marker);
        });
        markers = {};

        // Add new markers
        $scope.pharmacies.forEach(function(pharmacy) {
            var marker = L.marker([pharmacy.lat, pharmacy.lng], { 
                icon: window.pharmacyIcon 
            }).addTo(map);
            
            marker.bindPopup(
                '<div class="ts-map-popup">' +
                '<h4>' + pharmacy.name + '</h4>' +
                '<p>' + pharmacy.address + '</p>' +
                '<button onclick="angular.element(document.body).scope().selectPharmacyFromMap(\'' + 
                pharmacy.sys_id + '\')" class="ts-popup-btn">Select</button>' +
                '</div>'
            );

            marker.on('click', function() {
                $scope.$apply(function() {
                    $scope.selectPharmacy(pharmacy);
                });
            });

            markers[pharmacy.sys_id] = marker;
        });

        // Fit map to show all pharmacies
        if ($scope.pharmacies.length > 0) {
            var group = new L.featureGroup(Object.values(markers));
            map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // Location functions
    $scope.locateUser = function() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        $scope.locating = true;
        navigator.geolocation.getCurrentPosition(
            function(position) {
                $scope.$apply(function() {
                    $scope.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    $scope.locating = false;
                    
                    // Add user marker
                    if (userMarker) map.removeLayer(userMarker);
                    userMarker = L.marker(
                        [$scope.userLocation.lat, $scope.userLocation.lng], 
                        { icon: window.userIcon }
                    ).addTo(map);
                    
                    // Center map on user
                    map.setView([$scope.userLocation.lat, $scope.userLocation.lng], 15);
                    
                    // Reload pharmacies with user location
                    loadPharmacies();
                });
            },
            function(error) {
                $scope.$apply(function() {
                    $scope.locating = false;
                    console.error('Geolocation error:', error);
                    alert('Could not get your location. Using Cebu City center.');
                });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Pharmacy selection
    $scope.selectPharmacy = function(pharmacy) {
        $scope.selectedPharmacy = pharmacy;
        
        // Highlight marker
        Object.keys(markers).forEach(function(id) {
            if (id === pharmacy.sys_id) {
                // Highlight selected marker
                markers[id].setIcon(L.divIcon({
                    html: '<div class="ts-map-marker ts-marker-selected">🏪</div>',
                    className: 'ts-custom-marker',
                    iconSize: [35, 35],
                    iconAnchor: [17, 17]
                }));
            } else {
                // Reset other markers
                markers[id].setIcon(window.pharmacyIcon);
            }
        });
        
        // Pan to pharmacy
        map.setView([pharmacy.lat, pharmacy.lng], 16);
    };

    $scope.selectPharmacyFromMap = function(pharmacyId) {
        var pharmacy = $scope.pharmacies.find(function(p) { return p.sys_id === pharmacyId; });
        if (pharmacy) {
            $scope.selectPharmacy(pharmacy);
        }
    };

    // Global function for popup buttons
    window.selectPharmacyFromMap = $scope.selectPharmacyFromMap;

    // Sorting
    $scope.sortPharmacies = function() {
        if ($scope.sortBy === 'distance') {
            $scope.pharmacies.sort(function(a, b) { return (a.distance || 999) - (b.distance || 999); });
        } else {
            $scope.pharmacies.sort(function(a, b) { return a.name.localeCompare(b.name); });
        }
    };

    // UI Controls
    $scope.toggleSidebar = function() {
        $scope.sidebarCollapsed = !$scope.sidebarCollapsed;
        $timeout(function() {
            if (hasLeaflet && map) map.invalidateSize();
        }, 300);
    };

    $scope.closePopup = function() {
        $scope.selectedPharmacy = {};
        
        // Reset all markers
        Object.values(markers).forEach(function(marker) {
            marker.setIcon(window.pharmacyIcon);
        });
    };

    $scope.centerOnUser = function() {
        if (!hasLeaflet || !map) return;
        if ($scope.userLocation) {
            map.setView([$scope.userLocation.lat, $scope.userLocation.lng], 15);
        }
    };

    $scope.showAllPharmacies = function() {
        if (!hasLeaflet || !map) return;
        if ($scope.pharmacies.length > 0) {
            var group = new L.featureGroup(Object.values(markers));
            if (userMarker) group.addLayer(userMarker);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    };

    // Actions
    $scope.getDirections = function(pharmacy, event) {
        if (event) event.stopPropagation();
        var url = 'https://www.google.com/maps/dir/?api=1&destination=' + 
                  encodeURIComponent(pharmacy.address);
        window.open(url, '_blank');
    };

    $scope.callPharmacy = function(pharmacy, event) {
        if (event) event.stopPropagation();
        if (pharmacy.phone) {
            window.open('tel:' + pharmacy.phone, '_self');
        }
    };

    // Location permission
    $scope.requestLocation = function() {
        $scope.showLocationModal = false;
        $scope.locateUser();
    };

    $scope.skipLocation = function() {
        $scope.showLocationModal = false;
    };

    // Initialize
    $timeout(function() {
        initMap();
        loadPharmacies();
        
        // Show location modal after a brief delay
        $timeout(function() {
            $scope.showLocationModal = true;
        }, 1500);
    }, 100);
});