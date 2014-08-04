angular.module('fnthanksmom', [
    'ngRoute'
])
.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

        if (history.pushState) {
            //$locationProvider.html5Mode(true);
        }

        $routeProvider
            .when('/names',{
                templateUrl: '/public/partials/names.html',
                controller: 'NamesController'
            })
            .when('/names/:nameId',{
                templateUrl: '/public/partials/names.html',
                controller: 'NamesController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);