var TweetsController = function($scope, $http, $modal) {

    $scope.title = "@fnthanksmom";

    $scope.debug = function() {
        console.log($scope.queue_id);
    }

    $scope.openAddQueueModal = function() {

        var modalInstance = $modal.open({
            templateUrl: '/public/partials/modals/addQueue.html',
            controller: ['$scope', '$modalInstance', '$http', addQueuesModalInstanceController],
            scope: $scope
        });

    };

    $scope.queueTweet = function() {

        var data = {
            text: $scope.text,
            queue_id: $scope.queue_id
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

    $scope.newQueue = {};

    $scope.addQueue = function() {

        var data = $scope.newQueue;

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