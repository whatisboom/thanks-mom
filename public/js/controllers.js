var TweetsController = function($scope, $http, $modal) {

    $scope.title = "@fnthanksmom";

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
            $scope.text = "";
            $scope.queue_id = "";
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
        $scope.data = response.data;
    });

};

var addQueuesModalInstanceController = function($scope, $modalInstance, $http) {

    $scope.newQueue = {
        hashtags: {}
    };

    $scope.debug = function() {
        console.log($scope.newQueue.interval == 'Weekly');
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

angular.module('fnthanksmom')
    .controller('TweetsController', ['$scope', '$http', '$modal', TweetsController])
    .controller('QueuesController', ['$scope', '$http', QueuesController]);