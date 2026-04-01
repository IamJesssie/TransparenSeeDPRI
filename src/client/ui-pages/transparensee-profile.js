var app = angular.module('TransparenSeeProfileApp', []);

app.controller('ProfileController', function($scope) {
    $scope.profile = {
        name: 'TransparenSee Patient',
        initials: 'TS',
        role: 'dpri_patient',
        session: 'ACTIVE'
    };

    $scope.stats = {
        searches: 12,
        saved: '1,840',
        reports: 3
    };

    $scope.settings = {
        searchType: 'Generic + Brand names',
        radius: '5 km from current location',
        genericDefault: 'Enabled',
        aiMode: 'Friendly clinical guidance'
    };
});
