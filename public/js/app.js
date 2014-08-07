angular.module('fnthanksmom', [
    'ngRoute'
])
.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

        if (history.pushState) {
            $locationProvider.html5Mode(true);
        }

        $routeProvider
            .when('/tweets',{
                templateUrl: '/public/partials/tweets.html',
                controller: 'TweetsController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);