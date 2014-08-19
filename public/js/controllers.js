var TweetsController = function($scope, $http, $modal) {

    $scope.title = "@fnthanksmom";

    $scope.openModal = function(template) {

        var modalInstance = $modal.open({
            templateUrl: '/public/partials/modals' + template + '.html',
            controller: ModalInstanceController
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
            $scope.data = response.data;
        });
    };

    $http.get('/api/tweets')
    .success(function(response, status, headers, config) {
        $scope.data = response.data;
    });

};

var ModalInstanceController = function($scope, $modalInstance) {
    
}

angular.module('fnthanksmom')
    .controller('NamesController', ['$scope', '$http', '$modal', TweetsController]);