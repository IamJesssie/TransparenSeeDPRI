# 03 — UI Pages (Jelly + AngularJS)

Every UI Page is wrapped in the Jelly XML boilerplate below.
Write your AngularJS/HTML freely inside it.

---

## Jelly Wrapper (always use this shell)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
<!-- YOUR HTML + ANGULARJS GOES HERE -->
</j:jelly>
```

---

## Page 1: `transparensee_home` (Home / Search Portal)

**URL:** `devXXX.service-now.com/x_snc_transparensee_home.do`  
**HTML Tab:**

```xml
<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
<!DOCTYPE html>
<html ng-app="TransparenSeeApp">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="stylesheet" href="/x_snc_transparensee_theme.cssdo"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&amp;family=DM+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
  <title>TransparenSee — Affordable Medicine Finder</title>
</head>
<body ng-controller="HomeController">

  <!-- NAVBAR -->
  <nav class="ts-navbar">
    <div class="ts-navbar-inner">
      <div class="ts-logo">
        <img src="/x_snc_transparensee_logo.png" alt="TransparenSee" height="36"/>
        <span>TransparenSee</span>
      </div>
      <ul class="ts-nav-links">
        <li><a href="/x_snc_transparensee_home.do" class="active">Home</a></li>
        <li><a href="/x_snc_transparensee_search.do">Search</a></li>
        <li><a href="/x_snc_transparensee_map.do">Map</a></li>
        <li><a href="/x_snc_transparensee_profile.do">Profile</a></li>
      </ul>
    </div>
  </nav>

  <!-- HERO SECTION -->
  <section class="ts-hero">
    <div class="ts-hero-content">
      <span class="ts-eyebrow">DPRI 2025 · Department of Health</span>
      <h1 class="ts-hero-headline">
        Bridging the gap between<br/>
        patients and <span class="ts-highlight">affordable medicine.</span>
      </h1>
      <p class="ts-hero-sub">Real-time DPRI pricing, clinical insights, and financial transparency at your fingertips.</p>

      <!-- SEARCH BAR -->
      <div class="ts-search-wrap">
        <div class="ts-search-bar" ng-class="{'ts-search-focused': searchFocused}">
          <span class="ts-search-icon">&#128269;</span>
          <input
            type="text"
            ng-model="searchQuery"
            ng-change="onSearchChange()"
            ng-focus="searchFocused=true"
            ng-blur="onSearchBlur()"
            placeholder="Search Drug Name (e.g., Amoxicillin...)"
            class="ts-search-input"
            autocomplete="off"
          />
          <button class="ts-search-btn" ng-click="goToResults()">Search</button>
        </div>

        <!-- AUTOCOMPLETE DROPDOWN -->
        <div class="ts-autocomplete" ng-show="suggestions.length > 0 &amp;&amp; showSuggestions">
          <div class="ts-suggestion-item"
               ng-repeat="drug in suggestions"
               ng-click="selectSuggestion(drug)">
            <span class="ts-sug-name">{{ drug.generic_name }}</span>
            <span class="ts-sug-dosage">{{ drug.dosage_strength }}</span>
            <span class="ts-sug-price">₱{{ drug.dpri_price }}</span>
            <span class="ts-sug-cat">{{ drug.category }}</span>
          </div>
        </div>
      </div>

      <!-- POPULAR SEARCHES -->
      <div class="ts-popular">
        <span class="ts-popular-label">POPULAR SEARCHES:</span>
        <button class="ts-chip" ng-repeat="term in popularTerms" ng-click="quickSearch(term)">
          {{ term }}
        </button>
      </div>
    </div>
  </section>

  <!-- BENTO STATS ROW -->
  <section class="ts-stats-section ts-container">
    <div class="ts-bento-row">
      <div class="ts-stat-card ts-stat-teal">
        <span class="ts-stat-icon">&#128138;</span>
        <span class="ts-stat-value">{{ stats.totalDrugs }}</span>
        <span class="ts-stat-label">DRUGS IN DPRI 2025</span>
      </div>
      <div class="ts-stat-card ts-stat-gold">
        <span class="ts-stat-icon">&#128176;</span>
        <span class="ts-stat-value">65%</span>
        <span class="ts-stat-label">AVG SAVINGS VS HOSPITAL</span>
      </div>
      <div class="ts-stat-card ts-stat-navy">
        <span class="ts-stat-icon">&#127968;</span>
        <span class="ts-stat-value">{{ stats.totalPharmacies }}</span>
        <span class="ts-stat-label">ACCREDITED PHARMACIES</span>
      </div>
    </div>
  </section>

  <!-- RECENT ACTIVITY + SAVINGS TIP -->
  <section class="ts-container ts-two-col">
    <div class="ts-recent-card ts-card">
      <h3 class="ts-card-title">&#128260; Recent Activity</h3>
      <div class="ts-recent-item" ng-repeat="item in recentSearches">
        <span class="ts-recent-icon">&#128138;</span>
        <div>
          <div class="ts-recent-name">{{ item.search_term }}</div>
          <div class="ts-recent-time">{{ item.time_ago }}</div>
        </div>
        <button class="ts-btn-ghost" ng-click="quickSearch(item.search_term)">&#8250;</button>
      </div>
    </div>
    <div class="ts-tip-card ts-card ts-card-glass-gold">
      <span class="ts-tip-label">SAVINGS TIP</span>
      <p class="ts-tip-text">Generic alternatives for common medicines can save you up to 65% this month.</p>
      <a href="/x_snc_transparensee_search.do" class="ts-btn-ghost-teal">LEARN MORE &#8594;</a>
    </div>
  </section>

  <script src="angular.min.js"></script>
  <script src="/x_snc_transparensee_home.jsdo"></script>
</body>
</html>
</j:jelly>
```

**Client Script Tab (AngularJS Controller):**

```javascript
var app = angular.module('TransparenSeeApp', []);

app.controller('HomeController', function($scope, $timeout) {
    $scope.searchQuery   = '';
    $scope.suggestions   = [];
    $scope.showSuggestions = false;
    $scope.searchFocused = false;
    $scope.popularTerms  = ['Paracetamol', 'Metformin', 'Amoxicillin', 'Amlodipine'];
    $scope.recentSearches = [];
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
                    $scope.suggestions = JSON.parse(resp).slice(0, 6);
                    $scope.showSuggestions = true;
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
        window.location.href = '/x_snc_transparensee_detail.do?id=' + drug.sys_id;
    };

    $scope.goToResults = function() {
        if ($scope.searchQuery.trim()) {
            window.location.href = '/x_snc_transparensee_search.do?q=' + encodeURIComponent($scope.searchQuery);
        }
    };

    $scope.quickSearch = function(term) {
        window.location.href = '/x_snc_transparensee_search.do?q=' + encodeURIComponent(term);
    };

    // Load stats on page init
    (function loadStats() {
        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'getStats');
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                var data = JSON.parse(resp);
                $scope.stats = data;
            });
        });
    })();
});
```

---

## Page 2: `transparensee_search` (Search Results)

Key AngularJS controller additions for results page:

```javascript
app.controller('SearchController', function($scope, $location) {
    // Read query param from URL
    var params = new URLSearchParams(window.location.search);
    $scope.searchQuery = params.get('q') || '';
    $scope.drugResults = [];
    $scope.isLoading   = true;
    $scope.filterOpen  = false;
    $scope.filters     = { generic_only: false, category: '', form: '' };

    // Run search on load
    if ($scope.searchQuery) {
        var ga = new GlideAjax('DPRI_PriceEngine');
        ga.addParam('sysparm_name', 'searchDrug');
        ga.addParam('sysparm_query', $scope.searchQuery);
        ga.getXMLAnswer(function(resp) {
            $scope.$apply(function() {
                $scope.drugResults = JSON.parse(resp);
                $scope.isLoading = false;
            });
        });
    }

    $scope.goToDetail = function(drugId) {
        window.location.href = '/x_snc_transparensee_detail.do?id=' + drugId;
    };

    $scope.filteredResults = function() {
        return $scope.drugResults.filter(function(d) {
            if ($scope.filters.generic_only && !d.is_generic) return false;
            if ($scope.filters.category && d.category !== $scope.filters.category) return false;
            if ($scope.filters.form && d.dosage_form !== $scope.filters.form) return false;
            return true;
        });
    };
});
```
