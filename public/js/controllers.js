function NamesController($scope, $http) {

    $scope.title = "Thanks, Mom."

    $scope.submitName = function() {

        var data = {
            name: $scope.name,
            text: $scope.text,
            hashtags: $scope.hashtags
        };

        $http.post('/api/names', data)
        .success(function(response, status, headers, config) {
            $scope.data.names.push(response.data.name);
            $scope.name = "";
            $scope.text = "";
            $scope.hashtags = "";
        });

    };

    $scope.delete = function(nameId) {
        $http({
            method: "DELETE",
            url: '/api/names/' + nameId
        })
        .success(function(response, status, headers, config) {
            $scope.data = response.data;
        });
    };

    $http.get('/api/names')
    .success(function(response, status, headers, config) {
        $scope.data = response.data;
    });

}

angular.module('fnthanksmom')
    .controller('NamesController', ['$scope', '$http', NamesController]);