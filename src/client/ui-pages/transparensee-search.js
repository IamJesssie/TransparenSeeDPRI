var app = angular.module('TransparenSeeSearchApp', []);

app.filter('titleCase', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
});

app.controller('SearchController', function($scope, $timeout) {
    var params = new URLSearchParams(window.location.search);
    $scope.searchQuery = params.get('q') || '';
    $scope.results = [];
    $scope.isLoading = false;
    $scope.filterOpen = true;
    $scope.showClinicalTip = false;
    $scope.selectedDrugs = [];
    $scope.topMedicines = ['Paracetamol', 'Amoxicillin', 'Metformin', 'Amlodipine', 'Losartan', 'Omeprazole', 'Cetirizine', 'Salbutamol'];
    $scope.categories = [];
    $scope.dosageForms = ['tablet', 'capsule', 'syrup', 'suspension', 'injection', 'topical', 'drops'];
    $scope.filters = { categories: {}, forms: {}, maxPrice: 1000, genericOnly: false };

    var activeRequestId = 0;
    var hasGlideAjax = typeof window.GlideAjax === 'function';
    var medicineFields = 'sys_id,generic_name,brand_name,strength,form,dpri_price,dpri_lowest_price,dpri_median_price,dpri_highest_price,hospital_avg_price,savings_percentage,category,description';
    var searchLogTableApi = '/api/now/table/x_1966129_transpar_search_log';
    var demoMedicines = [
        { sys_id: 'demo-1', generic_name: 'Paracetamol', brand_names: 'Biogesic, Tempra, Tylenol', dosage_strength: '500mg', dosage_form: 'tablet', route: 'oral', dpri_price: 8.5, dpri_lowest: 7.7, dpri_median: 8.5, dpri_highest: 12, hospital_avg: 35, savings_percent: 76, category: 'Analgesic', is_generic: true, limited_stock: false, indications: 'Pain and fever relief' },
        { sys_id: 'demo-2', generic_name: 'Amoxicillin', brand_names: 'Amoxil, Trimox, Moxatag', dosage_strength: '500mg', dosage_form: 'capsule', route: 'oral', dpri_price: 120, dpri_lowest: 110, dpri_median: 120, dpri_highest: 145, hospital_avg: 450, savings_percent: 73, category: 'Antibiotic', is_generic: true, limited_stock: false, indications: 'Bacterial infections' },
        { sys_id: 'demo-3', generic_name: 'Metformin', brand_names: 'Glucophage, Diamet, Gluformin', dosage_strength: '500mg', dosage_form: 'tablet', route: 'oral', dpri_price: 6.5, dpri_lowest: 5.9, dpri_median: 6.5, dpri_highest: 9.4, hospital_avg: 28, savings_percent: 77, category: 'Antidiabetic', is_generic: true, limited_stock: false, indications: 'Type 2 diabetes' },
        { sys_id: 'demo-4', generic_name: 'Amlodipine', brand_names: 'Norvasc, Amtas, Amlodac', dosage_strength: '5mg', dosage_form: 'tablet', route: 'oral', dpri_price: 12, dpri_lowest: 10.5, dpri_median: 12, dpri_highest: 16.2, hospital_avg: 68, savings_percent: 82, category: 'Antihypertensive', is_generic: true, limited_stock: false, indications: 'Hypertension and angina' },
        { sys_id: 'demo-5', generic_name: 'Losartan', brand_names: 'Cozaar, Angioten, Lifezar', dosage_strength: '50mg', dosage_form: 'tablet', route: 'oral', dpri_price: 18.5, dpri_lowest: 17, dpri_median: 18.5, dpri_highest: 26, hospital_avg: 75, savings_percent: 75, category: 'Antihypertensive', is_generic: true, limited_stock: false, indications: 'Hypertension' },
        { sys_id: 'demo-6', generic_name: 'Omeprazole', brand_names: 'Losec, Prilosec, Omez', dosage_strength: '20mg', dosage_form: 'capsule', route: 'oral', dpri_price: 15, dpri_lowest: 13.8, dpri_median: 15, dpri_highest: 20.4, hospital_avg: 65, savings_percent: 77, category: 'Antacid', is_generic: true, limited_stock: false, indications: 'Acid reflux and GERD' },
        { sys_id: 'demo-7', generic_name: 'Cetirizine', brand_names: 'Zyrtec, Virlix, Cetirex', dosage_strength: '10mg', dosage_form: 'tablet', route: 'oral', dpri_price: 8, dpri_lowest: 7.2, dpri_median: 8, dpri_highest: 11.6, hospital_avg: 35, savings_percent: 77, category: 'Antihistamine', is_generic: true, limited_stock: false, indications: 'Allergies' },
        { sys_id: 'demo-8', generic_name: 'Salbutamol', brand_names: 'Ventolin, Asmalin, Asthalin', dosage_strength: '2mg/5mL', dosage_form: 'syrup', route: 'oral', dpri_price: 55, dpri_lowest: 49, dpri_median: 55, dpri_highest: 72, hospital_avg: 150, savings_percent: 63, category: 'Bronchodilator', is_generic: true, limited_stock: false, indications: 'Bronchospasm and asthma' }
    ];

    function buildDemoCategories() {
        var seen = {};
        var palette = [
            '#EF4444',
            '#3B82F6',
            '#10B981',
            '#8B5CF6',
            '#F59E0B',
            '#06B6D4',
            '#84CC16',
            '#F97316',
        ];
        var idx = 0;

        return demoMedicines.reduce(function(acc, medicine) {
            var categoryName = medicine.category || 'General';
            if (seen[categoryName]) {
                return acc;
            }
            seen[categoryName] = true;
            acc.push({
                name: categoryName,
                color: palette[idx % palette.length],
                description: '',
            });
            idx += 1;
            return acc;
        }, []);
    }

    function runDemoSearch(query) {
        var q = (query || '').trim().toLowerCase();
        if (q.length < 2) return demoMedicines.slice();

        return demoMedicines.filter(function(medicine) {
            var genericName = (medicine.generic_name || '').toLowerCase();
            var brandNames = (medicine.brand_names || '').toLowerCase();
            return genericName.indexOf(q) !== -1 || brandNames.indexOf(q) !== -1;
        });
    }

    function parseNum(v, fallback) {
        var raw = v;
        if (v && typeof v === 'object') {
            if (typeof v.value !== 'undefined' && v.value !== null && v.value !== '') {
                raw = v.value;
            } else if (typeof v.display_value !== 'undefined' && v.display_value !== null && v.display_value !== '') {
                raw = v.display_value;
            }
        }
        var n = parseFloat(raw);
        return isNaN(n) ? (fallback || 0) : n;
    }

    function getFieldValue(v) {
        if (v && typeof v === 'object') {
            if (typeof v.display_value !== 'undefined' && v.display_value !== null && v.display_value !== '') return String(v.display_value);
            if (typeof v.value !== 'undefined' && v.value !== null && v.value !== '') return String(v.value);
            return '';
        }
        return v ? String(v) : '';
    }

    function toTitleCase(text) {
        return String(text || '')
            .split(' ')
            .filter(function(x) { return x; })
            .map(function(word) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');
    }

    var categoryCatalog = {
        analgesic: { label: 'Analgesic/Fever', color: '#F59E0B' },
        antibiotic: { label: 'Antibiotic', color: '#EF4444' },
        antihypertensive: { label: 'Antihypertensive', color: '#3949AB' },
        antidiabetic: { label: 'Antidiabetic', color: '#558B2F' },
        antihistamine: { label: 'Antihistamine', color: '#9D174D' },
        antacid: { label: 'Antacid/GI', color: '#0288D1' },
        vitamins: { label: 'Vitamins', color: '#E65100' },
        bronchodilator: { label: 'Bronchodilator', color: '#0EA5A4' },
        cardiovascular: { label: 'Cardiovascular', color: '#1D4ED8' },
        antiviral: { label: 'Antiviral', color: '#8B5CF6' },
        antiparasitic: { label: 'Antiparasitic', color: '#92400E' },
        general: { label: 'General Medicine', color: '#0F766E' }
    };

    function canonicalCategoryName(input, drugName) {
        var raw = (String(input || '') + ' ' + String(drugName || ''))
            .toLowerCase()
            .replace(/category_/g, ' ')
            .replace(/[^a-z0-9]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (!raw) return 'general';
        if (/(salbutamol|albuterol|ipratropium|tiotropium|montelukast|bronch)/.test(raw)) return 'bronchodilator';
        if (/(paracetamol|acetaminophen|ibuprofen|diclofenac|mefenamic|aspirin|analgesic|fever)/.test(raw)) return 'analgesic';
        if (/(amoxicillin|azithromycin|cef|ciprofloxacin|clavulanic|antibiotic)/.test(raw)) return 'antibiotic';
        if (/(metformin|insulin|gliclazide|glimepiride|diabet)/.test(raw)) return 'antidiabetic';
        if (/(amlodipine|losartan|enalapril|valsartan|telmisartan|nifedipine|metoprolol|carvedilol|hypertens)/.test(raw)) return 'antihypertensive';
        if (/(atorvastatin|simvastatin|clopidogrel|sacubitril|statin|cardio)/.test(raw)) return 'cardiovascular';
        if (/(cetirizine|loratadine|diphenhydramine|antihistamine|allerg)/.test(raw)) return 'antihistamine';
        if (/(omeprazole|pantoprazole|ranitidine|aluminum hydroxide|magnesium hydroxide|antacid|gastro|gi)/.test(raw)) return 'antacid';
        if (/(aciclovir|acyclovir|antiviral|viral)/.test(raw)) return 'antiviral';
        if (/(albendazole|antiparasitic|worm)/.test(raw)) return 'antiparasitic';
        if (/(ascorbic|vitamin|multivitamin|folic|ferrous|calcium|zinc|mineral)/.test(raw)) return 'vitamins';
        return 'general';
    }

    function normalizeCategoryLabel(input, drugName) {
        var canonical = canonicalCategoryName(input, drugName);
        return (categoryCatalog[canonical] || categoryCatalog.general).label;
    }

    function normalizeCategoryColor(input, drugName) {
        var canonical = canonicalCategoryName(input, drugName);
        return (categoryCatalog[canonical] || categoryCatalog.general).color;
    }

    function applyCanonicalCategory(drug) {
        if (!drug) return drug;
        var key = drug.category_key || canonicalCategoryName(drug.category, drug.generic_name);
        var meta = categoryCatalog[key] || categoryCatalog.general;
        drug.category_key = key;
        drug.category = meta.label;
        drug.category_color = drug.category_color || meta.color;
        return drug;
    }

    function mapMedicineRow(row) {
        var dpriPrice = parseNum(row.dpri_price, 0);
        var dosageForm = getFieldValue(row.form).toLowerCase();
        var genericName = getFieldValue(row.generic_name);
        var normalizedCategory = normalizeCategoryLabel(getFieldValue(row.category), genericName);
        var normalizedCategoryKey = canonicalCategoryName(getFieldValue(row.category), genericName);
        return {
            sys_id: getFieldValue(row.sys_id),
            generic_name: genericName,
            brand_names: getFieldValue(row.brand_name),
            dosage_strength: getFieldValue(row.strength),
            dosage_form: dosageForm,
            route: 'oral',
            dpri_price: dpriPrice,
            dpri_lowest: parseNum(row.dpri_lowest_price, dpriPrice),
            dpri_median: parseNum(row.dpri_median_price, dpriPrice),
            dpri_highest: parseNum(row.dpri_highest_price, dpriPrice),
            hospital_avg: parseNum(row.hospital_avg_price, 0),
            savings_percent: parseInt(row.savings_percentage, 10) || 0,
            category: normalizedCategory,
            category_key: normalizedCategoryKey,
            category_color: normalizeCategoryColor(getFieldValue(row.category), genericName),
            is_generic: true,
            limited_stock: false,
            indications: getFieldValue(row.description)
        };
    }

    function restGetJson(url, cb) {
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 8000);

        fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
            signal: controller.signal
        })
            .then(function(resp) {
                clearTimeout(timeoutId);
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .then(function(data) { cb(null, data); })
            .catch(function(err) {
                clearTimeout(timeoutId);
                cb(err);
            });
    }

    function restPostJson(url, payload, cb) {
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(payload || {})
        })
            .then(function(resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .then(function(data) { cb(null, data); })
            .catch(function(err) { cb(err); });
    }

    function logSearchFallback(term, count) {
        if (!term) return;
        restPostJson(searchLogTableApi, {
            search_term: term,
            result_count: count || 0
        }, function() {});
    }

    function applyResults(nextResults, requestId) {
        if (requestId !== activeRequestId) return;
        $scope.results = (Array.isArray(nextResults) ? nextResults : []).map(applyCanonicalCategory);
        $scope.results.forEach(function(drug) {
            var exists = $scope.categories.some(function(cat) { return cat.name === drug.category; });
            if (!exists) {
                $scope.categories.push({
                    name: drug.category,
                    key: drug.category_key,
                    color: drug.category_color || normalizeCategoryColor(drug.category, drug.generic_name),
                    description: ''
                });
            }
        });
        $scope.isLoading = false;
        $scope.showClinicalTip = !!($scope.searchQuery || '').trim() && $scope.results.length > 2;
    }

    function loadCategories() {
        if (!hasGlideAjax) {
            var categoryUrl = '/api/now/table/x_1966129_transpar_category?sysparm_fields=sys_id,name,description,color,icon_code,sort_order&sysparm_query=' + encodeURIComponent('ORDERBYsort_order') + '&sysparm_limit=100';
            restGetJson(categoryUrl, function(err, data) {
                $scope.$apply(function() {
                    if (err) {
                        $scope.categories = buildDemoCategories();
                        return;
                    }
                    var rows = (data && data.result) ? data.result : [];
                    $scope.categories = rows.length
                        ? rows.map(function(r) {
                              return {
                                                                    sys_id: getFieldValue(r.sys_id),
                                                                    name: normalizeCategoryLabel(getFieldValue(r.name)),
                                                                    key: canonicalCategoryName(getFieldValue(r.name)),
                                                                    description: getFieldValue(r.description),
                                                                    color: getFieldValue(r.color) || normalizeCategoryColor(getFieldValue(r.name)),
                                                                    icon_code: getFieldValue(r.icon_code)
                              };
                          })
                        : buildDemoCategories();
                });
            });
            return;
        }

        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'getCategories');
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                try {
                    var parsed = JSON.parse(resp);
                    $scope.categories = Array.isArray(parsed) && parsed.length ? parsed : buildDemoCategories();
                } catch (e) {
                    $scope.categories = buildDemoCategories();
                }
            });
        });
    }

    function fetchAllMedicines(requestId) {
        if (!hasGlideAjax) {
            var url = '/api/now/table/x_1966129_transpar_medicine?sysparm_query=' + encodeURIComponent('active=active^ORDERBYgeneric_name') + '&sysparm_fields=' + medicineFields + '&sysparm_limit=150&sysparm_display_value=all';
            restGetJson(url, function(err, data) {
                if (requestId !== activeRequestId) return;
                $scope.$apply(function() {
                    if (err) {
                        applyResults(demoMedicines, requestId);
                        return;
                    }
                    var rows = (data && data.result) ? data.result : [];
                    applyResults(rows.length ? rows.map(mapMedicineRow) : demoMedicines, requestId);
                });
            });
            return;
        }

        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'listMedicines');
        ga.addParam('sysparm_limit', '150');
        ga.getXMLAnswer(function(resp) {
            if (requestId !== activeRequestId) return;
            $scope.$apply(function() {
                try {
                    var parsed = JSON.parse(resp);
                    applyResults(Array.isArray(parsed) && parsed.length ? parsed : demoMedicines, requestId);
                } catch (e) {
                    applyResults(demoMedicines, requestId);
                }
            });
        });
    }

    // Search function
    $scope.performSearch = function() {
        var query = ($scope.searchQuery || '').trim();
        activeRequestId += 1;
        var requestId = activeRequestId;

        if (!query) {
            $scope.isLoading = true;
            $scope.showClinicalTip = false;
            fetchAllMedicines(requestId);
            return;
        }

        if (query.length < 2) {
            $scope.results = [];
            $scope.showClinicalTip = false;
            $scope.isLoading = false;
            return;
        }

        $scope.isLoading = true;
        $scope.showClinicalTip = false;

        if (!hasGlideAjax) {
            var escaped = query.replace(/\^/g, '');
            var encodedQuery = encodeURIComponent('active=active^generic_nameLIKE' + escaped + '^NQactive=active^brand_nameLIKE' + escaped);
            var url = '/api/now/table/x_1966129_transpar_medicine?sysparm_query=' + encodedQuery + '&sysparm_fields=' + medicineFields + '&sysparm_limit=25&sysparm_display_value=all';

            restGetJson(url, function(err, data) {
                if (requestId !== activeRequestId) return;
                $scope.$apply(function() {
                    if (err) {
                        var demo = runDemoSearch(query);
                        applyResults(demo, requestId);
                        logSearchFallback(query, demo.length);
                        return;
                    }
                    var rows = (data && data.result) ? data.result : [];
                    var mapped = rows.length ? rows.map(mapMedicineRow) : runDemoSearch(query);
                    applyResults(mapped, requestId);
                    logSearchFallback(query, mapped.length);
                });
            });
            return;
        }

        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'searchDrug');
        ga.addParam('sysparm_query', query);
        ga.getXMLAnswer(function(resp) {
            if (requestId !== activeRequestId) return;
            $scope.$apply(function() {
                try {
                    var parsed = JSON.parse(resp);
                    var remoteResults = Array.isArray(parsed) ? parsed : [];
                    applyResults(remoteResults.length ? remoteResults : runDemoSearch(query), requestId);

                    // Log the search when platform API is available.
                    var logGa = new GlideAjax('DPRI_PriceEngine');
                    logGa.addParam('sysparm_name', 'logSearch');
                    logGa.addParam('sysparm_term', query);
                    logGa.addParam('sysparm_count', $scope.results.length);
                    logGa.getXMLAnswer(function() {});
                } catch(e) {
                    applyResults(runDemoSearch(query), requestId);
                }
            });
        });

        $timeout(function() {
            if (requestId === activeRequestId && $scope.isLoading) {
                $scope.isLoading = false;
            }
        }, 10000);
    };

    $scope.searchTopMedicine = function(drugName) {
        $scope.searchQuery = drugName;
        $scope.performSearch();
        if (window.history && window.history.replaceState) {
            var encoded = encodeURIComponent(drugName);
            window.history.replaceState({}, '', '/x_1966129_transpar_search.do?q=' + encoded);
        }
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
            var drugCategory = drug.category_key || canonicalCategoryName((drug.category || '').toString(), (drug.generic_name || '').toString());
            var drugForm = (drug.dosage_form || '').toString().toLowerCase();

            // Category filter
            var categoryKeys = Object.keys($scope.filters.categories).filter(function(key) {
                return !!$scope.filters.categories[key];
            });
            var categoryMatch = categoryKeys.length === 0 || categoryKeys.some(function(key) {
                return canonicalCategoryName(key) === drugCategory;
            });
            
            // Form filter
            var formKeys = Object.keys($scope.filters.forms);
            var formMatch = formKeys.length === 0 || 
                formKeys.every(function(key) { return !$scope.filters.forms[key]; }) ||
                !!$scope.filters.forms[drugForm];
            
            // Price filter
            var priceMatch = drug.dpri_price <= $scope.filters.maxPrice;
            
            // Generic filter
            var genericMatch = !$scope.filters.genericOnly || drug.is_generic;
            
            return categoryMatch && formMatch && priceMatch && genericMatch;
        });
    };

    $scope.getCategoryColor = function(categoryName) {
        var category = $scope.categories.find(function(cat) { return cat.name === categoryName; });
        if (category && category.color) return category.color;
        return normalizeCategoryColor(categoryName);
    };

    $scope.getWhyResultMatters = function(drug) {
        var save = Math.max(0, (parseFloat(drug.hospital_avg) || 0) - (parseFloat(drug.dpri_price) || 0));
        if (!save) return 'You may save up to \u20b10 at accredited pharmacies.';
        return 'You may save up to \u20b1' + save.toFixed(2) + ' at accredited pharmacies.';
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
    $scope.performSearch();
});