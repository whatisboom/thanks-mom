function TweetsController($scope, $http) {

    $scope.title = "@fnthanksmom";

    $scope.queueTweet = function() {

        var data = {
            text: $scope.text,
            queue: $scope.queue
        };

        $http.post('/api/tweets', data)
        .success(function(response, status, headers, config) {
            $scope.data.tweets.push(response.data.tweet);
            $scope.text = "";
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

}

angular.module('fnthanksmom')
    .controller('NamesController', ['$scope', '$http', TweetsController]);