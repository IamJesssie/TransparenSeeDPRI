function bootstrapHomeController() {
    if (typeof angular === 'undefined') {
        if (typeof addLoadEvent === 'function') {
            addLoadEvent(function() {
                bootstrapHomeController();
            });
        }
        return;
    }

    var app = angular.module('TransparenSeeApp', []);

    app.controller('HomeController', function($scope, $timeout, $window, $document) {
    var hasGlideAjax = false;

    $scope.searchQuery   = '';
    $scope.suggestions   = [];
    $scope.searchState   = 'idle';
    $scope.showSuggestions = false;
    $scope.searchFocused = false;
    $scope.popularTerms  = ['Paracetamol', 'Metformin', 'Amoxicillin', 'Amlodipine'];
    $scope.recentSearches = [];
    $scope.savingsItems = [
        { name: 'Metformin 500mg', save: 'save P13.25/tablet' },
        { name: 'Atorvastatin 20mg', save: 'save P26.50/tablet' },
        { name: 'Amlodipine 5mg', save: 'save P15.25/tablet' }
    ];
    $scope.statsLoading = false;
    $scope.stats = { totalDrugs: '2,847', totalPharmacies: '1,234' };
    $scope.motionEnabled = false;
    $scope.motion = {
        reduced: false,
        countupDone: false,
        revealReady: false
    };
    var fallbackSuggestions = [
        { sys_id: 'demo-1', generic_name: 'Paracetamol', dosage_strength: '500mg', dpri_price: 8.5, category: 'Analgesic/Fever' },
        { sys_id: 'demo-2', generic_name: 'Amoxicillin', dosage_strength: '500mg', dpri_price: 1.87, category: 'Antibiotic' },
        { sys_id: 'demo-3', generic_name: 'Metformin', dosage_strength: '500mg', dpri_price: 0.54, category: 'Antidiabetic' },
        { sys_id: 'demo-4', generic_name: 'Amlodipine', dosage_strength: '5mg', dpri_price: 0.33, category: 'Antihypertensive' },
        { sys_id: 'demo-5', generic_name: 'Cetirizine', dosage_strength: '10mg', dpri_price: 0.39, category: 'Antihistamine' },
        { sys_id: 'demo-6', generic_name: 'Salbutamol', dosage_strength: '2mg/5mL', dpri_price: 4.61, category: 'Bronchodilator' }
    ];

    var searchTimeout = null;
    var recentTicker = null;
    var doc = $document && $document[0] ? $document[0] : null;
    var win = $window || null;
    hasGlideAjax = !!(win && typeof win.GlideAjax === 'function');
    var medicineTableApi = '/api/now/table/x_1966129_transpar_medicine';
    var pharmacyTableApi = '/api/now/table/x_1966129_transpar_pharmacy';
    var searchLogTableApi = '/api/now/table/x_1966129_transpar_search_log';

    function parseToNumber(value) {
        if (value === undefined || value === null) return 0;
        if (typeof value === 'number') return isFinite(value) ? Math.max(0, Math.floor(value)) : 0;

        if (typeof value === 'object') {
            if (typeof value.value !== 'undefined' && value.value !== null && value.value !== '') return parseToNumber(value.value);
            if (typeof value.display_value !== 'undefined' && value.display_value !== null && value.display_value !== '') return parseToNumber(value.display_value);
            return 0;
        }

        var text = String(value).trim();
        if (!text) return 0;
        var normalized = text.replace(/,/g, '');
        if (!/^-?\d+(\.\d+)?$/.test(normalized)) return 0;
        var num = Number(normalized);
        if (!isFinite(num)) return 0;
        return Math.max(0, Math.floor(num));
    }

    function parseServiceNowDate(dateLike) {
        if (!dateLike) return null;
        var text = String(dateLike).trim();
        if (!text) return null;

        var ms = Date.parse(text);
        if (!isNaN(ms)) return new Date(ms);

        var m = text.match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/);
        if (!m) return null;
        return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]));
    }

    function formatRecentTimeAgo(ts) {
        if (!ts) return 'Just now';
        var seconds = Math.floor((Date.now() - ts) / 1000);
        if (seconds < 15) return 'Just now';
        if (seconds < 60) return seconds + 's ago';
        var minutes = Math.floor(seconds / 60);
        if (minutes < 60) return minutes + 'm ago';
        var hours = Math.floor(minutes / 60);
        if (hours < 24) return hours + 'h ago';
        var days = Math.floor(hours / 24);
        if (days < 7) return days + 'd ago';
        return new Date(ts).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' });
    }

    function refreshRecentTimeAgo() {
        if (!$scope.recentSearches || !$scope.recentSearches.length) return;
        $scope.recentSearches.forEach(function(item) {
            if (item && item._ts) {
                item.time_ago = formatRecentTimeAgo(item._ts);
            }
        });
    }

    function startRecentTicker() {
        if (recentTicker) $timeout.cancel(recentTicker);
        var tick = function() {
            refreshRecentTimeAgo();
            recentTicker = $timeout(tick, 60000, false);
        };
        tick();
    }

    function getFieldValue(v) {
        if (v && typeof v === 'object') {
            if (typeof v.display_value !== 'undefined' && v.display_value !== null && v.display_value !== '') return String(v.display_value);
            if (typeof v.value !== 'undefined' && v.value !== null && v.value !== '') return String(v.value);
            return '';
        }
        return v ? String(v) : '';
    }

    function restGetJson(url, cb) {
        fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'same-origin'
        })
            .then(function(resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .then(function(data) { cb(null, data); })
            .catch(function(err) { cb(err); });
    }

    function restCount(url, cb) {
        fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'same-origin'
        })
            .then(function(resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                var count = parseInt(resp.headers.get('x-total-count'), 10);
                cb(null, isNaN(count) ? 0 : count);
            })
            .catch(function(err) { cb(err, 0); });
    }

    function loadRecentSearches() {
        if (!hasGlideAjax) {
            var recentUrl = searchLogTableApi + '?sysparm_fields=search_term,searched_at,search_timestamp,sys_created_on&sysparm_query=' + encodeURIComponent('ORDERBYDESCsys_created_on') + '&sysparm_display_value=all&sysparm_limit=5';
            restGetJson(recentUrl, function(err, data) {
                $scope.$apply(function() {
                    if (err) {
                        $scope.recentSearches = [];
                        return;
                    }
                    var rows = (data && data.result) ? data.result : [];
                    $scope.recentSearches = rows
                        .filter(function(item) { return getFieldValue(item.search_term); })
                        .map(function(item) {
                            var when = getFieldValue(item.searched_at) || getFieldValue(item.search_timestamp) || getFieldValue(item.sys_created_on);
                            var parsed = parseServiceNowDate(when);
                            return {
                                search_term: getFieldValue(item.search_term),
                                _ts: parsed ? parsed.getTime() : Date.now(),
                                time_ago: formatRecentTimeAgo(parsed ? parsed.getTime() : Date.now())
                            };
                        });
                    startRecentTicker();
                });
            });
            return;
        }

        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'getRecentSearches');
        ga.addParam('sysparm_limit', '5');
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                try {
                    var parsed = JSON.parse(resp);
                    var rows = Array.isArray(parsed) ? parsed : [];
                    $scope.recentSearches = rows.map(function(item) {
                        var ts = parseInt(item.searched_at_ms, 10);
                        if (!ts || isNaN(ts)) {
                            var parsedDate = parseServiceNowDate(item.searched_at);
                            ts = parsedDate ? parsedDate.getTime() : Date.now();
                        }
                        return {
                            search_term: item.search_term,
                            _ts: ts,
                            time_ago: formatRecentTimeAgo(ts)
                        };
                    });
                    startRecentTicker();
                } catch (e) {
                    $scope.recentSearches = [];
                }
            });
        });
    }

    function setStatsFromData(data) {
        var drugCount = parseToNumber(data.totalDrugs || data.total_drugs || data.drug_count || data.total_medicines);
        var pharmacyCount = parseToNumber(data.totalPharmacies || data.total_pharmacies || data.pharmacy_count);

        if (!drugCount) drugCount = 2847;
        if (!pharmacyCount) pharmacyCount = 1234;

        $scope.stats = {
            totalDrugs: formatInt(drugCount),
            totalPharmacies: formatInt(pharmacyCount)
        };
    }

    function formatInt(value) {
        return Number(value || 0).toLocaleString('en-PH');
    }

    function animateValue(el, target, suffix) {
        if (!el) return;
        if ($scope.motion.reduced || target <= 0) {
            el.textContent = formatInt(target) + (suffix || '');
            return;
        }
        var duration = 1100;
        var start = Date.now();
        var from = 0;
        var raf = win && typeof win.requestAnimationFrame === 'function'
            ? win.requestAnimationFrame.bind(win)
            : function(cb) { return $timeout(function() { cb(Date.now()); }, 16, false); };
        function tick(now) {
            var t = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - t, 3);
            var current = Math.round(from + (target - from) * eased);
            el.textContent = formatInt(current) + (suffix || '');
            if (t < 1) {
                raf(tick);
            }
        }
        raf(tick);
    }

    function runCountup() {
        if ($scope.motion.countupDone) return;
        if (!doc || typeof doc.querySelectorAll !== 'function') return;
        var nodes = doc.querySelectorAll('.js-countup');
        if (!nodes.length) return;
        nodes.forEach(function(el) {
            var fixedTarget = parseToNumber(el.getAttribute('data-countup-value'));
            var key = el.getAttribute('data-countup-key');
            var liveTarget = key ? parseToNumber($scope.stats[key]) : 0;
            var target = fixedTarget || liveTarget;
            var suffix = el.getAttribute('data-countup-suffix') || '';
            animateValue(el, target, suffix);
        });
        $scope.motion.countupDone = true;
    }

    function initParallax() {
        if ($scope.motion.reduced) return;
        if (!doc || !win || typeof doc.querySelectorAll !== 'function') return;
        var layers = doc.querySelectorAll('.js-parallax');
        if (!layers.length) return;
        var latestY = win.scrollY || 0;
        var ticking = false;
        var raf = typeof win.requestAnimationFrame === 'function'
            ? win.requestAnimationFrame.bind(win)
            : function(cb) { return $timeout(cb, 16, false); };
        function update() {
            layers.forEach(function(node) {
                var speed = parseFloat(node.getAttribute('data-parallax')) || 8;
                var offset = Math.max(-14, Math.min(14, latestY / speed));
                node.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
            });
            ticking = false;
        }
        win.addEventListener('scroll', function() {
            latestY = win.scrollY || 0;
            if (!ticking) {
                raf(update);
                ticking = true;
            }
        }, { passive: true });
    }

    function initReveal() {
        if ($scope.motion.revealReady) return;
        if (!doc || typeof doc.querySelectorAll !== 'function') return;
        var targets = doc.querySelectorAll('.ts-reveal');
        if (!targets.length) return;
        if ($scope.motion.reduced || !win || typeof win.IntersectionObserver !== 'function') {
            targets.forEach(function(el) { el.classList.add('is-visible'); });
            runCountup();
            return;
        }
        var observer = new win.IntersectionObserver(function(entries, obs) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                if (entry.target.getAttribute('data-animate') === 'stats') {
                    runCountup();
                }
                obs.unobserve(entry.target);
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -6% 0px'
        });
        targets.forEach(function(el) { observer.observe(el); });
        $scope.motion.revealReady = true;
    }

    function initMotion() {
        $scope.motionEnabled = true;
        var mq = win && typeof win.matchMedia === 'function' ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
        $scope.motion.reduced = !!(mq && mq.matches);
        initReveal();
        initParallax();
    }

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
            if (!hasGlideAjax) {
                var q = ($scope.searchQuery || '').toLowerCase();
                $scope.suggestions = fallbackSuggestions.filter(function(drug) {
                    return drug.generic_name.toLowerCase().indexOf(q) !== -1;
                }).slice(0, 6);
                $scope.searchState = $scope.suggestions.length ? 'ready' : 'empty';
                $scope.showSuggestions = $scope.suggestions.length > 0;
                return;
            }

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

        if (!hasGlideAjax || String(drug.sys_id).indexOf('demo-') === 0) {
            $window.location.href = '/x_1966129_transpar_search.do?q=' + encodeURIComponent(drug.generic_name);
            return;
        }

        // Log the search
        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'logSearch');
        ga.addParam('sysparm_term', drug.generic_name);
        ga.addParam('sysparm_count', 1);
        ga.addParam('sysparm_drug_id', drug.sys_id);
        ga.getXMLAnswer(function(resp) {
            loadRecentSearches();
            // Navigate to detail page
            $window.location.href = '/x_1966129_transpar_detail.do?id=' + drug.sys_id;
        });
    };

    $scope.goToResults = function() {
        if ($scope.searchQuery.trim()) {
            $window.location.href = '/x_1966129_transpar_search.do?q=' + encodeURIComponent($scope.searchQuery);
        }
    };

    $scope.quickSearch = function(term) {
        $window.location.href = '/x_1966129_transpar_search.do?q=' + encodeURIComponent(term);
    };

    // Load stats on page init
    (function loadStats() {
        if (!hasGlideAjax) {
            var medCountUrl = medicineTableApi + '?sysparm_query=' + encodeURIComponent('active=active') + '&sysparm_fields=sys_id&sysparm_limit=1&sysparm_count=true';
            var pharmacyCountUrl = pharmacyTableApi + '?sysparm_query=' + encodeURIComponent('is_active=true^accreditation_status=approved') + '&sysparm_fields=sys_id&sysparm_limit=1&sysparm_count=true';

            restCount(medCountUrl, function(errDrug, drugCount) {
                restCount(pharmacyCountUrl, function(errPharmacy, pharmacyCount) {
                    $scope.$apply(function() {
                        if (errDrug || errPharmacy) {
                            setStatsFromData({ totalDrugs: 2847, totalPharmacies: 1234 });
                        } else {
                            setStatsFromData({ totalDrugs: drugCount, totalPharmacies: pharmacyCount });
                        }
                    });
                    $timeout(function() { runCountup(); }, 80, false);
                });
            });
            return;
        }

        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'getStats');
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                try {
                    var data = JSON.parse(resp);
                    setStatsFromData(data || {});
                    if ($scope.motion.countupDone) {
                        $scope.motion.countupDone = false;
                    }
                } catch(e) {
                    console.error('Stats loading error:', e);
                    setStatsFromData({ totalDrugs: 2847, totalPharmacies: 1234 });
                }
            });
            $timeout(function() {
                runCountup();
            }, 80, false);
        });
    })();

    loadRecentSearches();

        $timeout(function() {
            initMotion();
        }, 0, false);
    });
}

bootstrapHomeController();