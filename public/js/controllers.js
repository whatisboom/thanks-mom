var AppController = function($scope, Page) {

    $scope.Page = Page;

};

var IndexController = function($scope, Page) {
    Page.setTitle('BASE APP I DONT KNOW WHAT GOES HERE');
    Page.clearBreadcrumbs();
};

var TwitterController = function($scope, Page) {
    Page.setTitle('Twitter Profiles');
    Page.setBreadcrumbs([
        {
            text: 'Twitter',
            href: '/twitter'
        }
    ]);
};

var TwitterScheduleController = function($scope, $http, $modal, Page) {

    Page.setTitle("@fnthanksmom");
    Page.setBreadcrumbs([
        {
            text: 'Twitter',
            href: '/twitter'
        },
        {
            text: 'Schedule',
            href: '/twitter/schedule'
        }
    ]);
    $scope.tweet = {};
    $scope.account = {'name':'fnthanksmom'};

    $scope.debug = function() {
        console.log($scope.tweet.queue);
    };

    $scope.openAddQueueModal = function() {

        var modalInstance = $modal.open({
            templateUrl: '/public/partials/modals/addQueue.html',
            controller: ['$scope', '$modalInstance', '$http', addQueuesModalInstanceController],
            scope: $scope
        });

    };

    $scope.queueTweet = function() {

        var data = {
            tweet: $scope.tweet
        };

        $http.post('/api/tweets', data)
        .success(function(response, status, headers, config) {
            $scope.data.tweets.push(response.data.tweet);
            $scope.tweet.text = "";
            $scope.tweet.queue_id = "";
        });

    };

    $scope.deleteTweet = function(tweetId) {
        $http({
            method: "DELETE",
            url: '/api/tweets/' + tweetId
        })
        .success(function(response, status, headers, config) {
            $scope.data.tweets = response.data.tweets;
        });
    };

    $http.get('/api/tweets')
    .success(function(response, status, headers, config) {
        console.log(response.meta);
        $scope.meta = response.meta;
        $scope.data = response.data;
    });

};

var addQueuesModalInstanceController = function($scope, $modalInstance, $http) {

    $scope.newQueue = {
        hashtags: {}
    };

    $scope.debug = function() {
        console.log($scope.newQueue);
    }

    $scope.intervals = ['Weekly', 'Daily', 'Hourly'];

    $scope.daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    $scope.hoursOfDay = ['12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];
    $scope.minutesOfHour = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"];

    $scope.addQueue = function() {

        var data = {
            queue: $scope.newQueue
        };

        $http.post('/api/queues', data)
        .success(function(response, status, headers, config) {
            if (typeof $scope.data.queues === 'object') {
                $scope.data.queues.push(response.data.queue);
            }
            else {
                $scope.data.queues = [response.data.queue];
            }
            $scope.queue_id = $scope.data.queues.length;
            $modalInstance.close(response.data.queue);
        })
        .error(function() {
            console.log(arguments);
        });
    };
    
};

var QueuesController = function($scope, $http, $modal) {
    $scope.title = "@fnthanksmom's Queue's";

    $http.get('/api/queues')
    .success(function(response, status, headers, config) {

        $scope.data = response.data;

    });
};

var NavController = function($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        var pattern = new RegExp('^' + viewLocation + '$');
        return pattern.test($location.path(),['i']);
    };
};

angular.module('fnthanksmom')
    .controller('AppController', ['$scope', 'Page', AppController])
    .controller('NavController', ['$scope', '$location', NavController])
    .controller('IndexController', ['$scope', 'Page', IndexController])
    .controller('TwitterController', ['$scope', 'Page', TwitterController])
    .controller('TwitterScheduleController', ['$scope', '$http', '$modal', 'Page', TwitterScheduleController])
    .controller('QueuesController', ['$scope', '$http', QueuesController])
    .factory('Page', function() {
        var home = [{
            text: "Home",
            href: "/"
        }];
        var breadcrumbs = home;
        var title = "";
        return {
            breadcrumbs: function() { return breadcrumbs; },
            setBreadcrumbs: function(newBreadcrumbs) { breadcrumbs = home.concat(newBreadcrumbs); },
            clearBreadcrumbs: function(newBreadcrumbs) { breadcrumbs = home; },
            title: function() { return title; },
            setTitle: function(newTitle) { title = newTitle; }
        }
    });