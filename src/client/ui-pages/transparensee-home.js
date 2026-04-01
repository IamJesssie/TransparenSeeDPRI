var app = angular.module('TransparenSeeApp', []);

app.controller('HomeController', function($scope, $timeout, $window, $document) {
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
    $scope.motionEnabled = false;
    $scope.motion = {
        reduced: false,
        countupDone: false,
        revealReady: false
    };

    var searchTimeout = null;
    var doc = $document && $document[0] ? $document[0] : null;
    var win = $window || null;

    function parseToNumber(value) {
        if (value === undefined || value === null) return 0;
        var digits = String(value).replace(/[^\d]/g, '');
        return digits ? parseInt(digits, 10) : 0;
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
                    if ($scope.motion.countupDone) {
                        $scope.motion.countupDone = false;
                    }
                } catch(e) {
                    console.error('Stats loading error:', e);
                }
            });
            $timeout(function() {
                runCountup();
            }, 80, false);
        });
    })();

    $timeout(function() {
        initMotion();
    }, 0, false);
});