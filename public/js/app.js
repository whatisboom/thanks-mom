angular.module('fnthanksmom', [
    'ngRoute',
    'mm.foundation'
])
.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {

        if (history.pushState) {
            $locationProvider.html5Mode(true);
        }

        $routeProvider
            .when('/twitter',{
                templateUrl: '/public/partials/tweets.html',
                controller: 'TweetsController'
            })
            .when('/queues',{
                templateUrl: '/public/partials/queues.html',
                controller: 'QueuesController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);