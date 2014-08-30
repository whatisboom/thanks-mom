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
            .when('/', {
                templateUrl: '/public/partials/index.html',
                controller: 'IndexController'
            })
            .when('/twitter', {
                templateUrl: '/public/partials/twitter/index.html',
                controller: 'TwitterController'
            })
             .when('/twitter/schedule', {
                templateUrl: '/public/partials/twitter/schedule.html',
                controller: 'TwitterScheduleController'
            })
            .when('/queues', {
                templateUrl: '/public/partials/queues.html',
                controller: 'QueuesController'
            })
            .when('/auth/twitter/callback', {
                templateUrl: '/public/partials/twitter/index.html',
                controller: 'TwitterCallbackController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);